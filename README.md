# FileVerse 2.0 — CodePen Challenge

A polished CodePen 2.0 challenge project that turns project files into a playful, editable mini IDE.

Live demo: https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/

Repository: https://github.com/LaurAndreea10/CodePen-2.0-file-options-challenge

## FileVerse Pro features

- Real project tree with nested folders and many file types
- Editable source preview with line numbers, minimap, wrap, copy, reset and download
- Save shortcut with `Ctrl/Cmd + S`
- Live project compilation inside an iframe
- Create files and folders from templates
- Context menu: open, rename, duplicate, pin, copy path, download and delete
- Drag and drop files between folders
- Undo history
- Grid and list views
- Tabs and pinned files
- Advanced search with case-sensitive, whole-word, regex and file-type filters
- Simulated Source Control with branches, modified/added/deleted states and commits
- Dependency graph
- Challenge mode with five interactive missions and timer
- Achievement badges
- Command Palette with `Ctrl/Cmd + K`
- Simulated terminal and GitHub Pages deployment
- Neon, Soft and Terminal themes
- High contrast and reduced motion modes
- Full project export as JSON
- Persistent workspace state in `localStorage`
- Activity timeline and status bar
- Responsive desktop, tablet and mobile layouts

## Current score

30+ interactive features active.

## Tech stack

- Semantic HTML
- Modern CSS
- Vanilla JavaScript
- JSON project tree
- localStorage
- Blob and iframe `srcdoc` APIs
- GitHub Pages

## Repository structure

```text
.
├── index.html
├── style.css
├── extras.css
├── script.js
├── data.json
└── README.md
```

The virtual project shown inside FileVerse also contains realistic `src`, `styles`, `assets`, `.github/workflows` and localization folders.

## GitHub Pages settings

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/root`

## Challenge angle

FileVerse does not merely mention the CodePen 2.0 file system. The entire interaction is built around creating, editing, moving, searching, running and publishing multi-file projects.