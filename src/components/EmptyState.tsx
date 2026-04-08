import { Bot } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Selecione um agente</h2>
        <p className="text-gray-400">Escolha um agente na barra lateral ou crie um novo.</p>
      </div>
    </div>
  )
}
