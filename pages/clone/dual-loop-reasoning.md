# Dual-Loop Reasoning: how we work with AI agents

Most teams judge AI work by its latest result. At LMWBOT, we care more about what the work taught us. A result tells you where you stand today. Good reasoning tells you, and the next agent, what to do tomorrow.

This approach works for software, content, websites and research, and it needs no special tools.

## The two loops

We run two loops at the same time.

**The engineering loop fixes things.** Change the code or the content, run the checks, and see whether the problem is gone.

**The evolution loop improves the process.** Collect the reasoning from each round of work, look for patterns, and use them to change how the next round runs.

The engineering loop alone eventually stalls. You keep making fixes, but nothing you learn carries forward, so the same kinds of problems return.

There is also a simple warning sign. If a round of work produces no new reasoning, you are stuck. Stop and review the approach instead of trying again.

## Reasoning comes first

Reasoning is the main asset of our work. Metrics matter, but they only become a fair judgment once the process underneath them is stable. Three habits follow from this.

- **Record the full picture.** A conclusion with no evidence behind it is hard to trust or reuse.
- **Keep failed reasoning too.** A failed attempt tells the next person what not to repeat and why.
- **Report learning before numbers.** Every report starts with what we learned in that round. Any numbers come after that.

## Hand off before you switch

Changing a process, tool or template is often when knowledge gets lost. So we write a handoff before any switch. It covers:

- the types of errors we saw
- their root causes, as far as we know them
- what we tried that failed
- what the old approach did well and what it did badly

The first step in the new approach is to read that handoff.

## Let scripts do the repetitive work

An AI agent's attention is best spent on judgment. Anything repetitive belongs in a plain script that needs no AI at all: running regression checks, comparing new results with old ones, producing side-by-side views of the evidence, sorting errors by type, and gathering data into one place.

The scripts prepare the evidence, the agent reasons about it, and the conclusions go back into the project's knowledge record for the next round.

## Fix shared problems first

We ask how far each problem reaches.

- **Shared problems come first.** A problem that affects many pages, items or cases is worth fixing now, and it usually teaches you something general.
- **One-off cases get parked.** We note them as "later" and move on.

Polishing a single case until it looks perfect rarely helps anything else. Build a stable core and process first. Fine-tuning can wait until the overall picture is good enough to justify it.

## The KNOWLEDGE.md record

Every project keeps one plain-text file called `KNOWLEDGE.md`, so that people and agents can both read it. Each piece of reasoning gets one entry with the same five fields:

| Field | What it holds |
|---|---|
| **Subject** | The item, page or case being examined |
| **Evidence** | What was observed, with a pointer to the comparison, data or example |
| **Hypothesis** | What we think is going on |
| **Reasoning chain** | The steps from the evidence to the hypothesis, and the fix or test that follows |
| **Verification result** | What happened when we tested it, including whether it failed and why |

Here is what a failed attempt might look like:

```markdown
### Subject
Article pages: summary box overlaps the first image on narrow screens

**Evidence:** Side-by-side views of the old and new layouts.

**Hypothesis:** The box has a fixed height that ignores its content.

**Reasoning chain:** The overlap appears only with long summaries, so length
is the likely trigger. A flexible height should fix it.

**Verification result:** Failed. The overlap went away, but the navigation
moved on other templates. Reverted. Next idea: limit the fix to this template.
```

The fix failed, but the entry is still useful. Whoever picks this up next knows what was tried, what it broke and where to look.

## Lessons we learned the hard way

These came from real mistakes, generalized so they apply to most projects.

| What went wrong | What we do now |
|---|---|
| We switched approaches without writing down what we had learned, and lost a long stretch of time | Write a handoff before every switch, read it first, and stop to review when rounds stop producing new reasoning |
| Several fixes each broke something else. We reverted them all and had no record | Log every failed attempt: what we tried, why it failed and what it affected |
| The reference answers were wrong, so we spent a long time blaming correct code | Audit reference data with a script. Set suspicious items aside instead of deleting them, and correct them only after checking the original source |
| Automated checks said only pass or fail, and the full run took a long time | Generate side-by-side comparisons automatically, run quick checks before the full suite, and rerun only what a change affects |
| Examples we had already tuned for could catch regressions, but could not show real progress | Set aside some examples for verification only, and report the gaps by error type each round |
| Bad reference data distorted our metrics, so we chased the wrong target | Measure only against items whose reference data is known to be sound |

## The test

At the end of each round, ask what you know now that you didn't know before. If you have a clear answer, both loops are turning.
