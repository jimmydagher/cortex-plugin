---
name: share
description: >
  Propose something for Cortex's shared memory (NEOCORTEX), the rules
  everyone's Claude follows. Use when the user says "share …", "share this
  with everyone", "share: …", or runs "/cortex:share". An admin decides on it.
  For something just for the user, use cortex:me.
argument-hint: <what to share with everyone>
---

Share this with everyone in Cortex: $ARGUMENTS

If nothing was given after the command, ask in one line what to share, then go on.

1. This is for the **shared memory** (`NEOCORTEX/`), which every user's Claude follows. If the brain isn't loaded in this conversation yet, call the Cortex `cortex_load` tool first.
2. Pick the area it belongs in from the NEOCORTEX index (the router `cortex_load` returned) and the section inside it. Check it isn't already there (and wasn't rejected before) with `synapse_list(include_trail=true)` or `cortex_search`.
3. Queue it with the Cortex `synapse_queue` tool: `to='share'`, `target='NEOCORTEX/<AREA> › <Section>'`, a one-line `change` and `why`, `source` = correction, preference or research.
4. Tell me its ID in one line: `Queued HX0007 → NEOCORTEX/WRITING`. An admin decides on it in a "review synapse".
5. If I'm an admin and want it in now: show me the exact edit and how it fits with the existing rules, and on my yes commit it with `synapse_commit`.

Never put secrets, passwords, keys or personal details in shared memory.
