const GLYPH = { html: "🌐", css: "🎨", js: "⚡", json: "🧩", svg: "◈", md: "📝", img: "🖼️", dir: "🗂️" };
const TONE = { html: "var(--t-html)", css: "var(--t-css)", js: "var(--t-js)", json: "var(--t-json)", svg: "var(--t-svg)", md: "var(--t-md)", img: "var(--t-img)", dir: "var(--t-dir)" };

const FALLBACK = {
  name: "~", type: "dir", children: [
    { name: "index.html", type: "html", size: "3.4 KB", mod: "just now", code: "<!-- open on CodePen 2.0 to load data.json -->" },
    { name: "style.css", type: "css", size: "7.1 KB", mod: "2m ago", code: ":root { --cyan: #53f4ff; }" },
    { name: "script.js", type: "js", size: "5.6 KB", mod: "2m ago", code: "const FS = await fetch('./data.json');" },
    { name: "data.json", type: "json", size: "2.9 KB", mod: "now", code: "{ \"note\": \"This Pen reads its own tree from here.\" }" }
  ]
};

const I18N = {
  en: {
    eyebrow: "CodePen Challenge · July 2026",
    subtitle: "A playful file explorer built to celebrate the new CodePen 2.0 editor. Browse a whole project tree — HTML, CSS, JS, JSON and SVG — across folders, right inside one Pen.",
    submissionTitle: "A mini IDE about file structure.",
    submissionText: "This entry turns CodePen 2.0 file options into an interactive workspace with search, preview, terminal commands and a GitHub Pages ready deploy flow.",
    upgrades: "upgrades added",
    projectFiles: "Project files",
    randomFile: "Open a random file",
    filesHere: "Files here",
    folders: "Folders",
    whyTitle: "Why this fits the challenge",
    ideaOneTitle: "A real file tree",
    ideaOneText: "Expandable folders, breadcrumbs and directory navigation — the Pen is entirely about files and structure.",
    ideaTwoTitle: "Many file types",
    ideaTwoText: "HTML, CSS, JS, JSON and SVG all live side by side, exactly what the 2.0 editor unlocks.",
    ideaThreeTitle: "Two ways to look",
    ideaThreeText: "Grid and list views, plus a slide-in source preview for every file you open."
  },
  ro: {
    eyebrow: "CodePen Challenge · Iulie 2026",
    subtitle: "Un file explorer jucăuș creat pentru noul editor CodePen 2.0. Poți naviga printr-un proiect complet — HTML, CSS, JS, JSON și SVG — direct într-un singur Pen.",
    submissionTitle: "Un mini IDE despre structura fișierelor.",
    submissionText: "Proiectul transformă opțiunile de fișiere CodePen 2.0 într-un workspace interactiv cu search, preview, terminal și flow pregătit pentru GitHub Pages.",
    upgrades: "upgrade-uri adăugate",
    projectFiles: "Fișiere proiect",
    randomFile: "Deschide un fișier random",
    filesHere: "Fișiere aici",
    folders: "Foldere",
    whyTitle: "De ce se potrivește challenge-ului",
    ideaOneTitle: "Un file tree real",
    ideaOneText: "Foldere expandabile, breadcrumbs și navigare pe directoare — tot Pen-ul este despre fișiere și structură.",
    ideaTwoTitle: "Mai multe tipuri de fișiere",
    ideaTwoText: "HTML, CSS, JS, JSON și SVG apar împreună, exact ce pune în valoare editorul 2.0.",
    ideaThreeTitle: "Două moduri de vizualizare",
    ideaThreeText: "Grid și list view, plus preview lateral pentru fiecare fișier deschis."
  }
};

const $ = id => document.getElementById(id);
const treeEl = $("tree"), gridEl = $("grid"), crumbsEl = $("crumbs"), dirTitle = $("dirTitle");
const drawer = $("drawer"), scrim = $("scrim"), searchInput = $("searchInput"), emptyState = $("emptyState");
let view = "grid", current = null, ROOT = null, currentLang = "en";

function hi(src) {
  let s = String(src).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/(&quot;|&#39;|"|')(.*?)\1/g, '<span class="a">$1$2$1</span>');
  s = s.replace(/\b(const|let|function|return|export|import|for|forEach|new|if|else|await)\b/g, '<span class="k">$1</span>');
  s = s.replace(/(&lt;\/?[a-zA-Z][\w-]*)/g, '<span class="c">$1</span>');
  return s;
}

const glyph = f => f.type === "dir" ? GLYPH.dir : (GLYPH[f.type] || "📄");
const tone = f => f.type === "dir" ? TONE.dir : (TONE[f.type] || "var(--faint)");
const label = f => f.name === "~" ? "Root" : f.name;

function link(node, parent, path) {
  node.parent = parent;
  node.path = path;
  if (node.children) node.children.forEach(c => link(c, node, path + node.name + "/"));
}

function allFiles(node, acc = []) {
  (node.children || []).forEach(c => c.type === "dir" ? allFiles(c, acc) : acc.push(c));
  return acc;
}

function buildTree(node) {
  const wrap = document.createElement("div");
  (node.children || []).forEach(child => {
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

function renderCrumbs(dir) {
  const chain = [];
  for (let n = dir; n; n = n.parent) chain.unshift(n);
  crumbsEl.innerHTML = "";
  chain.forEach((n, i) => {
    if (i) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "/";
      crumbsEl.appendChild(sep);
    }
    const b = document.createElement("button");
    b.textContent = n.name;
    b.addEventListener("click", () => openDir(n));
    crumbsEl.appendChild(b);
  });
}

function renderItems(items) {
  gridEl.innerHTML = "";
  items.forEach((f, i) => {
    const el = document.createElement("div");
    el.className = "card";
    el.style.setProperty("--tone", tone(f));
    el.style.animationDelay = (i * 45) + "ms";
    el.innerHTML = `<span class="tag">${f.type === "dir" ? "dir" : f.type}</span><div class="glyph">${glyph(f)}</div><div class="nm">${f.name}</div><div class="meta">${f.type === "dir" ? f.children.length + " items" : f.size + " · " + f.mod}</div>`;
    el.addEventListener("click", () => f.type === "dir" ? openDir(f) : openFile(f));
    gridEl.appendChild(el);
  });
  emptyState.hidden = items.length !== 0;
}

function openDir(dir) {
  current = dir;
  dirTitle.textContent = label(dir);
  renderCrumbs(dir);
  const items = (dir.children || []).slice().sort((a, b) => (b.type === "dir") - (a.type === "dir"));
  renderItems(items);
  $("mFiles").textContent = items.filter(f => f.type !== "dir").length;
  $("mFolders").textContent = items.filter(f => f.type === "dir").length;
  updateStatus(items.length);
  if (searchInput) searchInput.value = "";
}

function updateStatus(count) {
  $("statusPath").textContent = "main / " + (current ? label(current).toLowerCase() : "root");
  $("statusCount").textContent = count + " items";
  $("statusView").textContent = view === "grid" ? "Grid mode" : "List mode";
}

function setView(v) {
  view = v;
  gridEl.className = "grid" + (v === "list" ? " list" : "");
  $("btnGrid").classList.toggle("on", v === "grid");
  $("btnList").classList.toggle("on", v === "list");
  updateStatus(gridEl.children.length);
}
document.querySelectorAll(".view-toggle button").forEach(b => b.addEventListener("click", () => setView(b.dataset.view)));

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
function closeDrawer() { drawer.classList.remove("show"); scrim.classList.remove("show"); }
$("pvClose").addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

$("shuffleBtn").addEventListener("click", () => {
  const pool = allFiles(ROOT);
  if (pool.length) openFile(pool[Math.floor(Math.random() * pool.length)]);
});

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return openDir(current || ROOT);
  const matches = allFiles(ROOT).filter(f => (f.name + " " + f.type + " " + (f.code || "")).toLowerCase().includes(q));
  dirTitle.textContent = `Search: ${q}`;
  crumbsEl.innerHTML = "";
  renderItems(matches);
  $("mFiles").textContent = matches.length;
  $("mFolders").textContent = 0;
  updateStatus(matches.length);
});

function runTerminal(cmd) {
  const out = {
    "npm run pen": ["Compiling FileVerse modules...", "Ready at CodePen 2.0 workspace."],
    "git status": ["On branch main", "Working tree clean. GitHub Pages ready."],
    "deploy pages": ["Building static files...", "Deployment target: GitHub Pages / main / root."]
  }[cmd] || ["Command completed."];
  const log = $("terminalLog");
  log.innerHTML += `<p><span>$</span> ${cmd}</p>` + out.map(line => `<p>${line}</p>`).join("");
  log.scrollTop = log.scrollHeight;
}
document.querySelectorAll(".terminal-actions button").forEach(btn => btn.addEventListener("click", () => runTerminal(btn.dataset.cmd)));

function setLang(lang) {
  currentLang = lang;
  document.querySelector(".app").dataset.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[lang][key]) el.textContent = I18N[lang][key];
  });
  $("langBtn").textContent = lang === "en" ? "RO" : "EN";
}
$("langBtn").addEventListener("click", () => setLang(currentLang === "en" ? "ro" : "en"));

function mount(root) {
  ROOT = root;
  link(ROOT, null, "");
  treeEl.innerHTML = "";
  treeEl.appendChild(buildTree(ROOT));
  openDir(ROOT);
  setTimeout(() => $("loader").classList.add("is-done"), 900);
}

fetch("./data.json")
  .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
  .then(mount)
  .catch(() => { console.warn("data.json unavailable — using inline fallback tree."); mount(FALLBACK); });
