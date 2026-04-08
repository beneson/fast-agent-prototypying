export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface Agent {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  systemPrompt: string
  messages: Message[]
  isPublished: boolean
  isDefault: boolean
  createdAt: number
}

export type ViewState =
  | { view: 'empty' }
  | { view: 'chat'; agentId: string }
  | { view: 'new-agent' }
