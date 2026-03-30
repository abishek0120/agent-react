Agent Thoughts: Transparency vs. Noise
Decision: I decided to show thoughts, but keep them collapsed by default inside each task.

Why: Analysts mostly care about results. But if everything feels like a black box, trust drops. So this way, thoughts are there when needed, but not in your face all the time.

Reconsider if: Users start ignoring results because they don’t understand the “why” behind it.

Parallel Execution: Visual Grouping
Decision: Tasks with a parallel_group ID go into a separate “Parallel Action” card, shown horizontally.

Why: If I stack them vertically, it looks like steps happening one after another, which is misleading. Horizontal layout makes it clear things are happening at the same time.

Reconsider if: There are too many parallel tasks (like more than 3–4), because that will break the layout, especially on smaller screens.

Partial Outputs: The “Live” Feed
Decision: I stream is_final: false content directly into the task body, and replace it when final output comes.

Why: It gives that live/typing feel like LLMs. Makes things feel faster and gives small bits of useful info early instead of waiting.

Reconsider if: Intermediate outputs are messy or unreliable, which might make users trust the system less.

Handling “Cancelled” States
Decision: For sufficient_data cancellations, I used a muted blue theme with an info icon, not a warning.

Why: “Cancelled” sounds like failure, especially in finance. But here it’s actually a smart stop — system already got enough data. So it should feel like optimization, not error.

Reconsider if: Users keep asking why something “failed” even though it didn’t.

Dependencies & Lifecycle
Decision: Tasks with depends_on show as “Locked/Waiting”.

Why: Otherwise it’s confusing why some tasks haven’t started. This makes it clear they’re waiting on something else (like peer data).

Reconsider if: Dependencies become too complex. Then maybe a small flowchart or DAG view is needed.

Error Recovery (Fail & Retry)
Decision: If a task fails but retry is pending, I show amber instead of red, with a countdown.

Why: Red feels like dead end. Amber feels like “it’s fixing itself”, which builds trust.

Reconsider if: Retries happen too often (like API limits), making the UI look noisy or distracting.