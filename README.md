# Figma Clone

A minimal Figma-like design tool built with React, TypeScript, and HTML5 Canvas.

## Features

- **Drawing Tools**: Rectangle and ellipse shapes
- **Selection & Transform**: Click to select, drag to move, corner handles to resize
- **Viewport Controls**: Zoom (Cmd/Ctrl + scroll), pan (Space + drag)
- **Undo/Redo**: Full history support via Zustand temporal middleware
- **Color Picker**: Change fill color of selected shapes

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Select tool | `V` |
| Rectangle tool | `R` |
| Ellipse tool | `O` |
| Delete shape | `Delete` / `Backspace` |
| Duplicate | `Cmd/Ctrl + D` |
| Undo | `Cmd/Ctrl + Z` |
| Redo | `Cmd/Ctrl + Shift + Z` |
| Pan canvas | `Space + Drag` |
| Zoom | `Cmd/Ctrl + Scroll` |

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: React 19 + TypeScript
- **State**: [Zustand](https://zustand.docs.pmnd.rs/) + [zundo](https://github.com/charkour/zundo)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Build**: Vite

## Tooling

| Tool | Purpose |
|------|---------|
| [tsgo](https://github.com/microsoft/typescript-go) | TypeScript type checking (~10x faster than tsc) |
| [oxlint](https://oxc.rs/docs/guide/usage/linter) | Linting (~50-100x faster than ESLint) |
| [oxfmt](https://oxc.rs/docs/guide/usage/formatter) | Code formatting (~30x faster than Prettier) |

## Getting Started

```bash
bun install
bun run dev
```

## Scripts

```bash
bun run dev      # Start dev server
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Lint code
bun run format   # Format code
```
