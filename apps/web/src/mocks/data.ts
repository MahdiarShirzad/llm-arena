/**
 * Mock data for the UI-only build of LLM Arena.
 * Nothing here talks to a network; later tasks render from these shapes.
 */

export type ModelProvider = "openai" | "gemini" | "deepseek" | "ollama";

export type Model = {
  id: string;
  provider: ModelProvider;
  providerLabel: string;
  name: string;
  /** USD per 1M input tokens */
  pricePer1mInput: number;
  /** USD per 1M output tokens */
  pricePer1mOutput: number;
  contextWindow: number;
};

export const models: Model[] = [
  {
    id: "gpt-4o-mini",
    provider: "openai",
    providerLabel: "OpenAI",
    name: "gpt-4o-mini",
    pricePer1mInput: 0.15,
    pricePer1mOutput: 0.6,
    contextWindow: 128_000,
  },
  {
    id: "gemini-2.5-flash",
    provider: "gemini",
    providerLabel: "Gemini",
    name: "gemini-2.5-flash",
    pricePer1mInput: 0.3,
    pricePer1mOutput: 2.5,
    contextWindow: 1_000_000,
  },
  {
    id: "deepseek-chat",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    name: "deepseek-chat",
    pricePer1mInput: 0.27,
    pricePer1mOutput: 1.1,
    contextWindow: 64_000,
  },
  {
    id: "llama3.2",
    provider: "ollama",
    providerLabel: "Ollama",
    name: "llama3.2",
    pricePer1mInput: 0,
    pricePer1mOutput: 0,
    contextWindow: 128_000,
  },
];

export type RunStatus = "streaming" | "done" | "error";

export type ModelMetrics = {
  latencyMs: number;
  tokensIn: number;
  tokensOut: number;
  /** USD for this response */
  costUsd: number;
  tokensPerSecond: number;
};

export type ModelResponse = {
  modelId: string;
  response: string;
  metrics: ModelMetrics;
  status: RunStatus;
  error?: string;
};

export type ArenaRun = {
  id: string;
  prompt: string;
  createdAt: string;
  tags: string[];
  responses: ModelResponse[];
};

export const sampleRuns: ArenaRun[] = [
  {
    id: "run_01",
    prompt: "Design a rate limiter for a multi-tenant API with burst traffic.",
    createdAt: "2026-11-26T09:42:00Z",
    tags: ["architecture", "api"],
    responses: [
      {
        modelId: "gpt-4o-mini",
        status: "done",
        response:
          "Use a token bucket per tenant keyed on tenant:{id}:{route}, stored in Redis. Refill lazily from the elapsed timestamp instead of a cron job so idle tenants cost nothing. Return Retry-After based on the next token's availability, and keep burst capacity separate from the steady refill rate so noisy tenants cannot starve others.",
        metrics: {
          latencyMs: 2840,
          tokensIn: 412,
          tokensOut: 386,
          costUsd: 0.00029,
          tokensPerSecond: 71.4,
        },
      },
      {
        modelId: "gemini-2.5-flash",
        status: "done",
        response:
          "A two-tier design works well: a coarse per-tenant limiter at the gateway backed by a per-route limiter in the service. Store bucket state in Redis with a TTL of the refill window, and use a Lua script for the read-refill-decrement step so it stays atomic without a distributed lock. Emit the remaining budget plus reset time in response headers.",
        metrics: {
          latencyMs: 2310,
          tokensIn: 405,
          tokensOut: 512,
          costUsd: 0.0014,
          tokensPerSecond: 68.2,
        },
      },
      {
        modelId: "deepseek-chat",
        status: "done",
        response:
          "Start with a leaky bucket if you care about smoothing downstream load, otherwise token bucket is easier to explain to customers. Keep the counters in memory per instance and reconcile through Redis only when a request is near the limit — this cuts Redis round trips on the hot path. Add a circuit breaker so a Redis outage fails open for paid tenants and closed for free ones.",
        metrics: {
          latencyMs: 4120,
          tokensIn: 398,
          tokensOut: 471,
          costUsd: 0.00063,
          tokensPerSecond: 39.4,
        },
      },
      {
        modelId: "llama3.2",
        status: "done",
        response:
          "A fixed window counter is the simplest option: key by tenant and minute, INCR in Redis, expire after 120 seconds. It allows bursts at window boundaries, so add a small sliding-window check if fairness matters. Return 429 with the remaining seconds in the window.",
        metrics: {
          latencyMs: 6930,
          tokensIn: 402,
          tokensOut: 358,
          costUsd: 0,
          tokensPerSecond: 26.8,
        },
      },
    ],
  },
  {
    id: "run_02",
    prompt:
      "Explain how transformer attention works to a staff engineer who has never trained a model.",
    createdAt: "2026-11-25T16:08:00Z",
    tags: ["explanation", "ml"],
    responses: [
      {
        modelId: "gpt-4o-mini",
        status: "done",
        response:
          "Attention is a learned lookup. Each token produces a query, a key and a value; the query is dotted with every key to score relevance, the scores are softmaxed into weights, and the weighted sum of values becomes the token's new representation. Because every token can attend to every other token in one step, the model trades the sequential bottleneck of an RNN for quadratic work in sequence length.",
        metrics: {
          latencyMs: 5210,
          tokensIn: 128,
          tokensOut: 742,
          costUsd: 0.00046,
          tokensPerSecond: 74.1,
        },
      },
      {
        modelId: "gemini-2.5-flash",
        status: "streaming",
        response:
          "Think of a room where every token can ask every other token a question. The query is what this token is looking for, the key is what each token advertises, and the value is what it actually hands over. Scores become a probability distribution over the room, so the token's next state is a blend of everyone it found useful. Multi-head attention is just several of these conversations in parallel, each free to specialise — one head tracks syntax, another coreference, another position. Causal masking keeps the future out of the room during generation.",
        metrics: {
          latencyMs: 4380,
          tokensIn: 131,
          tokensOut: 688,
          costUsd: 0.00176,
          tokensPerSecond: 68.9,
        },
      },
      {
        modelId: "deepseek-chat",
        status: "done",
        response:
          "Map it onto the systems you already know: attention is a batched, learned gather. Project the residual stream into Q, K and V, compute QK^T / sqrt(d), mask, softmax, then multiply by V. The KV cache exists because K and V for past tokens do not change during decoding, so you keep them instead of recomputing the prefix every step. FlashAttention is the memory-hierarchy fix: tile the softmax so you never materialise the full N×N matrix.",
        metrics: {
          latencyMs: 7960,
          tokensIn: 126,
          tokensOut: 655,
          costUsd: 0.00075,
          tokensPerSecond: 47.3,
        },
      },
      {
        modelId: "llama3.2",
        status: "error",
        response: "",
        error:
          "Model failed to load: llama3.2 is not available on this Ollama host.",
        metrics: {
          latencyMs: 30_000,
          tokensIn: 129,
          tokensOut: 0,
          costUsd: 0,
          tokensPerSecond: 0,
        },
      },
    ],
  },
  {
    id: "run_03",
    prompt:
      "Refactor this Postgres query so it stops sequential-scanning 40M events.",
    createdAt: "2026-11-24T11:26:00Z",
    tags: ["sql", "performance"],
    responses: [
      {
        modelId: "gpt-4o-mini",
        status: "done",
        response:
          "The filter on tenant_id plus occurred_at wants a composite index in that order: (tenant_id, occurred_at DESC). Your current predicate wraps occurred_at in date_trunc, which makes the index unusable — compare against a half-open range instead. Also move the count into a lateral join so Postgres stops aggregating the full join result before filtering.",
        metrics: {
          latencyMs: 3910,
          tokensIn: 1180,
          tokensOut: 528,
          costUsd: 0.00049,
          tokensPerSecond: 62.4,
        },
      },
      {
        modelId: "gemini-2.5-flash",
        status: "done",
        response:
          "Split this into two steps. First, narrow with a range scan on events(tenant_id, occurred_at) and drop the DISTINCT by rewriting the join as EXISTS. Second, aggregate only the surviving rows. Run EXPLAIN (ANALYZE, BUFFERS) before and after; if the planner still picks a seq scan, your statistics are stale or the tenant predicate is not selective enough to justify the index.",
        metrics: {
          latencyMs: 3560,
          tokensIn: 1174,
          tokensOut: 612,
          costUsd: 0.00188,
          tokensPerSecond: 71.8,
        },
      },
      {
        modelId: "deepseek-chat",
        status: "done",
        response:
          "Two likely culprits: a function on the indexed column and an OR across joined tables. Replace date_trunc('day', occurred_at) = $1 with occurred_at >= $1 AND occurred_at < $1 + interval '1 day'. If the OR spans tables, split it into a UNION ALL. Consider a partial index on tenant_id, occurred_at where deleted_at is null if soft deletes dominate.",
        metrics: {
          latencyMs: 6240,
          tokensIn: 1168,
          tokensOut: 705,
          costUsd: 0.00109,
          tokensPerSecond: 52.1,
        },
      },
      {
        modelId: "llama3.2",
        status: "done",
        response:
          "Add a covering index on (tenant_id, occurred_at) include (event_type, payload_size) so the query can run index-only. Rewrite the date filter as a range, and remove the correlated subquery in the select list. If you still see a seq scan, check whether autovacuum has run recently on events.",
        metrics: {
          latencyMs: 9880,
          tokensIn: 1171,
          tokensOut: 486,
          costUsd: 0,
          tokensPerSecond: 31.2,
        },
      },
    ],
  },
  {
    id: "run_04",
    prompt:
      "Write release notes for v2.4: streaming judge mode, cost guardrails, and CSV export.",
    createdAt: "2026-11-22T18:54:00Z",
    tags: ["writing", "release"],
    responses: [
      {
        modelId: "gpt-4o-mini",
        status: "done",
        response:
          "v2.4 — Judge while it streams. Judge mode now scores responses as they finish instead of waiting for the slowest model, so a verdict lands up to 40% sooner. Cost guardrails let you cap a run at a dollar amount and stop models mid-flight. Every table exports to CSV with the active filters applied.",
        metrics: {
          latencyMs: 2440,
          tokensIn: 268,
          tokensOut: 412,
          costUsd: 0.00029,
          tokensPerSecond: 80.2,
        },
      },
      {
        modelId: "gemini-2.5-flash",
        status: "done",
        response:
          "## v2.4\n\n**Streaming judge** — the judge reads completed streams in arrival order, with partial verdicts visible in the run panel.\n\n**Cost guardrails** — set a per-run ceiling; models are cancelled gracefully when the projected spend crosses it.\n\n**CSV export** — download any run, history table or dashboard series as CSV.\n\nFixes: corrected token accounting for cached prompts and stopped the sidebar from resetting on navigation.",
        metrics: {
          latencyMs: 2180,
          tokensIn: 271,
          tokensOut: 455,
          costUsd: 0.00122,
          tokensPerSecond: 76.4,
        },
      },
      {
        modelId: "deepseek-chat",
        status: "done",
        response:
          "Highlights: judging now starts on the first completed response, cost limits can be set per run or per workspace, and every result table can be exported. Also fixed a double-counted streaming token bug and a flicker when switching themes during a run.",
        metrics: {
          latencyMs: 3770,
          tokensIn: 265,
          tokensOut: 398,
          costUsd: 0.00051,
          tokensPerSecond: 44.6,
        },
      },
      {
        modelId: "llama3.2",
        status: "error",
        response: "",
        error: "Connection closed before the first token was received.",
        metrics: {
          latencyMs: 30_000,
          tokensIn: 269,
          tokensOut: 0,
          costUsd: 0,
          tokensPerSecond: 0,
        },
      },
    ],
  },
  {
    id: "run_05",
    prompt:
      "Cluster these 12 support tickets into themes and rank them by churn risk.",
    createdAt: "2026-11-21T08:15:00Z",
    tags: ["analysis", "support"],
    responses: [
      {
        modelId: "gpt-4o-mini",
        status: "done",
        response:
          "Three themes: billing disputes (5 tickets, highest churn risk — two mention cancelled renewals), streaming stalls on long outputs (4 tickets, medium risk), and SSO setup confusion (3 tickets, low risk but high volume). Billing disputes concentrate in accounts older than 18 months, so route them to a human within one hour.",
        metrics: {
          latencyMs: 3120,
          tokensIn: 942,
          tokensOut: 388,
          costUsd: 0.00037,
          tokensPerSecond: 66.8,
        },
      },
      {
        modelId: "gemini-2.5-flash",
        status: "done",
        response:
          "Ranked by churn signal: 1) unexpected overage charges — two explicit cancellation threats; 2) runs that silently stop streaming past 90 seconds — four tickets, three from the same workspace; 3) SSO/SAML onboarding — mostly documentation gaps; 4) missing CSV export — two enterprise accounts waiting on it. Recommend a billing credit for theme 1 before the next renewal cycle.",
        metrics: {
          latencyMs: 2740,
          tokensIn: 938,
          tokensOut: 512,
          costUsd: 0.00156,
          tokensPerSecond: 72.4,
        },
      },
      {
        modelId: "deepseek-chat",
        status: "streaming",
        response:
          "Cluster 1 is billing: five tickets, all referencing a plan change, with the strongest language in the enterprise segment. Cluster 2 is reliability: four reports of stalled streams, all with prompts over 4k tokens. Cluster 3 is onboarding: SSO configuration, three tickets sharing the same",
        metrics: {
          latencyMs: 4980,
          tokensIn: 935,
          tokensOut: 476,
          costUsd: 0.00078,
          tokensPerSecond: 48.9,
        },
      },
      {
        modelId: "llama3.2",
        status: "done",
        response:
          "Most urgent are billing complaints, especially two that mention cancelling. Next are streaming timeouts on long prompts, then SSO setup questions. I would also flag that three tickets ask for the same CSV export that is already on the roadmap.",
        metrics: {
          latencyMs: 8210,
          tokensIn: 940,
          tokensOut: 341,
          costUsd: 0,
          tokensPerSecond: 28.1,
        },
      },
    ],
  },
  {
    id: "run_06",
    prompt:
      "Generate a Postgres schema for a multi-tenant booking system with waitlists.",
    createdAt: "2026-11-19T14:33:00Z",
    tags: ["sql", "schema"],
    responses: [
      {
        modelId: "gpt-4o-mini",
        status: "done",
        response:
          "Core tables: tenants, resources, bookings, and waitlist_entries. Give bookings a tstzrange column with a GiST exclusion constraint per resource so overlapping bookings are rejected by the database, not application code. Waitlist entries reference the desired range and a priority score; promote them in a transaction that takes the same exclusion lock.",
        metrics: {
          latencyMs: 4630,
          tokensIn: 356,
          tokensOut: 826,
          costUsd: 0.00055,
          tokensPerSecond: 69.3,
        },
      },
      {
        modelId: "gemini-2.5-flash",
        status: "done",
        response:
          "Use tenants(id, slug, plan), resources(id, tenant_id, name, timezone), bookings(id, tenant_id, resource_id, customer_id, period tstzrange, status) with EXCLUDE USING gist (resource_id WITH =, period WITH &&), and waitlist_entries(id, tenant_id, resource_id, desired_period, priority, created_at). Add RLS policies on tenant_id for every table, and an index on bookings(tenant_id, period) for range reports.",
        metrics: {
          latencyMs: 4020,
          tokensIn: 349,
          tokensOut: 780,
          costUsd: 0.00205,
          tokensPerSecond: 70.6,
        },
      },
      {
        modelId: "deepseek-chat",
        status: "error",
        response: "",
        error:
          "Context length exceeded: prompt plus schema draft is 65,912 tokens (limit 64,000).",
        metrics: {
          latencyMs: 1870,
          tokensIn: 352,
          tokensOut: 0,
          costUsd: 0.0001,
          tokensPerSecond: 0,
        },
      },
      {
        modelId: "llama3.2",
        status: "done",
        response:
          "Start with tenants and resources, then bookings and a separate waitlist table. Store start and end timestamps and add a unique index to stop double booking. Keep tenant_id on every table and enable row level security so one tenant can never read another's bookings.",
        metrics: {
          latencyMs: 11_240,
          tokensIn: 354,
          tokensOut: 694,
          costUsd: 0,
          tokensPerSecond: 30.4,
        },
      },
    ],
  },
];

export type TemplateCategory = "Engineering" | "Data" | "Product" | "Evaluation";

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  prompt: string;
  tags: string[];
};

export const promptTemplates: PromptTemplate[] = [
  {
    id: "tpl_architecture_review",
    title: "Architecture review",
    description:
      "Pressure-test a design doc and surface the failure modes before implementation.",
    category: "Engineering",
    prompt:
      "Review this system design as a skeptical staff engineer. List the three most likely failure modes at 10x current traffic, the trade-offs you would revisit, and the smallest experiment that would de-risk the launch. Design: {{design}}",
    tags: ["review", "scaling"],
  },
  {
    id: "tpl_explain_senior",
    title: "Explain to a senior peer",
    description:
      "Get a precise explanation that assumes engineering maturity but no domain expertise.",
    category: "Engineering",
    prompt:
      "Explain {{topic}} to a staff engineer who has never worked in this domain. Use one concrete analogy, then the precise mechanism, then the two most common misconceptions. No marketing language.",
    tags: ["explanation", "onboarding"],
  },
  {
    id: "tpl_sql_tune",
    title: "SQL performance tune",
    description:
      "Diagnose a slow query and get an index plan with expected trade-offs.",
    category: "Data",
    prompt:
      "Here is a slow Postgres query and its EXPLAIN ANALYZE output. Identify the dominant cost, propose an index or rewrite, and state what could regress. Query: {{query}}\nPlan:\n{{plan}}",
    tags: ["postgres", "performance"],
  },
  {
    id: "tpl_release_notes",
    title: "Release notes",
    description:
      "Turn a raw changelog into notes a customer can skim in thirty seconds.",
    category: "Product",
    prompt:
      "Write release notes for {{version}} from this changelog. Lead with the user-visible outcome, group by theme, keep each item to one sentence, and move internal refactors to a short maintenance section. Changelog:\n{{changelog}}",
    tags: ["writing", "launch"],
  },
  {
    id: "tpl_judge_winner",
    title: "Judge: pick a winner",
    description:
      "Score responses on correctness, clarity and cost, then justify the winner.",
    category: "Evaluation",
    prompt:
      "You are the judge for a model arena. Score each response from 1 to 5 on correctness, clarity and usefulness to a senior developer. Penalize confident errors harder than missing detail. Then name one winner and explain the deciding factor in two sentences.",
    tags: ["judge", "evaluation"],
  },
];

export type HistoryItem = {
  id: string;
  title: string;
  prompt: string;
  modelIds: string[];
  createdAt: string;
  costUsd: number;
  latencyMs: number;
  status: RunStatus;
  winnerModelId?: string;
};

export const historyItems: HistoryItem[] = [
  {
    id: "hist_01",
    title: "Multi-tenant rate limiter",
    prompt: "Design a rate limiter for a multi-tenant API with burst traffic.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-26T09:42:00Z",
    costUsd: 0.00232,
    latencyMs: 6930,
    status: "done",
    winnerModelId: "gemini-2.5-flash",
  },
  {
    id: "hist_02",
    title: "Attention, explained",
    prompt:
      "Explain how transformer attention works to a staff engineer who has never trained a model.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-25T16:08:00Z",
    costUsd: 0.00297,
    latencyMs: 30_000,
    status: "streaming",
    winnerModelId: "gpt-4o-mini",
  },
  {
    id: "hist_03",
    title: "Postgres seq scan teardown",
    prompt:
      "Refactor this Postgres query so it stops sequential-scanning 40M events.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-24T11:26:00Z",
    costUsd: 0.00446,
    latencyMs: 9880,
    status: "done",
    winnerModelId: "deepseek-chat",
  },
  {
    id: "hist_04",
    title: "v2.4 release notes",
    prompt:
      "Write release notes for v2.4: streaming judge mode, cost guardrails, and CSV export.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-22T18:54:00Z",
    costUsd: 0.00202,
    latencyMs: 30_000,
    status: "error",
  },
  {
    id: "hist_05",
    title: "Support ticket clustering",
    prompt:
      "Cluster these 12 support tickets into themes and rank them by churn risk.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-21T08:15:00Z",
    costUsd: 0.00271,
    latencyMs: 8210,
    status: "done",
    winnerModelId: "gemini-2.5-flash",
  },
  {
    id: "hist_06",
    title: "Booking schema draft",
    prompt:
      "Generate a Postgres schema for a multi-tenant booking system with waitlists.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-19T14:33:00Z",
    costUsd: 0.0027,
    latencyMs: 1870,
    status: "error",
    winnerModelId: "gpt-4o-mini",
  },
  {
    id: "hist_07",
    title: "Idempotency key strategy",
    prompt:
      "Compare idempotency key strategies for a payments API that retries webhooks.",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat"],
    createdAt: "2026-11-18T10:02:00Z",
    costUsd: 0.00184,
    latencyMs: 4460,
    status: "done",
    winnerModelId: "gpt-4o-mini",
  },
  {
    id: "hist_08",
    title: "On-call handbook outline",
    prompt:
      "Outline an on-call handbook for a small platform team, including escalation paths.",
    modelIds: ["gpt-4o-mini", "deepseek-chat", "llama3.2"],
    createdAt: "2026-11-17T07:47:00Z",
    costUsd: 0.00061,
    latencyMs: 7620,
    status: "done",
    winnerModelId: "deepseek-chat",
  },
];

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  delta?: {
    value: string;
    direction: "up" | "down";
    tone?: "positive" | "negative" | "neutral";
  };
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "runs",
    label: "Runs this week",
    value: "128",
    hint: "Across 4 workspaces",
    delta: { value: "18.2%", direction: "up", tone: "positive" },
  },
  {
    id: "tokens",
    label: "Tokens processed",
    value: "1.84M",
    hint: "72% output tokens",
    delta: { value: "12.4%", direction: "up", tone: "neutral" },
  },
  {
    id: "cost",
    label: "Spend",
    value: "$4.82",
    hint: "Budget $12.00",
    delta: { value: "8.6%", direction: "up", tone: "negative" },
  },
  {
    id: "latency",
    label: "p50 latency",
    value: "2.61s",
    hint: "Fastest: gpt-4o-mini",
    delta: { value: "9.8%", direction: "down", tone: "positive" },
  },
  {
    id: "judge",
    label: "Judge agreement",
    value: "72%",
    hint: "Matches human pick",
    delta: { value: "4.1%", direction: "up", tone: "positive" },
  },
];

export type UsagePoint = {
  /** ISO date, one point per day */
  date: string;
  runs: number;
  /** Thousands of tokens */
  tokens: number;
  costUsd: number;
  p50LatencyMs: number;
};

export const usageSeries: UsagePoint[] = [
  { date: "2026-11-13", runs: 9, tokens: 96, costUsd: 0.42, p50LatencyMs: 3120 },
  { date: "2026-11-14", runs: 12, tokens: 134, costUsd: 0.58, p50LatencyMs: 3040 },
  { date: "2026-11-15", runs: 8, tokens: 88, costUsd: 0.36, p50LatencyMs: 3260 },
  { date: "2026-11-16", runs: 15, tokens: 172, costUsd: 0.74, p50LatencyMs: 2980 },
  { date: "2026-11-17", runs: 11, tokens: 121, costUsd: 0.51, p50LatencyMs: 2870 },
  { date: "2026-11-18", runs: 14, tokens: 158, costUsd: 0.69, p50LatencyMs: 2920 },
  { date: "2026-11-19", runs: 6, tokens: 64, costUsd: 0.28, p50LatencyMs: 3410 },
  { date: "2026-11-20", runs: 4, tokens: 41, costUsd: 0.19, p50LatencyMs: 3580 },
  { date: "2026-11-21", runs: 13, tokens: 149, costUsd: 0.63, p50LatencyMs: 2860 },
  { date: "2026-11-22", runs: 17, tokens: 188, costUsd: 0.81, p50LatencyMs: 2740 },
  { date: "2026-11-23", runs: 12, tokens: 132, costUsd: 0.57, p50LatencyMs: 2810 },
  { date: "2026-11-24", runs: 16, tokens: 179, costUsd: 0.77, p50LatencyMs: 2690 },
  { date: "2026-11-25", runs: 19, tokens: 205, costUsd: 0.88, p50LatencyMs: 2640 },
  { date: "2026-11-26", runs: 22, tokens: 241, costUsd: 1.03, p50LatencyMs: 2610 },
];

export type ModelUsage = {
  modelId: string;
  provider: ModelProvider;
  runs: number;
  tokens: number;
  avgLatencyMs: number;
  costUsd: number;
};

export const modelUsage: ModelUsage[] = [
  {
    modelId: "gpt-4o-mini",
    provider: "openai",
    runs: 58,
    tokens: 612_000,
    avgLatencyMs: 3120,
    costUsd: 1.42,
  },
  {
    modelId: "gemini-2.5-flash",
    provider: "gemini",
    runs: 41,
    tokens: 548_000,
    avgLatencyMs: 2610,
    costUsd: 2.18,
  },
  {
    modelId: "deepseek-chat",
    provider: "deepseek",
    runs: 22,
    tokens: 384_000,
    avgLatencyMs: 5280,
    costUsd: 0.94,
  },
  {
    modelId: "llama3.2",
    provider: "ollama",
    runs: 17,
    tokens: 296_000,
    avgLatencyMs: 8940,
    costUsd: 0,
  },
];

export type DashboardStatsSeries = {
  totals: DashboardStat[];
  usage: UsagePoint[];
  modelUsage: ModelUsage[];
};

export const dashboardStatsSeries: DashboardStatsSeries = {
  totals: dashboardStats,
  usage: usageSeries,
  modelUsage,
};
