import { useState } from 'react'
import { useAgents } from './hooks/useAgents'
import { hasApiKey } from './lib/openai'
import { Layout } from './components/Layout'
import { EmptyState } from './components/EmptyState'
import { ChatView } from './components/ChatView'
import { NewAgentForm } from './components/NewAgentForm'
import { ApiKeyModal } from './components/ApiKeyModal'

function App() {
  const {
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
  } = useAgents()

  const [showApiKey, setShowApiKey] = useState(!hasApiKey())

  return (
    <>
      <Layout
        agents={agents}
        viewState={viewState}
        isLoading={isLoading}
        onSelectAgent={(id) => setViewState({ view: 'chat', agentId: id })}
        onNewAgent={() => setViewState({ view: 'new-agent' })}
        onDeleteAgent={deleteAgent}
      >
        {viewState.view === 'empty' && <EmptyState />}

        {viewState.view === 'chat' && selectedAgent && (
          <ChatView
            key={selectedAgent.id}
            agent={selectedAgent}
            addMessage={addMessage}
            updateLastMessage={updateLastMessage}
            updateAgent={updateAgent}
            clearMessages={clearMessages}
          />
        )}

        {viewState.view === 'new-agent' && (
          <NewAgentForm
            onCreate={createAgent}
            onCancel={() => setViewState({ view: 'empty' })}
          />
        )}
      </Layout>

      {showApiKey && <ApiKeyModal onSave={() => setShowApiKey(false)} />}
    </>
  )
}

export default App
