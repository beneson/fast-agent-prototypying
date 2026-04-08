import { Key } from 'lucide-react'
import { useState } from 'react'
import { setApiKey } from '../lib/openai'

interface Props {
  onSave: () => void
}

export function ApiKeyModal({ onSave }: Props) {
  const [key, setKey] = useState('')

  const handleSave = () => {
    if (!key.trim()) return
    setApiKey(key.trim())
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Key className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">OpenAI API Key</h2>
            <p className="text-xs text-gray-500">Necessária para conversar com os agentes</p>
          </div>
        </div>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />

        <p className="text-xs text-gray-400 mb-4">
          A chave é armazenada apenas no localStorage do seu navegador e enviada diretamente para a
          OpenAI. Nunca é enviada para nenhum outro servidor.
        </p>

        <button
          onClick={handleSave}
          disabled={!key.trim()}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-40"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
