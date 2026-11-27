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

export type ResponseCodeSample = {
  language: string;
  filename?: string;
  code: string;
};

export type ModelResponse = {
  modelId: string;
  response: string;
  metrics: ModelMetrics;
  status: RunStatus;
  error?: string;
  /** Optional snippet rendered under the prose in a result card. */
  code?: ResponseCodeSample;
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

export type ArenaSummaryItem = {
  id: "fastest" | "cheapest" | "tokens";
  label: string;
  value: string;
  hint: string;
};

export type ArenaDemo = {
  id: string;
  prompt: string;
  systemPrompt: string;
  selectedModelIds: string[];
  winnerModelId: string;
  responses: ModelResponse[];
};

/** The hand-written run shown on the Arena page: one done, one streaming, one error. */
export const arenaDemo: ArenaDemo = {
  id: "run_01",
  prompt:
    "Design a rate limiter for a multi-tenant API with burst traffic. It has to survive a Redis failover and stay fair across tenants.",
  systemPrompt:
    "You are a staff platform engineer. Answer in short paragraphs, then one small code snippet. Prefer concrete trade-offs over generic advice.",
  selectedModelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat"],
  winnerModelId: "gpt-4o-mini",
  responses: [
    {
      modelId: "gpt-4o-mini",
      status: "done",
      response:
        "Use a token bucket per tenant and route, refilled lazily from the elapsed timestamp instead of a cron job, so idle tenants cost nothing.\n\nKeep burst capacity separate from the steady refill rate. A tenant gets 60 requests a minute and a burst of 20; a noisy neighbour can drain its own bucket without touching anyone else's.\n\nThe read-refill-decrement step has to be atomic. One Lua script gives you that without a distributed lock, and it keeps the hot path to a single Redis round trip.",
      code: {
        language: "typescript",
        filename: "rate-limit.ts",
        code: [
          "const { allowed, remaining } = await redis.eval(",
          "  TOKEN_BUCKET_LUA,",
          "  1,",
          "  `bucket:${tenantId}:${route}`,",
          "  capacity, refillPerSecond, Date.now(),",
          ");",
          "",
          "if (!allowed) {",
          '  reply.header("Retry-After", Math.ceil((1 - remaining) / refillPerSecond));',
          '  return reply.code(429).send({ error: "rate_limited" });',
          "}",
        ].join("\n"),
      },
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
      status: "streaming",
      response:
        "Two tiers keeps the failure modes small: a coarse limiter at the gateway per tenant, then a per-route limiter inside the service that owns the resource.\n\nStore bucket state in Redis with a TTL equal to the refill window so abandoned tenants expire on their own. On failover, fail open for paid plans and closed for free ones — the blast radius is a billing conversation rather than an outage.\n\nEmit the remaining budget and reset time on every response so clients can back off",
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
      status: "error",
      response: "",
      error:
        "Stream ended before the first token (upstream 503). The request was retried twice with backoff.",
      metrics: {
        latencyMs: 30_000,
        tokensIn: 398,
        tokensOut: 0,
        costUsd: 0,
        tokensPerSecond: 0,
      },
    },
  ],
};

export const arenaSummary: ArenaSummaryItem[] = [
  {
    id: "fastest",
    label: "Fastest",
    value: "2.31s",
    hint: "gemini-2.5-flash · first token",
  },
  {
    id: "cheapest",
    label: "Cheapest",
    value: "$0.00029",
    hint: "gpt-4o-mini · 386 output tokens",
  },
  {
    id: "tokens",
    label: "Most tokens",
    value: "512",
    hint: "gemini-2.5-flash · output",
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

export type JudgeCriterionId =
  | "accuracy"
  | "clarity"
  | "conciseness"
  | "creativity"
  | "safety";

export type JudgeCriterion = {
  id: JudgeCriterionId;
  label: string;
  description: string;
  /** Share of the total score, 0–1 */
  defaultWeight: number;
};

export const judgeCriteria: JudgeCriterion[] = [
  {
    id: "accuracy",
    label: "Accuracy",
    description: "Correct claims, no confident errors.",
    defaultWeight: 0.4,
  },
  {
    id: "clarity",
    label: "Clarity",
    description: "Easy to follow on one read.",
    defaultWeight: 0.25,
  },
  {
    id: "conciseness",
    label: "Conciseness",
    description: "No padding, no restated prompt.",
    defaultWeight: 0.15,
  },
  {
    id: "creativity",
    label: "Creativity",
    description: "Useful angles the prompt did not ask for.",
    defaultWeight: 0.1,
  },
  {
    id: "safety",
    label: "Safety",
    description: "Avoids risky or misleading guidance.",
    defaultWeight: 0.1,
  },
];

export type JudgeSourceAnswer = {
  modelId: string;
  answer: string;
  tokenCount: number;
  included: boolean;
};

export const judgeSourceAnswers: JudgeSourceAnswer[] = [
  {
    modelId: "gpt-4o-mini",
    tokenCount: 386,
    included: true,
    answer:
      "Use a token bucket per tenant and route, refilled lazily from the elapsed timestamp so idle tenants cost nothing. Keep burst capacity separate from the steady refill rate, and make the read-refill-decrement step atomic with a single Lua script.",
  },
  {
    modelId: "gemini-2.5-flash",
    tokenCount: 512,
    included: true,
    answer:
      "Two tiers keeps the failure modes small: a coarse limiter at the gateway per tenant, then a per-route limiter in the service. Store bucket state in Redis with a TTL of the refill window so abandoned tenants expire on their own.",
  },
  {
    modelId: "deepseek-chat",
    tokenCount: 471,
    included: true,
    answer:
      "Start with a leaky bucket if you care about smoothing downstream load, otherwise token bucket is easier to explain to customers. Keep counters in memory per instance and reconcile through Redis only near the limit.",
  },
  {
    modelId: "llama3.2",
    tokenCount: 358,
    included: true,
    answer:
      "A fixed window counter is the simplest option: key by tenant and minute, increment in Redis, expire after 120 seconds. It allows bursts at window boundaries, so add a sliding check if fairness matters.",
  },
];

export type JudgeScore = {
  modelId: string;
  /** Weighted total, 0–10 */
  total: number;
  /** Per-criterion score, 0–10 */
  criteria: Record<JudgeCriterionId, number>;
  strengths: string[];
  weaknesses: string[];
  reasoning: string;
};

export type JudgeRubricWeight = {
  criterionId: JudgeCriterionId;
  label: string;
  weight: number;
};

export type JudgeVerdict = {
  id: string;
  judgeModelId: string;
  prompt: string;
  rubric: JudgeRubricWeight[];
  scores: JudgeScore[];
  winnerModelId: string;
  confidence: number;
  durationMs: number;
  costUsd: number;
  rawJson: string;
};

export const judgeVerdict: JudgeVerdict = {
  id: "jdg_01HZXQ4M8K",
  judgeModelId: "gemini-2.5-flash",
  prompt:
    "Design a rate limiter for a multi-tenant API with burst traffic. It has to survive a Redis failover and stay fair across tenants.",
  confidence: 0.86,
  durationMs: 3120,
  costUsd: 0.00184,
  rubric: [
    { criterionId: "accuracy", label: "Accuracy", weight: 0.4 },
    { criterionId: "clarity", label: "Clarity", weight: 0.25 },
    { criterionId: "conciseness", label: "Conciseness", weight: 0.15 },
    { criterionId: "creativity", label: "Creativity", weight: 0.1 },
    { criterionId: "safety", label: "Safety", weight: 0.1 },
  ],
  winnerModelId: "gpt-4o-mini",
  scores: [
    {
      modelId: "gpt-4o-mini",
      total: 8.6,
      criteria: {
        accuracy: 8.6,
        clarity: 9,
        conciseness: 8.2,
        creativity: 7.4,
        safety: 9.4,
      },
      strengths: [
        "Atomic refill is the correct primitive for burst traffic.",
        "Separates burst capacity from the steady rate, which is the part teams usually get wrong.",
        "Names the concrete mechanism (single Lua script) instead of hand-waving.",
      ],
      weaknesses: [
        "Does not address what happens when Redis is unavailable during failover.",
        "No mention of fairness between routes of the same tenant.",
      ],
      reasoning:
        "The answer states the design in the order an implementer needs it: bucket key, lazy refill, then atomicity. Its trade-off between burst size and refill rate is the detail that separates a working limiter from a naive one. It loses marks only for skipping the failover behaviour the prompt explicitly asked about.",
    },
    {
      modelId: "deepseek-chat",
      total: 8.57,
      criteria: {
        accuracy: 9,
        clarity: 7.8,
        conciseness: 8.8,
        creativity: 8,
        safety: 9,
      },
      strengths: [
        "Introduces in-memory counters with Redis reconciliation near the limit.",
        "Explicit fail-open for paid tenants, fail-closed for free tiers.",
        "Correctly distinguishes leaky bucket from token bucket.",
      ],
      weaknesses: [
        "The in-memory fast path needs a staleness bound it never states.",
        "Opening sentence delays the actual recommendation.",
      ],
      reasoning:
        "Technically the strongest answer: it names the two failure modes that dominate real deployments, Redis round-trip cost and failover policy, and gives a defensible default for each. It ranks just below the winner because the same ideas take longer to extract and the in-memory fast path is under-specified.",
    },
    {
      modelId: "gemini-2.5-flash",
      total: 8.55,
      criteria: {
        accuracy: 8.2,
        clarity: 9.4,
        conciseness: 7.6,
        creativity: 8.6,
        safety: 9.2,
      },
      strengths: [
        "The two-tier gateway/service split is easy to reason about and to operate.",
        "TTL equal to the refill window is a clean way to expire idle tenants.",
      ],
      weaknesses: [
        "Twice as many words as the winner for the same core design.",
        "Emphasises response headers over the limiter itself.",
      ],
      reasoning:
        "The clearest read of the four and the best structure for a design review. It trades the winner's precision for breadth: more operational advice, less on the exact atomic step. A good answer that would need one follow-up question before implementation.",
    },
    {
      modelId: "llama3.2",
      total: 7.32,
      criteria: {
        accuracy: 6.8,
        clarity: 7.2,
        conciseness: 8.4,
        creativity: 6.6,
        safety: 8.8,
      },
      strengths: [
        "Short and honest about the trade-off it is making.",
        "Fixed windows are genuinely the simplest thing that works.",
      ],
      weaknesses: [
        "Fixed windows ignore the burst problem the prompt is about.",
        "No mention of failover behaviour at all.",
        "Does not explain why the boundary burst happens.",
      ],
      reasoning:
        "Readable and appropriately brief, but it answers an easier question than the one asked. A fixed window is a reasonable starting point, yet the prompt is specifically about burst traffic and Redis failover, and neither is addressed in a way that would survive a design review.",
    },
  ],
  rawJson: `{
  "verdict_id": "jdg_01HZXQ4M8K",
  "judge_model": "gemini-2.5-flash",
  "prompt_id": "run_01",
  "rubric": {
    "accuracy": 0.4,
    "clarity": 0.25,
    "conciseness": 0.15,
    "creativity": 0.1,
    "safety": 0.1
  },
  "scores": [
    {
      "model": "gpt-4o-mini",
      "total": 8.6,
      "criteria": { "accuracy": 8.6, "clarity": 9.0, "conciseness": 8.2, "creativity": 7.4, "safety": 9.4 },
      "flags": ["missing_failover_policy"]
    },
    {
      "model": "deepseek-chat",
      "total": 8.57,
      "criteria": { "accuracy": 9.0, "clarity": 7.8, "conciseness": 8.8, "creativity": 8.0, "safety": 9.0 },
      "flags": ["unspecified_staleness_bound"]
    },
    {
      "model": "gemini-2.5-flash",
      "total": 8.55,
      "criteria": { "accuracy": 8.2, "clarity": 9.4, "conciseness": 7.6, "creativity": 8.6, "safety": 9.2 },
      "flags": ["verbose"]
    },
    {
      "model": "llama3.2",
      "total": 7.32,
      "criteria": { "accuracy": 6.8, "clarity": 7.2, "conciseness": 8.4, "creativity": 6.6, "safety": 8.8 },
      "flags": ["does_not_address_prompt"]
    }
  ],
  "winner": "gpt-4o-mini",
  "confidence": 0.86,
  "reasoning": "Correct primitive, stated in implementation order, with the burst/refill split made explicit.",
  "usage": { "input_tokens": 1841, "output_tokens": 612, "cost_usd": 0.00184 }
}`,
};

export type BrochureTone = "Professional" | "Humorous";

export type BrochureLinkType =
  | "About"
  | "Careers"
  | "Pricing"
  | "Product"
  | "Blog"
  | "Docs";

export type BrochureLink = {
  id: string;
  label: string;
  url: string;
  type: BrochureLinkType;
  relevant: boolean;
};

export type BrochureStepStatus = "done" | "active" | "pending";

export type BrochureStep = {
  id: number;
  title: string;
  detail: string;
  status: BrochureStepStatus;
};

export type BrochureBlock =
  | { kind: "heading"; level: 1 | 2; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; text: string };

export type BrochureCallLogEntry = {
  id: string;
  call: string;
  modelId: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  costUsd: number;
};

export type BrochureDemo = {
  url: string;
  tone: BrochureTone;
  modelId: string;
  pageTitle: string;
  pageContent: string;
  links: BrochureLink[];
  steps: BrochureStep[];
  blocks: BrochureBlock[];
  callLog: BrochureCallLogEntry[];
};

export const brochureDemo: BrochureDemo = {
  url: "https://cadencehq.com",
  tone: "Professional",
  modelId: "gemini-2.5-flash",
  pageTitle: "Cadence — product analytics for engineering teams",
  pageContent:
    "Cadence turns product events into answers engineers can act on. Connect your warehouse, define a metric once, and every dashboard, alert and PR comment reads from the same definition. We support Snowflake, BigQuery and Postgres out of the box, keep all computation inside your own warehouse, and never copy raw events to our servers. Teams at 400+ companies use Cadence to catch regressions before release, measure activation without a data team, and retire the spreadsheet of SQL snippets that used to be their source of truth. Pricing is per seat with unlimited events; a 14-day trial needs no credit card. We are remote-first across 11 countries and hiring in platform, design and developer relations.",
  steps: [
    {
      id: 1,
      title: "Scrape page",
      detail: "landing page · 812 tokens",
      status: "done",
    },
    {
      id: 2,
      title: "Pick relevant links",
      detail: "10 links → 5 relevant",
      status: "done",
    },
    {
      id: 3,
      title: "Write brochure",
      detail: "streaming · 1,846 tokens",
      status: "active",
    },
  ],
  links: [
    {
      id: "lnk_about",
      label: "About Cadence",
      url: "/about",
      type: "About",
      relevant: true,
    },
    {
      id: "lnk_pricing",
      label: "Pricing",
      url: "/pricing",
      type: "Pricing",
      relevant: true,
    },
    {
      id: "lnk_warehouse",
      label: "Warehouse-native analytics",
      url: "/product/warehouse",
      type: "Product",
      relevant: true,
    },
    {
      id: "lnk_careers",
      label: "Careers — we're hiring",
      url: "/careers",
      type: "Careers",
      relevant: true,
    },
    {
      id: "lnk_customers",
      label: "Customer stories",
      url: "/customers",
      type: "Product",
      relevant: true,
    },
    {
      id: "lnk_blog",
      label: "Blog: metrics that survive a reorg",
      url: "/blog/metrics-reorg",
      type: "Blog",
      relevant: false,
    },
    {
      id: "lnk_changelog",
      label: "Changelog — v3.2",
      url: "/changelog",
      type: "Product",
      relevant: false,
    },
    {
      id: "lnk_docs",
      label: "Docs: connecting BigQuery",
      url: "/docs/bigquery",
      type: "Docs",
      relevant: false,
    },
    {
      id: "lnk_security",
      label: "Security & compliance",
      url: "/security",
      type: "Docs",
      relevant: false,
    },
    {
      id: "lnk_press",
      label: "Press kit",
      url: "/press",
      type: "About",
      relevant: false,
    },
  ],
  blocks: [
    { kind: "heading", level: 1, text: "Cadence" },
    {
      kind: "paragraph",
      text: "Product analytics that runs inside your warehouse. Define a metric once and every dashboard, alert and pull request reads from the same definition.",
    },
    { kind: "heading", level: 2, text: "What it does" },
    {
      kind: "list",
      items: [
        "Connects to Snowflake, BigQuery and Postgres with read-only credentials.",
        "Keeps computation in your warehouse — raw events never leave it.",
        "Surfaces activation and regression signals next to the PR that caused them.",
        "Retires the spreadsheet of one-off SQL that used to be the source of truth.",
      ],
    },
    {
      kind: "callout",
      text: "Per seat pricing with unlimited events. A 14-day trial needs no credit card.",
    },
    { kind: "heading", level: 2, text: "Who it is for" },
    {
      kind: "list",
      items: [
        "Platform and product engineering teams that own their own metrics.",
        "Companies with 400+ seats or 400+ employees already on Cadence.",
        "Teams hiring across platform, design and developer relations.",
      ],
    },
    {
      kind: "paragraph",
      text: "Remote-first across 11 countries, with a support model staffed by the engineers who build the product.",
    },
  ],
  callLog: [
    {
      id: "call_1",
      call: "fetch_page_content",
      modelId: "gemini-2.5-flash",
      tokensIn: 142,
      tokensOut: 812,
      latencyMs: 1240,
      costUsd: 0.0024,
    },
    {
      id: "call_2",
      call: "select_relevant_links",
      modelId: "gemini-2.5-flash",
      tokensIn: 2860,
      tokensOut: 486,
      latencyMs: 980,
      costUsd: 0.0021,
    },
    {
      id: "call_3",
      call: "generate_brochure",
      modelId: "gpt-4o-mini",
      tokensIn: 4312,
      tokensOut: 1846,
      latencyMs: 3120,
      costUsd: 0.0018,
    },
  ],
};

export type TemplateFilterTag =
  | "Summarization"
  | "Coding"
  | "Writing"
  | "Analysis"
  | "Translation";

export type LibraryTemplate = {
  id: string;
  title: string;
  tags: string[];
  systemPrompt: string;
  userPrompt: string;
  /** Human-readable relative time, e.g. "2 days ago" */
  lastUsed: string;
  usageCount: number;
  pinned: boolean;
};

export const libraryTemplates: LibraryTemplate[] = [
  {
    id: "tpl_ticket_triage",
    title: "Ticket triage",
    tags: ["Analysis", "Support"],
    systemPrompt:
      "You are a support lead triaging an inbound ticket queue. Classify each ticket by product area, urgency and churn signal, then propose the shortest reply that resolves it. Never promise a fix you cannot verify.",
    userPrompt:
      "Triage these tickets and rank them by churn risk:\n{{tickets}}",
    lastUsed: "2 hours ago",
    usageCount: 148,
    pinned: true,
  },
  {
    id: "tpl_sql_tune",
    title: "SQL performance tune",
    tags: ["Coding", "Postgres"],
    systemPrompt:
      "You are a database performance engineer. Read the query and its EXPLAIN plan, identify the dominant cost, propose one index or rewrite, and state what could regress.",
    userPrompt: "Query:\n{{query}}\n\nPlan:\n{{plan}}",
    lastUsed: "yesterday",
    usageCount: 96,
    pinned: true,
  },
  {
    id: "tpl_release_notes",
    title: "Release notes",
    tags: ["Writing", "Launch"],
    systemPrompt:
      "Write release notes a customer can skim in thirty seconds. Lead with the user-visible outcome, group by theme, keep each item to one sentence, and move internal refactors to a maintenance section.",
    userPrompt: "Write notes for {{version}} from this changelog:\n{{changelog}}",
    lastUsed: "3 days ago",
    usageCount: 64,
    pinned: false,
  },
  {
    id: "tpl_exec_summary",
    title: "Executive summary",
    tags: ["Summarization", "Product"],
    systemPrompt:
      "Summarise for a VP who has ninety seconds. One sentence on what changed, three bullets on why it matters, and one line on the decision you need from them. No adjectives.",
    userPrompt: "Summarise this doc:\n{{document}}",
    lastUsed: "4 days ago",
    usageCount: 57,
    pinned: false,
  },
  {
    id: "tpl_code_review",
    title: "Skeptical code review",
    tags: ["Coding", "Review"],
    systemPrompt:
      "Review this diff as a staff engineer who has been paged for it. Call out correctness bugs first, then failure modes under load, then naming. Skip style nits entirely.",
    userPrompt: "Review this diff:\n{{diff}}",
    lastUsed: "1 week ago",
    usageCount: 212,
    pinned: true,
  },
  {
    id: "tpl_doc_translate",
    title: "Docs localisation",
    tags: ["Translation", "Docs"],
    systemPrompt:
      "Translate technical documentation into {{language}}. Keep code identifiers, CLI flags and product names verbatim, translate explanatory prose, and preserve markdown structure exactly.",
    userPrompt: "Translate this page:\n{{markdown}}",
    lastUsed: "1 week ago",
    usageCount: 41,
    pinned: false,
  },
  {
    id: "tpl_incident_timeline",
    title: "Incident timeline",
    tags: ["Summarization", "SRE"],
    systemPrompt:
      "Turn a raw incident channel into a timeline a postmortem can use. Timestamps in UTC, one line per event, separate detection from mitigation, and end with the three open questions.",
    userPrompt: "Build the timeline from this channel log:\n{{log}}",
    lastUsed: "2 weeks ago",
    usageCount: 23,
    pinned: false,
  },
  {
    id: "tpl_ab_test_readout",
    title: "A/B test readout",
    tags: ["Analysis", "Growth"],
    systemPrompt:
      "Interpret this experiment honestly. Report the effect size with its interval, state whether the test was powered, list the segments that moved most, and recommend ship, iterate or stop.",
    userPrompt: "Read out this experiment:\n{{results}}",
    lastUsed: "2 weeks ago",
    usageCount: 18,
    pinned: false,
  },
  {
    id: "tpl_changelog_copy",
    title: "Changelog to tweet",
    tags: ["Writing", "Marketing"],
    systemPrompt:
      "Turn a changelog into three short posts: one plain, one for developers, one dry and funny. No hashtags, no exclamation marks, under 240 characters each.",
    userPrompt: "Changelog entry:\n{{entry}}",
    lastUsed: "3 weeks ago",
    usageCount: 12,
    pinned: false,
  },
];

export type HistoryMode = "Compare" | "Judge" | "Brochure";

export type HistoryRun = {
  id: string;
  title: string;
  prompt: string;
  mode: HistoryMode;
  modelIds: string[];
  winnerModelId?: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  createdAt: string;
  relativeDate: string;
  status: RunStatus;
};

export const historyRuns: HistoryRun[] = [
  {
    id: "run_01",
    title: "Multi-tenant rate limiter",
    prompt: "Design a rate limiter for a multi-tenant API with burst traffic. It has to survive a Redis failover.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    winnerModelId: "gpt-4o-mini",
    tokensIn: 1841,
    tokensOut: 1727,
    costUsd: 0.00232,
    createdAt: "2026-11-26T09:42:00Z",
    relativeDate: "2 hours ago",
    status: "done",
  },
  {
    id: "run_07",
    title: "Judge: rate limiter answers",
    prompt: "Score the rate limiter answers on a weighted rubric and name a winner.",
    mode: "Judge",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    winnerModelId: "gpt-4o-mini",
    tokensIn: 4210,
    tokensOut: 912,
    costUsd: 0.00184,
    createdAt: "2026-11-26T09:47:00Z",
    relativeDate: "2 hours ago",
    status: "done",
  },
  {
    id: "run_02",
    title: "Attention, explained",
    prompt: "Explain how transformer attention works to a staff engineer who has never trained a model.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat"],
    winnerModelId: "gemini-2.5-flash",
    tokensIn: 385,
    tokensOut: 2085,
    costUsd: 0.00297,
    createdAt: "2026-11-25T16:08:00Z",
    relativeDate: "yesterday",
    status: "streaming",
  },
  {
    id: "run_08",
    title: "Brochure: cadencehq.com",
    prompt: "Generate a professional brochure for https://cadencehq.com.",
    mode: "Brochure",
    modelIds: ["gemini-2.5-flash", "gpt-4o-mini"],
    tokensIn: 7314,
    tokensOut: 3144,
    costUsd: 0.0063,
    createdAt: "2026-11-25T11:20:00Z",
    relativeDate: "yesterday",
    status: "done",
  },
  {
    id: "run_03",
    title: "Postgres seq scan teardown",
    prompt: "Refactor this Postgres query so it stops sequential-scanning 40M events.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    winnerModelId: "deepseek-chat",
    tokensIn: 4693,
    tokensOut: 2331,
    costUsd: 0.00446,
    createdAt: "2026-11-24T11:26:00Z",
    relativeDate: "2 days ago",
    status: "done",
  },
  {
    id: "run_04",
    title: "v2.4 release notes",
    prompt: "Write release notes for v2.4: streaming judge mode, cost guardrails, and CSV export.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    tokensIn: 1073,
    tokensOut: 1265,
    costUsd: 0.00202,
    createdAt: "2026-11-22T18:54:00Z",
    relativeDate: "4 days ago",
    status: "error",
  },
  {
    id: "run_09",
    title: "Judge: release note drafts",
    prompt: "Pick the release notes a customer can skim fastest, and justify the pick.",
    mode: "Judge",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat"],
    winnerModelId: "gemini-2.5-flash",
    tokensIn: 2980,
    tokensOut: 744,
    costUsd: 0.00141,
    createdAt: "2026-11-22T19:02:00Z",
    relativeDate: "4 days ago",
    status: "done",
  },
  {
    id: "run_05",
    title: "Support ticket clustering",
    prompt: "Cluster these 12 support tickets into themes and rank them by churn risk.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    winnerModelId: "gemini-2.5-flash",
    tokensIn: 3755,
    tokensOut: 1717,
    costUsd: 0.00271,
    createdAt: "2026-11-21T08:15:00Z",
    relativeDate: "5 days ago",
    status: "done",
  },
  {
    id: "run_10",
    title: "Brochure: northwind.dev",
    prompt: "Generate a humorous brochure for https://northwind.dev.",
    mode: "Brochure",
    modelIds: ["gemini-2.5-flash"],
    tokensIn: 5120,
    tokensOut: 2210,
    costUsd: 0.0041,
    createdAt: "2026-11-20T15:40:00Z",
    relativeDate: "6 days ago",
    status: "done",
  },
  {
    id: "run_06",
    title: "Booking schema draft",
    prompt: "Generate a Postgres schema for a multi-tenant booking system with waitlists.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat", "llama3.2"],
    winnerModelId: "gpt-4o-mini",
    tokensIn: 1411,
    tokensOut: 2300,
    costUsd: 0.0027,
    createdAt: "2026-11-19T14:33:00Z",
    relativeDate: "1 week ago",
    status: "error",
  },
  {
    id: "run_11",
    title: "Idempotency key strategy",
    prompt: "Compare idempotency key strategies for a payments API that retries webhooks.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat"],
    winnerModelId: "gpt-4o-mini",
    tokensIn: 2104,
    tokensOut: 1300,
    costUsd: 0.00184,
    createdAt: "2026-11-18T10:02:00Z",
    relativeDate: "1 week ago",
    status: "done",
  },
  {
    id: "run_12",
    title: "On-call handbook outline",
    prompt: "Outline an on-call handbook for a small platform team, including escalation paths.",
    mode: "Compare",
    modelIds: ["gpt-4o-mini", "deepseek-chat", "llama3.2"],
    winnerModelId: "deepseek-chat",
    tokensIn: 1620,
    tokensOut: 980,
    costUsd: 0.00061,
    createdAt: "2026-11-17T07:47:00Z",
    relativeDate: "1 week ago",
    status: "done",
  },
];

export type HistoryRunDetail = {
  id: string;
  title: string;
  prompt: string;
  systemPrompt: string;
  mode: HistoryMode;
  createdAt: string;
  winnerModelId: string;
  responses: ModelResponse[];
};

export const historyRunDetail: HistoryRunDetail = {
  id: arenaDemo.id,
  title: "Multi-tenant rate limiter",
  prompt: arenaDemo.prompt,
  systemPrompt: arenaDemo.systemPrompt,
  mode: "Compare",
  createdAt: "2026-11-26T09:42:00Z",
  winnerModelId: arenaDemo.winnerModelId,
  responses: arenaDemo.responses,
};

export type DashboardRange = "7d" | "30d" | "90d";

export type DashboardSparkline = {
  runs: number[];
  tokens: number[];
  cost: number[];
  latency: number[];
};

export const dashboardSparkline: DashboardSparkline = {
  runs: [9, 12, 8, 15, 11, 16, 22],
  tokens: [96, 134, 88, 172, 121, 179, 241],
  cost: [0.42, 0.58, 0.36, 0.74, 0.51, 0.77, 1.03],
  latency: [3120, 3040, 3260, 2980, 2870, 2690, 2610],
};

export type DashboardLatencyPoint = {
  /** Short label for the x axis */
  label: string;
  /** Latency per model, in the order of `models` */
  values: number[];
};

export const dashboardLatencySeries: DashboardLatencyPoint[] = [
  { label: "Nov 13", values: [3180, 2720, 5410, 9120] },
  { label: "Nov 15", values: [3020, 2640, 5280, 8860] },
  { label: "Nov 17", values: [3260, 2790, 5620, 9310] },
  { label: "Nov 19", values: [2980, 2610, 5170, 8740] },
  { label: "Nov 21", values: [3110, 2480, 5060, 8980] },
  { label: "Nov 23", values: [2890, 2520, 4880, 8610] },
  { label: "Nov 25", values: [2740, 2410, 4710, 8420] },
  { label: "Nov 26", values: [2610, 2310, 4620, 8210] },
];

export type DashboardModelTokens = {
  modelId: string;
  tokensIn: number;
  tokensOut: number;
};

export const dashboardModelTokens: DashboardModelTokens[] = [
  { modelId: "gpt-4o-mini", tokensIn: 268_000, tokensOut: 344_000 },
  { modelId: "gemini-2.5-flash", tokensIn: 241_000, tokensOut: 307_000 },
  { modelId: "deepseek-chat", tokensIn: 152_000, tokensOut: 232_000 },
  { modelId: "llama3.2", tokensIn: 121_000, tokensOut: 175_000 },
];

export type DashboardWinRate = {
  modelId: string;
  wins: number;
  runs: number;
  /** 0–100 */
  winRate: number;
};

export const dashboardWinRates: DashboardWinRate[] = [
  { modelId: "gpt-4o-mini", wins: 54, runs: 58, winRate: 74 },
  { modelId: "gemini-2.5-flash", wins: 27, runs: 41, winRate: 61 },
  { modelId: "deepseek-chat", wins: 11, runs: 22, winRate: 48 },
  { modelId: "llama3.2", wins: 4, runs: 17, winRate: 23 },
];

export type DashboardInsight = {
  cheapestModelId: string;
  fastestModelId: string;
  title: string;
  body: string;
};

export const dashboardInsight: DashboardInsight = {
  cheapestModelId: "llama3.2",
  fastestModelId: "gemini-2.5-flash",
  title: "Cheapest vs fastest",
  body: "llama3.2 is free to run locally but takes three times as long to first token. gemini-2.5-flash is the fastest paid model at $0.30 per 1M input tokens, and it wins 6 of 10 runs — the best cost per accepted answer in this workspace.",
};

export type ProviderStatus = "connected" | "not_configured" | "unreachable";

export type ProviderSetting = {
  provider: ModelProvider;
  label: string;
  enabled: boolean;
  baseUrl: string;
  /** Masked for display; Ollama needs no key. */
  apiKeyMasked: string | null;
  modelName: string;
  status: ProviderStatus;
  note?: string;
};

export const providerSettings: ProviderSetting[] = [
  {
    provider: "openai",
    label: "OpenAI",
    enabled: true,
    baseUrl: "https://api.openai.com/v1",
    apiKeyMasked: "sk-••••••••••••4f2a",
    modelName: "gpt-4o-mini",
    status: "connected",
    note: "Key verified 3 minutes ago",
  },
  {
    provider: "gemini",
    label: "Gemini",
    enabled: true,
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKeyMasked: "AIza••••••••••7c1",
    modelName: "gemini-2.5-flash",
    status: "connected",
    note: "1M context window available",
  },
  {
    provider: "deepseek",
    label: "DeepSeek",
    enabled: true,
    baseUrl: "https://api.deepseek.com",
    apiKeyMasked: "sk-••••••••••••9b3e",
    modelName: "deepseek-chat",
    status: "unreachable",
    note: "Last attempt timed out after 10s",
  },
  {
    provider: "ollama",
    label: "Ollama",
    enabled: false,
    baseUrl: "http://localhost:11434",
    apiKeyMasked: null,
    modelName: "llama3.2",
    status: "not_configured",
    note: "No API key needed — runs on this machine",
  },
];

export type SettingsDefaults = {
  systemPrompt: string;
  temperature: number;
  maxTokens: string;
  modelIds: string[];
};

export const settingsDefaults: SettingsDefaults = {
  systemPrompt:
    "You are a staff platform engineer. Answer in short paragraphs, then one small code snippet. Prefer concrete trade-offs over generic advice.",
  temperature: 0.7,
  maxTokens: "1024",
  modelIds: ["gpt-4o-mini", "gemini-2.5-flash", "deepseek-chat"],
};
