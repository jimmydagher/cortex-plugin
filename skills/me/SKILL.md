---
name: me
description: >
  Save something to the user's own Cortex personal layer. Use when they say
  "remember …", "remember that …", "me: …", or run "/cortex:me". It's personal:
  only they see it, and they approve it themselves. Not for things meant for
  everyone; that's cortex:share.
argument-hint: <what to remember>
---

Remember this for me in Cortex: $ARGUMENTS

If nothing was given after the command, ask in one line what to remember, then go on.

1. This goes in **my personal layer** (`PREFRONTAL/`), which only I see. If the brain isn't loaded in this conversation yet, call the Cortex `cortex_load` tool first.
2. Pick where it belongs: the `PREFRONTAL` file and section, using the brain's scope ladder in `PREFRONTAL/PREFRONTAL.md`. Check it isn't already there (and wasn't rejected before) with `synapse_list(include_trail=true)` or `cortex_search`.
3. Queue it with the Cortex `synapse_queue` tool: `to='me'`, `target='PREFRONTAL/<FILE> › <Section>'`, a one-line `change` and `why`, `source` = correction, preference or research.
4. Show me the exact edit and how it fits with what's already there: merge with or replace the existing line, so memory never carries competing rules. Wait for my yes.
5. On yes, commit it with `synapse_commit` and say in one line where it landed. On no, reject it with `synapse_reject` and my reason.

Never put secrets, passwords or keys in memory.
