# Figma Clone

A React + TypeScript project built with Vite.

## Prerequisites

This project uses [Bun](https://bun.sh/) as the package manager and runtime.

## Tooling

| Tool | Purpose | Speed |
|------|---------|-------|
| [tsgo](https://github.com/microsoft/typescript-go) | TypeScript type checking | ~10x faster than tsc |
| [oxlint](https://oxc.rs/docs/guide/usage/linter) | Linting | ~50-100x faster than ESLint |
| [oxfmt](https://oxc.rs/docs/guide/usage/formatter) | Code formatting | ~30x faster than Prettier |
| [Vite](https://vite.dev/) | Dev server & bundling | Native ESM, instant HMR |

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint

# Format code
bun run format
```
