import { Settings2, Upload, Trash2, Download, Loader2, MessageSquareX } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Agent } from '../types/agent'
import { useChat } from '../hooks/useChat'
import { downloadAgentFile } from '../lib/publish'
import { publishAgent, unpublishAgent } from '../lib/supabase'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { PromptEditor } from './PromptEditor'
import { ConfirmModal } from './ConfirmModal'

interface Props {
  agent: Agent
  addMessage: (agentId: string, message: import('../types/agent').Message) => void
  updateLastMessage: (agentId: string, content: string) => void
  updateAgent: (id: string, partial: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  clearMessages: (agentId: string) => void
}

export function ChatView({ agent, addMessage, updateLastMessage, updateAgent, deleteAgent, clearMessages }: Props) {
  const [promptEditorOpen, setPromptEditorOpen] = useState(false)
  const [publishFeedback, setPublishFeedback] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle')
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { sendMessage, isStreaming, error, stopStreaming } = useChat(agent, addMessage, updateLastMessage)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [agent.messages])

  const handlePublish = async () => {
    setShowPublishConfirm(false)
    setPublishFeedback('publishing')
    const result = await publishAgent(agent)
    if (result.success) {
      updateAgent(agent.id, { isPublished: true })
      setPublishFeedback('success')
    } else {
      setPublishFeedback('error')
    }
    setTimeout(() => setPublishFeedback('idle'), 2500)
  }

  const handleDelete = async () => {
    setShowDeleteConfirm(false)
    if (agent.isPublished) {
      await unpublishAgent(agent.id)
    }
    deleteAgent(agent.id)
  }

  const handleDownload = () => {
    downloadAgentFile(agent)
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${agent.color}`} />
          <h2 className="text-base font-semibold text-gray-900">{agent.name}</h2>
        </div>
        <div className="flex items-center gap-1">
          {!agent.isDefault && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Deletar agente"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => clearMessages(agent.id)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Limpar conversa"
          >
            <MessageSquareX className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPromptEditorOpen(true)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Editar prompt"
          >
            <Settings2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Baixar arquivo .ts"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowPublishConfirm(true)}
            disabled={publishFeedback === 'publishing'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              publishFeedback === 'success'
                ? 'bg-green-100 text-green-700'
                : publishFeedback === 'error'
                  ? 'bg-red-100 text-red-700'
                  : publishFeedback === 'publishing'
                    ? 'bg-indigo-50 text-indigo-400'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {publishFeedback === 'publishing' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {publishFeedback === 'success'
              ? 'Publicado!'
              : publishFeedback === 'error'
                ? 'Erro!'
                : publishFeedback === 'publishing'
                  ? 'Publicando...'
                  : 'Publicar'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {agent.messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Envie uma mensagem para começar a conversa com o agente.
          </div>
        )}
        {agent.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} agentColor={agent.color} />
        ))}
        {error && !isStreaming && (
          <div className="text-center text-xs text-red-500 py-2">{error}</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} isStreaming={isStreaming} onStop={stopStreaming} />

      {/* Prompt Editor */}
      <PromptEditor
        agent={agent}
        isOpen={promptEditorOpen}
        onClose={() => setPromptEditorOpen(false)}
        onSave={(prompt) => updateAgent(agent.id, { systemPrompt: prompt })}
      />

      {/* Publish Confirmation */}
      <ConfirmModal
        isOpen={showPublishConfirm}
        title="Publicar agente"
        message={`Ao publicar "${agent.name}", a configuração será salva no banco de dados e ficará disponível para todos os usuários da ferramenta.`}
        confirmLabel="Publicar"
        confirmVariant="primary"
        onConfirm={handlePublish}
        onCancel={() => setShowPublishConfirm(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Deletar agente"
        message={
          agent.isPublished
            ? `"${agent.name}" será removido do banco de dados e não estará mais disponível para nenhum usuário. Esta ação não pode ser desfeita.`
            : `"${agent.name}" será removido da sua lista local.`
        }
        confirmLabel="Deletar"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}
