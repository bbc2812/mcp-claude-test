# AGENTS.md

Guidelines for AI agents (Claude Code, Copilot, etc.) working in this repository.

## Project overview

TaskBoard Lite is a vanilla JS task manager with no build step, no framework, and no bundler. Files are served directly as static assets. Keep it that way — do not introduce npm dependencies, transpilation, or a build pipeline.

## Repository layout

```
index.html          # Entry point and markup
src/
  app.js            # All runtime logic (DOM, events, localStorage)
  data.js           # Seed task data (initialTasks export)
  styles.css        # All styles, flat structure, no preprocessor
```

## Coding conventions

- **Vanilla JS only** — no libraries, no frameworks.
- **ES modules** — `index.html` loads `app.js` with `type="module"`; use named exports in `data.js`.
- **localStorage** for persistence under the key `"tasks"`.
- **No comments** unless the reason is non-obvious. Self-documenting names are preferred.
- CSS classes follow a flat BEM-lite naming: `task-item`, `task-title`, `priority-badge`, etc.

## Task data shape

Every task object must include these fields:

```js
{
  id: Number,        // Date.now() for new tasks
  title: String,
  category: String,  // "General" | "Study" | "Work" | "Personal"
  priority: String,  // "Low" | "Medium" | "High"
  completed: Boolean
}
```

## GitHub workflow

- Work on feature branches named `feature/<short-description>`.
- Squash-merge PRs into `main`.
- Commit messages follow the format: `type: short description` (e.g. `feat:`, `fix:`, `refactor:`).
- Use the GitHub MCP server (`mcp__github__*` tools) for branch creation, file pushes, PR creation, and merging — do not rely solely on local git commands.

## What agents should NOT do

- Do not add a bundler, transpiler, or framework.
- Do not split `app.js` into multiple modules unless the file exceeds ~300 lines.
- Do not add a test suite unless explicitly requested.
- Do not push directly to `main` — always go through a PR.
- Do not modify `package.json` scripts without being asked.
