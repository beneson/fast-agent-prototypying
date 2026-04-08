import { useState, useRef, useCallback } from 'react'
import type { Agent, Message } from '../types/agent'
import { getOpenAIClient } from '../lib/openai'

export function useChat(
  agent: Agent | null,
  addMessage: (agentId: string, message: Message) => void,
  updateLastMessage: (agentId: string, content: string) => void
) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!agent || !content.trim() || isStreaming) return

      setError(null)

      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      }
      addMessage(agent.id, userMessage)

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }
      addMessage(agent.id, assistantMessage)

      setIsStreaming(true)
      abortRef.current = new AbortController()

      try {
        const openai = getOpenAIClient()
        const messages = [
          { role: 'system' as const, content: agent.systemPrompt },
          ...agent.messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content: content.trim() },
        ]

        const stream = await openai.chat.completions.create(
          {
            model: 'gpt-4o',
            messages,
            stream: true,
          },
          { signal: abortRef.current.signal }
        )

        let accumulated = ''
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || ''
          accumulated += delta
          updateLastMessage(agent.id, accumulated)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // user cancelled
        } else {
          const message =
            err instanceof Error ? err.message : 'Erro ao comunicar com a OpenAI'
          setError(message)
          updateLastMessage(agent.id, `⚠️ Erro: ${message}`)
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [agent, isStreaming, addMessage, updateLastMessage]
  )

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { sendMessage, isStreaming, error, stopStreaming }
}
