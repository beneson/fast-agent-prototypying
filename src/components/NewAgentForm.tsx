import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const COLORS = [
  'bg-indigo-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-purple-500',
]

const ICONS = [
  'ShoppingBag',
  'Package',
  'Store',
  'Truck',
  'Globe',
  'Zap',
  'Rocket',
  'Code',
  'MessageSquare',
  'Bot',
  'Sparkles',
  'Layers',
]

interface Props {
  onCreate: (name: string, systemPrompt: string, icon: string, color: string) => void
  onCancel: () => void
}

export function NewAgentForm({ onCreate, onCancel }: Props) {
  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [icon, setIcon] = useState(ICONS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !systemPrompt.trim()) return
    onCreate(name.trim(), systemPrompt.trim(), icon, color)
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white">
        <button onClick={onCancel} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-4 w-4 text-gray-500" />
        </button>
        <h2 className="text-base font-semibold text-gray-900">Novo Agente</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome do Agente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Amazon, Magalu, Dafiti..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full ${c} transition-all ${
                  color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  icon === i
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">System Prompt</label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Descreva o papel e expertise do agente. Ex: Você é um agente de IA especializado em criar integrações entre VTEX e..."
            rows={10}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{systemPrompt.length} caracteres</p>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !systemPrompt.trim()}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Criar Agente
        </button>
      </form>
    </div>
  )
}
