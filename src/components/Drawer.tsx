import { Plus, X, Bot, Loader2 } from 'lucide-react'
import type { Agent, ViewState } from '../types/agent'
import { DrawerAgentItem } from './DrawerAgentItem'

interface Props {
  agents: Agent[]
  viewState: ViewState
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onSelectAgent: (agentId: string) => void
  onNewAgent: () => void
  onDeleteAgent: (id: string) => void
}

export function Drawer({
  agents,
  viewState,
  isOpen,
  isLoading,
  onClose,
  onSelectAgent,
  onNewAgent,
  onDeleteAgent,
}: Props) {
  const activeAgentId = viewState.view === 'chat' ? viewState.agentId : null

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-600" />
            <h1 className="text-base font-bold text-gray-900">VTEX Agent Lab</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              Nenhum agente publicado.
            </div>
          ) : (
            agents.map((agent) => (
              <DrawerAgentItem
                key={agent.id}
                agent={agent}
                isActive={activeAgentId === agent.id}
                onClick={() => {
                  onSelectAgent(agent.id)
                  onClose()
                }}
                onDelete={() => onDeleteAgent(agent.id)}
              />
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => {
              onNewAgent()
              onClose()
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Novo Agente
          </button>
        </div>
      </aside>
    </>
  )
}
