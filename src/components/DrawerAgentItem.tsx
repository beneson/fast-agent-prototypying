import { Trash2 } from 'lucide-react'
import type { Agent } from '../types/agent'

interface Props {
  agent: Agent
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

export function DrawerAgentItem({ agent, isActive, onClick, onDelete }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group ${
        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className={`w-3 h-3 rounded-full shrink-0 ${agent.color}`} />
      <span className="flex-1 truncate text-sm font-medium">{agent.name}</span>
      {agent.isPublished && (
        <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
          Published
        </span>
      )}
      {!agent.isDefault && (
        <span
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </span>
      )}
    </button>
  )
}
