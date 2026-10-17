import { expect, test } from 'claude-code/testing'

import { isCortexTool, lineFor, readAnswer } from './register'

test('reads the state and brain from Cortex answers', () => {
  expect(readAnswer("[Cortex] Brain: dagher (Dagher) · you're its admin · on · 48 notes")).toEqual({ light: 'on', brain: 'dagher' })
  expect(readAnswer('[Cortex] Brain: cornerstone · off · 3 notes')).toEqual({ light: 'off', brain: 'cornerstone' })
  expect(readAnswer('Brain dagher is now off')).toEqual({ light: 'off', brain: 'dagher' })
  expect(readAnswer('notes: 3 matches for "online"')).toBeNull()
})

test('the band line has no plugin name in it', () => {
  expect(lineFor({ light: 'on', brain: 'dagher' })).toBe('🟢 Cortex: dagher on')
  expect(lineFor({ light: 'unreachable', brain: 'dagher' })).toBe('🔴 Cortex: unreachable')
  expect(lineFor({ light: 'connecting', brain: '' })).toBe('⚪ Cortex: connecting')
})

test('Cortex tools are recognised under either server name', () => {
  expect(isCortexTool('mcp__cortex__cortex_load')).toBe(true)
  expect(isCortexTool('mcp__claude_ai_Cortex__cortex_load')).toBe(true)
  expect(isCortexTool('mcp__claude_ai_Gmail__search_threads')).toBe(false)
})

const BAND = { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80 }

for (const [surface, tool] of [['terminal', 'mcp__cortex__cortex_load'], ['vscode', 'mcp__claude_ai_Cortex__cortex_load']] as const) {
  test(`${surface}: a successful Cortex call lights the band; a refused one leaves it`, async ($, on) => {
    let answer: { result?: string; deny?: string } = { result: '[Cortex] Brain: dagher · on · 48 notes' }
    on('tool.call', () => answer as never)
    const band = await $.ui.mount({ plugin: 'cortex', surface, component: 'AbovePrompt', props: BAND as never })
    expect((await band.find({ type: 'Text' }))?.text).toBe('⚪ Cortex: connecting')

    await $.tool.call({ tool, brain: 'dagher' } as never)
    expect((await band.find({ type: 'Text' }))?.text).toBe('🟢 Cortex: dagher on')

    answer = { deny: 'refused at the permission prompt' }
    await $.tool.call({ tool: 'mcp__cortex__cortex_power', brain: 'dagher' } as never)
    expect((await band.find({ type: 'Text' }))?.text).toBe('🟢 Cortex: dagher on')
  })
}
