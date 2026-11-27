# llm-arena

A UI-only preview of an LLM comparison workspace: run one prompt across several
models, watch the answers stream side by side, let a judge score them, and keep
the receipts.

Everything on screen is rendered from typed mock data in
`apps/web/src/mocks/data.ts` — there are no network calls, keys or backend in
this build.

## Pages

- **Arena** — prompt composer, model lineup, streaming result cards and a summary bar.
- **Judge** — weighted rubric, leaderboard, criteria radar and per-model verdicts.
- **Brochure** — URL in, three chained steps out, with the call log attached.
- **Templates** — a searchable library of reusable prompts with a live editor.
- **History** — filterable run log plus a detail view that reuses the Arena result cards.
- **Dashboard** — usage, spend, latency and win-rate charts.
- **Settings** — providers, defaults, pricing, appearance and a danger zone.

## Running it

```bash
pnpm install
pnpm --filter web dev
```

Open http://localhost:3000. `pnpm --filter web lint` and `pnpm --filter web build`
are the checks used before every commit.

## Screenshots

Captured at 1440 px wide in both themes. Regenerate with the dev server running:

```bash
pnpm --filter web screenshots
```

| Page | Dark | Light |
| --- | --- | --- |
| Arena | ![Arena, dark](docs/screenshots/arena-dark.png) | ![Arena, light](docs/screenshots/arena-light.png) |
| Judge | ![Judge, dark](docs/screenshots/judge-dark.png) | ![Judge, light](docs/screenshots/judge-light.png) |
| Brochure | ![Brochure, dark](docs/screenshots/brochure-dark.png) | ![Brochure, light](docs/screenshots/brochure-light.png) |
| Templates | ![Templates, dark](docs/screenshots/templates-dark.png) | ![Templates, light](docs/screenshots/templates-light.png) |
| History | ![History, dark](docs/screenshots/history-dark.png) | ![History, light](docs/screenshots/history-light.png) |
| Run detail | ![Run detail, dark](docs/screenshots/run-detail-dark.png) | ![Run detail, light](docs/screenshots/run-detail-light.png) |
| Dashboard | ![Dashboard, dark](docs/screenshots/dashboard-dark.png) | ![Dashboard, light](docs/screenshots/dashboard-light.png) |
| Settings | ![Settings, dark](docs/screenshots/settings-dark.png) | ![Settings, light](docs/screenshots/settings-light.png) |
