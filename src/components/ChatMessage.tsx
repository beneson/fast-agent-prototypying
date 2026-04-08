import { Bot, User } from 'lucide-react'
import type { Message } from '../types/agent'

interface Props {
  message: Message
  agentColor: string
}

export function ChatMessage({ message, agentColor }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-indigo-100' : agentColor
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-indigo-600" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content || '...'}</div>
      </div>
    </div>
  )
}
