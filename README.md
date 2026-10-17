# Cortex plugin

Short commands for [Cortex](https://dev.azure.com/ahhalife/personal/_git/cortex), the MCP server that serves a shared Markdown second brain to Claude.

## The light

A line above the prompt box shows whether your brain is on, in the terminal, the VS Code extension and the desktop app:

| Line | Means |
|---|---|
| `🟢 Cortex: <brain> on` | Cortex answered and the brain is on |
| `🔴 Cortex: <brain> off` | Cortex answered and the brain is off (`cortex_power`) |
| `🔴 Cortex: unreachable` | no answer for a minute after the session started |
| `⚪ Cortex: connecting` | waiting for the Cortex MCP server |

It finds Cortex under either name it can have: `cortex` (added with `claude mcp add`) or `claude.ai Cortex` (the claude.ai connector). It asks Cortex at session start (every 10 s until it answers), then every 15 minutes, and after each Cortex tool call that succeeds. The answer goes to the plugin only, not into the conversation.

| Command | Says | Where it goes | Who decides |
|---|---|---|---|
| `/cortex:me <text>` | "remember …" | your own personal layer (`PREFRONTAL/`), which only you see | you: Claude previews the edit, your yes commits it |
| `/cortex:share <text>` | "share …" | the shared memory (`NEOCORTEX/`), which everyone's Claude follows | an admin, in a "review synapse" |

The words work without the plugin too: Cortex's server instructions tell Claude that "remember …" is personal and "share …" is for everyone, and the Cortex MCP server offers the same two as prompts (`/mcp__cortex__me`, `/mcp__cortex__share`). The plugin adds the short `/cortex:` form in Claude Code.

## Needs

The Cortex MCP server connected to Claude Code: through the claude.ai connector (it follows your account), or `claude mcp add --transport http --scope user cortex https://<your Cortex>/mcp`, then `/mcp` › cortex › Authenticate.

## Install

From the marketplace, once it's registered there:

```text
/plugin marketplace add jimmydagher/jtag-claude-marketplace
/plugin install cortex@jtag-claude-marketplace
```

Or straight from this folder, which is its own marketplace (any shell):

```bash
claude plugin install cortex --marketplace /path/to/claude-mods/cortex-plugin
```

To try it from this folder without installing:

```bash
# dev machine shell
claude --plugin-dir /path/to/claude-mods/cortex-plugin
```
