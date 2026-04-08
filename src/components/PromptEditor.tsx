import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Agent } from '../types/agent'

interface Props {
  agent: Agent
  isOpen: boolean
  onClose: () => void
  onSave: (prompt: string) => void
}

export function PromptEditor({ agent, isOpen, onClose, onSave }: Props) {
  const [prompt, setPrompt] = useState(agent.systemPrompt)

  useEffect(() => {
    setPrompt(agent.systemPrompt)
  }, [agent.systemPrompt, agent.id])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-xl flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">System Prompt</h2>
            <p className="text-xs text-gray-500 mt-0.5">{agent.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-full min-h-[300px] resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Digite o system prompt do agente..."
          />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
          <span className="text-xs text-gray-400">{prompt.length} caracteres</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave(prompt)
                onClose()
              }}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
