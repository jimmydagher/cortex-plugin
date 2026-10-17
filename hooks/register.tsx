import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { BrainLight, Light } from '../types'

// The Cortex MCP server as /mcp lists it: added with `claude mcp add` ("cortex") or the claude.ai connector.
const SERVERS = ['cortex', 'claude.ai Cortex']
const TOOL_PREFIXES = SERVERS.map(name => `mcp__${name.replace(/\W/g, '_')}__`)
// How often the light looks again: soon while Cortex is still connecting, rarely once it has answered.
const TICK_MS = 10_000
const RECHECK_MS = 15 * 60 * 1000
// Errors this soon after the session starts mean "still connecting", not "unreachable".
const CONNECT_GRACE_MS = 60_000

// cortex_load's first line: "[Cortex] Brain: dagher (Dagher) · … · on · 48 notes …";
// cortex_power answers like "Brain dagher is now off".
const DOT_RE = /·\s*(on|off)\s*·/i
const PHRASE_RE = /\bbrain\b[^.\n]{0,40}?\b(?:is|turned)\s+(?:now\s+)?(on|off)\b/i
const BRAIN_RE = /\bBrain:?\s+([\w-]+)/

const DOTS: Record<Light, string> = { connecting: '⚪', on: '🟢', off: '🔴', unreachable: '🔴' }

const state = atom({ plugin: 'cortex', key: 'light' } as const, { light: 'connecting', brain: '' } as BrainLight)

/** Flattens a tool or MCP result to text, whatever its shape. */
const textOf = (value: unknown): string => (typeof value === 'string' ? value : JSON.stringify(value ?? ''))

/** What a Cortex answer says about the brain: its state and name, or null when it says neither. */
export const readAnswer = (text: string): BrainLight | null => {
  const found = (DOT_RE.exec(text) ?? PHRASE_RE.exec(text))?.[1]?.toLowerCase()
  if (found !== 'on' && found !== 'off') return null
  return { light: found, brain: BRAIN_RE.exec(text)?.[1] ?? '' }
}

/** Whether a tool name is one of Cortex's, whichever way the server is connected. */
export const isCortexTool = (tool: string): boolean => TOOL_PREFIXES.some(prefix => tool.startsWith(prefix))

/** The band's one line, e.g. "🟢 Cortex: dagher on". */
export const lineFor = ({ light, brain }: BrainLight): string =>
  `${DOTS[light]} Cortex: ${light === 'on' || light === 'off' ? `${brain ? `${brain} ` : ''}${light}` : light}`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    const startedAt = await $.clock.now()
    let answeredAt = 0
    let server = SERVERS[0] // the name that answered last; tried first
    const check = async () => {
      const now = await $.clock.now()
      if (answeredAt && now - answeredAt < RECHECK_MS) return
      let answer: BrainLight | null = null
      let reachable = false
      for (const name of [server, ...SERVERS.filter(other => other !== server)]) {
        try {
          const result = await $.mcp.call(name, 'cortex_load', {})
          if (result.isError) continue
          reachable = true
          server = name
          answer = readAnswer(textOf(result.content))
          break
        } catch {
          // not connected under this name: try the next
        }
      }
      if (reachable) {
        answeredAt = now  // an answer in an unexpected shape still waits the long interval
        if (answer) await update($, state, () => answer)
      } else if (now - startedAt >= CONNECT_GRACE_MS) {
        await update($, state, current => ({ ...current, light: 'unreachable' }))
      }
    }
    await check()
    $.clock.every(TICK_MS, check)
    return started
  })

  // A Cortex call the model makes, and that succeeds, refreshes the light from its answer.
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (isCortexTool(e.tool) && ran.deny === undefined && !ran.isError) {
      const answer = readAnswer(textOf(ran.result ?? ran.text))
      if (answer) await update($, state, current => ({ light: answer.light, brain: answer.brain || current.brain }))
    }
    return ran
  }).catch(($, e, next) => next(e)) // the light failing never blocks a tool call

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const current = await read($, state)
    const { Text } = $.ui.resolve(e)
    return <Text>{lineFor(current)}</Text>
  })
}
