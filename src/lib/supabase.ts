import { createClient } from '@supabase/supabase-js'
import type { Agent } from '../types/agent'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface AgentRow {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  system_prompt: string
  model: string
  temperature: number
  max_tokens: number
  is_default: boolean
  published_at: string
  updated_at: string
}

function agentToRow(agent: Agent): Omit<AgentRow, 'published_at' | 'updated_at'> {
  return {
    id: agent.id,
    name: agent.name,
    slug: agent.slug,
    icon: agent.icon,
    color: agent.color,
    system_prompt: agent.systemPrompt,
    model: 'gpt-4o',
    temperature: 0.7,
    max_tokens: 4096,
    is_default: agent.isDefault,
  }
}

export function rowToAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    color: row.color,
    systemPrompt: row.system_prompt,
    messages: [],
    isPublished: true,
    isDefault: row.is_default,
    createdAt: new Date(row.published_at).getTime(),
  }
}

export async function fetchPublishedAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('published_at', { ascending: true })

  if (error) {
    console.error('Error fetching agents:', error.message)
    return []
  }

  return (data as AgentRow[]).map(rowToAgent)
}

export async function publishAgent(agent: Agent): Promise<{ success: boolean; error?: string }> {
  const row = agentToRow(agent)

  const { error } = await supabase
    .from('agents')
    .upsert(
      { ...row, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )

  if (error) {
    console.error('Error publishing agent:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function unpublishAgent(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error unpublishing agent:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}
