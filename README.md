# FileVerse 2.0 Ultra — CodePen Challenge

A polished CodePen 2.0 challenge project that turns project files into a playful, editable and professional mini IDE.

Live demo: https://laurandreea10.github.io/CodePen-2.0-file-options-challenge/

Repository: https://github.com/LaurAndreea10/CodePen-2.0-file-options-challenge

## FileVerse Pro foundation

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
- Simulated Source Control with branches and modified/added/deleted states
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

## Ultra Studio upgrade pack

- Dual-file Split View with swap, formatting and Save Both
- Diagnostics console with JavaScript and JSON syntax checks
- Error, warning and success filters
- Responsive Device Preview for desktop, tablet, mobile and landscape
- Side-by-side Diff Viewer with accept/discard actions
- Visual Git History with snapshot commits and workspace restore
- Project Templates: Blank, Portfolio, Dashboard, Game and Challenge
- Import project from JSON or ZIP
- Export the complete virtual file system as ZIP using JSZip
- Static accessibility audit with a score and actionable checks
- Local, deterministic AI Assistant demo with file explanation and code-quality actions
- Guided Product Tour with spotlight navigation
- Keyboard shortcut `Ctrl/Cmd + \` for Split View
- Modular Ultra implementation in separate CSS and JavaScript files

## Integrated Version History

- Product release timeline from FileVerse 1.0 through 4.0
- Named workspace versions with custom release notes
- Automatic snapshots every 30 seconds when the project changes
- Automatic safety snapshot before restoring an older version
- Version statistics for files, folders, lines and local storage size
- Compare a saved version with the current workspace
- Restore the entire virtual file system from any saved version
- Export one version or the complete history as JSON
- Sort snapshots from newest or oldest
- Delete individual snapshots
- All history is stored locally in the browser

## Current score

**45+ interactive features active.**

## Tech stack

- Semantic HTML
- Modern CSS
- Vanilla JavaScript
- JSON project tree
- localStorage
- Blob and iframe `srcdoc` APIs
- JSZip
- GitHub Pages

## Repository structure

```text
.
├── index.html
├── style.css
├── extras.css
├── ultra.css
├── versions.css
├── script.js
├── ultra.js
├── versions.js
├── data.json
└── README.md
```

The virtual project shown inside FileVerse also contains realistic `src`, `styles`, `assets`, `.github/workflows` and localization folders.

## GitHub Pages settings

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/root`

## Challenge angle

FileVerse does not merely mention the CodePen 2.0 file system. The entire interaction is built around creating, editing, moving, searching, running, testing, auditing, preserving, restoring, versioning and publishing multi-file projects.