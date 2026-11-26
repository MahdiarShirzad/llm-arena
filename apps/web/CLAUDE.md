# LLM Arena — web UI rules

These rules apply to every change inside `apps/web`. Read them before editing.

## Scope: UI and design only

- **No data layer.** No `fetch`, `axios`, SWR/React Query, API routes, server actions, env vars, or business logic.
- **Local presentational state only**: tabs, toggles, dialogs, sheets, selected chips, collapse state, hover/focus state. Nothing persisted.
- **All data comes from `src/mocks`.** Import the typed shapes in `src/mocks/data.ts`; do not invent ad-hoc data in pages or components. Never hardcode API keys or endpoints.

## Theming

- Use theme tokens and Tailwind classes only. **Never hardcode hex values in components.** The only hex values in the app live in `src/app/globals.css`.
- Dark is the default (`next-themes`, `attribute="class"`, `defaultTheme="dark"`). Dark tokens are on `:root` and `.dark`; light tokens are on `.light`.
- Token utilities: `bg-background`, `bg-surface`, `bg-surface-2`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`/`text-primary-foreground`, `bg-highlight`/`text-on-highlight`, `text-steel`, `text-success`, `text-error`, `text-warning`, `font-sans`, `font-mono`.
- Gold (`primary` in dark, `highlight` in both modes) is the single accent. Use it sparingly: primary actions, focus rings, active indicators, winner badges/rings, streaming cursor. In light mode the primary action is navy (`--accent`), so use `highlight`/`on-highlight` when something must stay gold in both themes.
- Model colors (`bg-model-openai`, `bg-model-gemini`, `bg-model-deepseek`, `bg-model-ollama`) are **only** for dots, bar fills and chart series — never as text.
- Mono (`font-mono`) is for token counts, costs, latencies, IDs, code and JSON. Use `tabular-nums` for numbers that align.

## Structure

- Components live in `src/components/ui` (shadcn primitives), `src/components/layout` (shell), `src/components/shared` (cross-feature primitives), and `src/components/<feature>` for feature work.
- Pages are thin: compose components, pass mock data, export metadata. No layout markup duplicated across pages.
- TypeScript is strict. **No `any`**, no type assertions to silence the compiler. Export prop types alongside components.
- Prefer editing existing components over forking variants. Keep the public props small.

## Quality bar

- Every page must be responsive at mobile (375 px), tablet and desktop. Verify the sidebar/sheet and any dense tables at each size.
- Keyboard accessible: real buttons and links, visible focus states (never remove outlines without a replacement), labelled icon-only controls, `aria-current` for active nav, escape/overlay close on dialogs and sheets.
- Meet WCAG AA contrast in **both** themes. Muted text is for secondary copy only; never put low-contrast text on gold.
- Include empty, loading and error states where relevant (`EmptyState`, `Skeleton`, `MetricPill` tone `error`). Failures should read like a message, not a stack trace.

## Before every commit

Run inside `apps/web` and fix all failures:

```bash
pnpm lint
pnpm build
```

## Git workflow

- One branch per page, named `feat/ui-<page>`, created from the latest `main`.
- Small Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `docs:`). One concern per commit.
- `git push -u origin <branch>` after **every** commit.
- Never commit to `main`, never force-push, never merge. When finished, print the branch name and a short summary.

## Current foundation

- `/` Arena, `/judge`, `/brochure`, `/templates`, `/history`, `/dashboard`, `/settings` are placeholders that only render `PageHeader` and `EmptyState`.
- Shell: `AppShell` (collapsible sidebar, mobile `Sheet`, sticky `TopBar`, theme toggle, static avatar).
- Shared primitives: `PageHeader`, `ModelBadge`, `StatCard`, `EmptyState`, `StreamingCursor`, `MetricPill`, `CodeBlock`.
- Fonts: Inter (`--font-inter`) and JetBrains Mono (`--font-jetbrains-mono`) loaded in `src/app/layout.tsx`.
