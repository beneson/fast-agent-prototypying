import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { Agent, Message, ViewState } from '../types/agent'
import { fetchPublishedAgents } from '../lib/supabase'

function generateId(): string {
  return `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [viewState, setViewState] = useState<ViewState>({ view: 'empty' })
  const [isLoading, setIsLoading] = useState(true)
  const hasSynced = useRef(false)

  // Load agents from Supabase as the single source of truth
  useEffect(() => {
    if (hasSynced.current) return
    hasSynced.current = true

    fetchPublishedAgents()
      .then((publishedAgents) => {
        setAgents(publishedAgents)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const selectedAgent = useMemo(() => {
    if (viewState.view !== 'chat') return null
    return agents.find((a) => a.id === viewState.agentId) ?? null
  }, [agents, viewState])

  const createAgent = useCallback(
    (name: string, systemPrompt: string, icon: string, color: string) => {
      const agent: Agent = {
        id: generateId(),
        name,
        slug: toSlug(name),
        icon,
        color,
        systemPrompt,
        messages: [],
        isPublished: false,
        isDefault: false,
        createdAt: Date.now(),
      }
      setAgents((prev) => [...prev, agent])
      setViewState({ view: 'chat', agentId: agent.id })
      return agent
    },
    [setAgents]
  )

  const updateAgent = useCallback(
    (id: string, partial: Partial<Agent>) => {
      setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...partial } : a)))
    },
    [setAgents]
  )

  const deleteAgent = useCallback(
    (id: string) => {
      setAgents((prev) => prev.filter((a) => a.id !== id || a.isDefault))
      if (viewState.view === 'chat' && viewState.agentId === id) {
        setViewState({ view: 'empty' })
      }
    },
    [setAgents, viewState]
  )

  const addMessage = useCallback(
    (agentId: string, message: Message) => {
      setAgents((prev) =>
        prev.map((a) => (a.id === agentId ? { ...a, messages: [...a.messages, message] } : a))
      )
    },
    [setAgents]
  )

  const updateLastMessage = useCallback(
    (agentId: string, content: string) => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.id !== agentId || a.messages.length === 0) return a
          const messages = [...a.messages]
          messages[messages.length - 1] = { ...messages[messages.length - 1], content }
          return { ...a, messages }
        })
      )
    },
    [setAgents]
  )

  const clearMessages = useCallback(
    (agentId: string) => {
      setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, messages: [] } : a)))
    },
    [setAgents]
  )

  return {
    agents,
    selectedAgent,
    viewState,
    setViewState,
    isLoading,
    createAgent,
    updateAgent,
    deleteAgent,
    addMessage,
    updateLastMessage,
    clearMessages,
  }
}
