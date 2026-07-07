/* ───────────────────────────────────────────────
   FileVerse 2.0 — a file explorer that reads its
   own file tree from data.json
   Tree · Grid/List · Breadcrumbs · Preview drawer
   ─────────────────────────────────────────────── */

const GLYPH = {
  html: "🌐", css: "🎨", js: "⚡", json: "🧩",
  svg: "◈", md: "📝", img: "🖼️", dir: "🗂️"
};
const TONE = {
  html: "var(--t-html)", css: "var(--t-css)", js: "var(--t-js)",
  json: "var(--t-json)", svg: "var(--t-svg)", md: "var(--t-md)",
  img: "var(--t-img)", dir: "var(--t-dir)"
};

/* tiny highlighter for the preview: tags, strings, keywords */
function hi(src) {
  let s = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  s = s.replace(/(&quot;|&#39;|"|')(.*?)\1/g, '<span class="a">$1$2$1</span>');
  s = s.replace(/\b(const|let|function|return|export|import|for|forEach|new|if|else|await)\b/g, '<span class="k">$1</span>');
  s = s.replace(/(&lt;\/?[a-zA-Z][\w-]*)/g, '<span class="c">$1</span>');
  return s;
}

/* ── fallback tree, used only if data.json can't be fetched
      (e.g. opening index.html directly from disk offline) ── */
const FALLBACK = {
  name: "~", type: "dir", children: [
    { name: "index.html", type: "html", size: "3.4 KB", mod: "just now",
      code: "<!-- open on CodePen 2.0 to load data.json -->" },
    { name: "style.css", type: "css", size: "7.1 KB", mod: "2m ago", code: ":root { --cyan: #53f4ff; }" },
    { name: "script.js", type: "js", size: "5.6 KB", mod: "2m ago", code: "const FS = await fetch('./data.json');" },
    { name: "data.json", type: "json", size: "2.9 KB", mod: "now",
      code: "{ \"note\": \"This Pen reads its own tree from here.\" }" }
  ]
};

/* ── element refs ── */
const $ = id => document.getElementById(id);
const treeEl = $("tree"), gridEl = $("grid"), crumbsEl = $("crumbs"), dirTitle = $("dirTitle");
const drawer = $("drawer"), scrim = $("scrim");
let view = "grid", current = null, ROOT = null;

const glyph = f => f.type === "dir" ? GLYPH.dir : (GLYPH[f.type] || "📄");
const tone = f => f.type === "dir" ? TONE.dir : (TONE[f.type] || "var(--faint)");
const label = f => f.name === "~" ? "Root" : f.name;

/* add parent back-pointers + paths so breadcrumbs work */
function link(node, parent, path) {
  node.parent = parent;
  node.path = path;
  if (node.children) node.children.forEach(c => link(c, node, path + node.name + "/"));
}

/* ── sidebar tree ── */
function buildTree(node) {
  const wrap = document.createElement("div");
  (node.children || []).forEach(child => {
    const row = document.createElement("div");
    row.className = "node";
    const isDir = child.type === "dir";
    row.innerHTML =
      `<span class="tw">${isDir ? "▶" : ""}</span>` +
      `<span class="ic">${glyph(child)}</span>` +
      `<span class="nm">${child.name}</span>` +
      (isDir ? `<span class="count">${child.children.length}</span>` : "");
    wrap.appendChild(row);

    if (isDir) {
      const kids = buildTree(child);
      kids.className = "children";
      kids.style.display = "none";
      wrap.appendChild(kids);
      row.addEventListener("click", e => {
        e.stopPropagation();
        const shown = kids.style.display !== "none";
        kids.style.display = shown ? "none" : "block";
        row.classList.toggle("open", !shown);
        openDir(child);
      });
    } else {
      row.addEventListener("click", e => { e.stopPropagation(); openFile(child); });
    }
  });
  return wrap;
}

/* ── breadcrumbs ── */
function renderCrumbs(dir) {
  const chain = [];
  for (let n = dir; n; n = n.parent) chain.unshift(n);
  crumbsEl.innerHTML = "";
  chain.forEach((n, i) => {
    if (i) {
      const sep = document.createElement("span");
      sep.className = "sep"; sep.textContent = "/";
      crumbsEl.appendChild(sep);
    }
    const b = document.createElement("button");
    b.textContent = n.name;
    b.addEventListener("click", () => openDir(n));
    crumbsEl.appendChild(b);
  });
}

/* ── main grid ── */
function openDir(dir) {
  current = dir;
  dirTitle.textContent = label(dir);
  renderCrumbs(dir);

  const items = (dir.children || []).slice()
    .sort((a, b) => (b.type === "dir") - (a.type === "dir"));

  gridEl.innerHTML = "";
  items.forEach((f, i) => {
    const el = document.createElement("div");
    el.className = "card";
    el.style.setProperty("--tone", tone(f));
    el.style.animationDelay = (i * 45) + "ms";
    el.innerHTML =
      `<span class="tag">${f.type === "dir" ? "dir" : f.type}</span>` +
      `<div class="glyph">${glyph(f)}</div>` +
      `<div class="nm">${f.name}</div>` +
      `<div class="meta">${f.type === "dir"
        ? f.children.length + " items"
        : f.size + " · " + f.mod}</div>`;
    el.addEventListener("click", () => f.type === "dir" ? openDir(f) : openFile(f));
    gridEl.appendChild(el);
  });

  $("mFiles").textContent = items.filter(f => f.type !== "dir").length;
  $("mFolders").textContent = items.filter(f => f.type === "dir").length;
}

/* ── view toggle ── */
function setView(v) {
  view = v;
  gridEl.className = "grid" + (v === "list" ? " list" : "");
  $("btnGrid").classList.toggle("on", v === "grid");
  $("btnList").classList.toggle("on", v === "list");
}
document.querySelectorAll(".view-toggle button")
  .forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));

/* ── preview drawer ── */
function openFile(f) {
  $("pvIcon").textContent = glyph(f);
  $("pvName").textContent = f.name;
  $("pvPath").textContent = (f.path || "/") + f.name;
  $("pvType").textContent = f.type.toUpperCase() + " file";
  $("pvSize").textContent = f.size || "—";
  $("pvLines").textContent = f.code ? f.code.split("\n").length : "—";
  $("pvMod").textContent = f.mod || "—";
  $("pvCode").innerHTML = f.code ? hi(f.code) : "No preview available.";
  drawer.classList.add("show");
  scrim.classList.add("show");
}
function closeDrawer() {
  drawer.classList.remove("show");
  scrim.classList.remove("show");
}
$("pvClose").addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

/* ── shuffle: open a random file from anywhere in the tree ── */
function allFiles(node, acc = []) {
  (node.children || []).forEach(c =>
    c.type === "dir" ? allFiles(c, acc) : acc.push(c));
  return acc;
}
$("shuffleBtn").addEventListener("click", () => {
  const pool = allFiles(ROOT);
  if (pool.length) openFile(pool[Math.floor(Math.random() * pool.length)]);
});

/* ── boot: load the tree from data.json, fall back if unreachable ── */
function mount(root) {
  ROOT = root;
  link(ROOT, null, "");
  treeEl.innerHTML = "";
  treeEl.appendChild(buildTree(ROOT));
  openDir(ROOT);
}

fetch("./data.json")
  .then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then(mount)
  .catch(() => {
    console.warn("data.json unavailable — using inline fallback tree.");
    mount(FALLBACK);
  });
