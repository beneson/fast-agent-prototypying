import type { Agent } from '../types/agent'

export function generateAgentDefinition(agent: Agent): string {
  const escapedPrompt = agent.systemPrompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')

  return `// Auto-generated agent definition
// Agent: ${agent.name}
// Published: ${new Date().toISOString()}

export const agentConfig = {
  id: "${agent.id}",
  name: "${agent.name}",
  slug: "${agent.slug}",
  systemPrompt: \`${escapedPrompt}\`,
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4096,
} as const

export type AgentConfig = typeof agentConfig
`
}

export function downloadAgentFile(agent: Agent): void {
  const content = generateAgentDefinition(agent)
  const blob = new Blob([content], { type: 'text/typescript' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${agent.slug}.ts`
  a.click()
  URL.revokeObjectURL(url)
}
