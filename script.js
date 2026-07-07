const GLYPH = { html: "🌐", css: "🎨", js: "⚡", json: "🧩", svg: "◈", md: "📝", img: "🖼️", dir: "🗂️" };
const TONE = { html: "var(--t-html)", css: "var(--t-css)", js: "var(--t-js)", json: "var(--t-json)", svg: "var(--t-svg)", md: "var(--t-md)", img: "var(--t-img)", dir: "var(--t-dir)" };

const FALLBACK = {
  name: "~",
  type: "dir",
  children: [
    { name: "index.html", type: "html", size: "4.8 KB", mod: "live", code: "<main class=\"workspace\">\n  <section class=\"desktop\">\n    <aside id=\"tree\"></aside>\n    <div id=\"grid\"></div>\n  </section>\n</main>" },
    { name: "style.css", type: "css", size: "8.9 KB", mod: "live", code: ":root {\n  --cyan: #53f4ff;\n  --pink: #ff4fd8;\n}\n.card {\n  backdrop-filter: blur(20px);\n}" },
    { name: "script.js", type: "js", size: "5.3 KB", mod: "live", code: "fetch('./data.json')\n  .then(response => response.json())\n  .then(mount)\n  .catch(() => mount(FALLBACK));" },
    { name: "assets", type: "dir", children: [
      { name: "logo.svg", type: "svg", size: "1.1 KB", mod: "today", code: "<svg viewBox=\"0 0 100 100\">\n  <path d=\"M20 50 L50 20 L80 50 L50 80 Z\"/>\n</svg>" },
      { name: "preview.png", type: "img", size: "128 KB", mod: "today", code: "Binary image preview placeholder." }
    ]},
    { name: "docs", type: "dir", children: [
      { name: "README.md", type: "md", size: "2.2 KB", mod: "today", code: "# FileVerse 2.0\n\nA CodePen 2.0 challenge about files, structure and creative workflows." },
      { name: "config.json", type: "json", size: "0.9 KB", mod: "today", code: "{\n  \"theme\": \"neon\",\n  \"view\": \"grid\",\n  \"challenge\": \"files\"\n}" }
    ]}
  ]
};

const $ = (id) => document.getElementById(id);
let view = "grid";
let current = null;
let ROOT = null;

function hi(src) {
  let s = String(src).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/(&quot;|&#39;|"|')(.*?)\1/g, '<span class="a">$1$2$1</span>');
  s = s.replace(/\b(const|let|function|return|export|import|for|forEach|new|if|else|await|then|catch)\b/g, '<span class="k">$1</span>');
  s = s.replace(/(&lt;\/?[a-zA-Z][\w-]*)/g, '<span class="c">$1</span>');
  return s;
}

const glyph = (f) => f.type === "dir" ? GLYPH.dir : (GLYPH[f.type] || "📄");
const tone = (f) => f.type === "dir" ? TONE.dir : (TONE[f.type] || "var(--muted)");
const label = (f) => f.name === "~" ? "Root" : f.name;

function link(node, parent, path) {
  node.parent = parent;
  node.path = path;
  if (node.children) node.children.forEach((child) => link(child, node, path + node.name + "/"));
}

function buildTree(node) {
  const wrap = document.createElement("div");
  (node.children || []).forEach((child) => {
    const row = document.createElement("div");
    row.className = "node";
    const isDir = child.type === "dir";
    row.innerHTML = `<span class="tw">${isDir ? "▶" : ""}</span><span class="ic">${glyph(child)}</span><span class="nm">${child.name}</span>${isDir ? `<span class="count">${child.children.length}</span>` : ""}`;
    wrap.appendChild(row);

    if (isDir) {
      const kids = buildTree(child);
      kids.className = "children";
      kids.style.display = "none";
      wrap.appendChild(kids);
      row.addEventListener("click", (event) => {
        event.stopPropagation();
        const shown = kids.style.display !== "none";
        kids.style.display = shown ? "none" : "block";
        row.classList.toggle("open", !shown);
        openDir(child);
      });
    } else {
      row.addEventListener("click", (event) => {
        event.stopPropagation();
        openFile(child);
      });
    }
  });
  return wrap;
}

function renderCrumbs(dir) {
  const chain = [];
  for (let node = dir; node; node = node.parent) chain.unshift(node);
  $("crumbs").innerHTML = "";
  chain.forEach((node, index) => {
    if (index) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "/";
      $("crumbs").appendChild(sep);
    }
    const button = document.createElement("button");
    button.textContent = node.name;
    button.addEventListener("click", () => openDir(node));
    $("crumbs").appendChild(button);
  });
}

function openDir(dir) {
  current = dir;
  $("dirTitle").textContent = label(dir);
  renderCrumbs(dir);
  const items = (dir.children || []).slice().sort((a, b) => (b.type === "dir") - (a.type === "dir"));
  const grid = $("grid");
  grid.innerHTML = "";
  items.forEach((file, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--tone", tone(file));
    card.style.animationDelay = `${index * 45}ms`;
    card.innerHTML = `<span class="tag">${file.type === "dir" ? "dir" : file.type}</span><div class="glyph">${glyph(file)}</div><div class="nm">${file.name}</div><div class="meta">${file.type === "dir" ? file.children.length + " items" : file.size + " · " + file.mod}</div>`;
    card.addEventListener("click", () => file.type === "dir" ? openDir(file) : openFile(file));
    grid.appendChild(card);
  });
  $("mFiles").textContent = items.filter((file) => file.type !== "dir").length;
  $("mFolders").textContent = items.filter((file) => file.type === "dir").length;
}

function setView(nextView) {
  view = nextView;
  $("grid").className = "grid" + (view === "list" ? " list" : "");
  $("btnGrid").classList.toggle("on", view === "grid");
  $("btnList").classList.toggle("on", view === "list");
}

document.querySelectorAll(".view-toggle button").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

function openFile(file) {
  $("pvIcon").textContent = glyph(file);
  $("pvName").textContent = file.name;
  $("pvPath").textContent = (file.path || "/") + file.name;
  $("pvType").textContent = file.type.toUpperCase() + " file";
  $("pvSize").textContent = file.size || "—";
  $("pvLines").textContent = file.code ? file.code.split("\n").length : "—";
  $("pvMod").textContent = file.mod || "—";
  $("pvCode").innerHTML = file.code ? hi(file.code) : "No preview available.";
  $("drawer").classList.add("show");
  $("drawer").setAttribute("aria-hidden", "false");
  $("scrim").classList.add("show");
}

function closeDrawer() {
  $("drawer").classList.remove("show");
  $("drawer").setAttribute("aria-hidden", "true");
  $("scrim").classList.remove("show");
}

function allFiles(node, acc = []) {
  (node.children || []).forEach((child) => child.type === "dir" ? allFiles(child, acc) : acc.push(child));
  return acc;
}

$("pvClose").addEventListener("click", closeDrawer);
$("scrim").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDrawer(); });
$("shuffleBtn").addEventListener("click", () => {
  const pool = allFiles(ROOT);
  if (pool.length) openFile(pool[Math.floor(Math.random() * pool.length)]);
});

function mount(root) {
  ROOT = root;
  link(ROOT, null, "");
  $("tree").innerHTML = "";
  $("tree").appendChild(buildTree(ROOT));
  openDir(ROOT);
}

fetch("./data.json")
  .then((response) => {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  })
  .then(mount)
  .catch(() => mount(FALLBACK));
