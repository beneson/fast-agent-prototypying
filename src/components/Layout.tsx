import { Menu } from 'lucide-react'
import { useState } from 'react'
import type { Agent, ViewState } from '../types/agent'
import { Drawer } from './Drawer'

interface Props {
  agents: Agent[]
  viewState: ViewState
  onSelectAgent: (agentId: string) => void
  onNewAgent: () => void
  onDeleteAgent: (id: string) => void
  children: React.ReactNode
}

export function Layout({ agents, viewState, onSelectAgent, onNewAgent, onDeleteAgent, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Drawer
        agents={agents}
        viewState={viewState}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectAgent={onSelectAgent}
        onNewAgent={onNewAgent}
        onDeleteAgent={onDeleteAgent}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center px-4 py-3 border-b border-gray-200 bg-white">
          <button onClick={() => setDrawerOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <span className="ml-3 text-sm font-semibold text-gray-900">VTEX Agent Lab</span>
        </div>

        {children}
      </div>
    </div>
  )
}
