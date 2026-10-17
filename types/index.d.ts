// What the Cortex light shows: the brain's state, and its name once Cortex has said it.
export type Light = 'connecting' | 'on' | 'off' | 'unreachable'
export type BrainLight = { light: Light; brain: string }

declare module 'claude-code' {
  interface PluginState {
    cortex: { light: BrainLight }
  }
}
