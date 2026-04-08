# VTEX Agent Lab

Ferramenta de prototipagem rapida de agentes de IA para integracao de canais VTEX. Permite criar, testar e publicar agentes especializados em marketplaces como Mercado Livre, iFood e Shopee.

## Requisitos

- **Node.js** 18 ou superior
- **npm** 9 ou superior
- **Chave de API da OpenAI** (obtenha em https://platform.openai.com/api-keys)

## Como rodar

### 1. Clone o repositorio

```bash
git clone https://github.com/beneson/fast-agent-prototypying.git
cd fast-agent-prototypying
```

### 2. Instale as dependencias

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O app abre em `http://localhost:5173` (ou a proxima porta disponivel).

### 4. Configure sua API Key

Na primeira vez que abrir o app, um modal vai pedir sua chave da OpenAI. Cole a chave (formato `sk-...`) e clique **Salvar**.

A chave fica armazenada apenas no `localStorage` do seu navegador. Nunca e enviada para nenhum servidor alem da propria OpenAI.

## Como usar

### Conversar com um agente

1. Clique em um agente na barra lateral (Mercado Livre, iFood ou Shopee)
2. Digite sua mensagem no campo de texto e pressione **Enter** ou clique no botao de enviar
3. O agente responde em tempo real via streaming

### Editar o prompt de um agente

1. Com um agente selecionado, clique no icone de **engrenagem** no canto superior direito
2. Um painel lateral abre com o system prompt atual
3. Edite o texto, clique **Salvar**
4. As proximas mensagens usarao o novo prompt

### Criar um novo agente

1. Clique em **+ Novo Agente** na parte inferior da barra lateral
2. Preencha: nome, cor, icone e system prompt
3. Clique **Criar Agente**
4. O agente aparece na barra lateral e voce ja pode conversar com ele

### Limpar conversa

Clique no icone de **lixeira** no canto superior direito do chat para apagar todas as mensagens daquele agente.

## Como publicar um agente

Publicar um agente significa exportar sua configuracao (nome, slug, prompt) como um arquivo TypeScript reutilizavel.

### Pelo browser

1. Selecione o agente desejado na barra lateral
2. Ajuste o prompt ate ficar satisfeito com as respostas
3. Clique no botao **Publicar** no canto superior direito
4. Um arquivo `.ts` e baixado automaticamente (ex: `mercado-livre.ts`)
5. Mova o arquivo para `src/agents/` no projeto

O arquivo gerado tem este formato:

```typescript
// Auto-generated agent definition
// Agent: Mercado Livre
// Published: 2026-04-08T12:00:00.000Z

export const agentConfig = {
  id: "agent-mercado-livre",
  name: "Mercado Livre",
  slug: "mercado-livre",
  systemPrompt: `Voce e um agente de IA especializado em...`,
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4096,
} as const

export type AgentConfig = typeof agentConfig
```

Para **atualizar** um agente ja publicado, basta editar o prompt e clicar em **Publicar** novamente. O novo arquivo substitui o anterior.

## Como usar via Claude Code

Se voce esta usando o **Claude Code** (CLI ou desktop) para prototipar agentes, siga estes passos:

### Primeira vez: rodar o projeto

Abra o Claude Code na pasta do projeto e diga:

```
Rode npm install e depois npm run dev pra eu ver o app no browser
```

O Claude vai instalar as dependencias e iniciar o servidor. Abra o link que aparecer no terminal (geralmente `http://localhost:5173`).

### Criar um agente novo pelo Claude

Voce pode pedir ao Claude para criar agentes diretamente no codigo:

```
Crie um novo agente chamado "Amazon" no arquivo src/data/defaultAgents.ts.
O agente deve ser especializado em integracoes VTEX com a Amazon Marketplace,
cobrindo: listagem de produtos via MWS/SP-API, sincronizacao de pedidos,
gestao de FBA, e Buy Box.
```

O Claude vai adicionar o agente no array de defaults e ele aparecera automaticamente na barra lateral.

### Editar o prompt de um agente pelo Claude

```
Atualize o system prompt do agente Mercado Livre em src/data/defaultAgents.ts.
Adicione expertise em Mercado Livre Ads e campanhas promocionais.
```

### Publicar um agente pelo Claude

Para gerar o arquivo de definicao de um agente diretamente no projeto:

```
Publique o agente Mercado Livre: crie o arquivo src/agents/mercado-livre.ts
com o agentConfig exportado, usando o prompt que esta em defaultAgents.ts.
```

O Claude vai criar o arquivo no formato correto dentro de `src/agents/`.

### Atualizar apenas o prompt de um agente publicado

```
Atualize o prompt do agente em src/agents/mercado-livre.ts.
Troque a parte sobre logistica para incluir Mercado Envios Full.
```

### Fluxo completo de prototipagem com o Claude

Um fluxo tipico seria:

1. **Rode o app**: `Rode npm run dev`
2. **Teste no browser**: converse com o agente, veja se as respostas fazem sentido
3. **Ajuste pelo Claude**: `Mude o prompt do agente iFood para focar mais em dark kitchens`
4. **Teste de novo no browser**: o app atualiza automaticamente (HMR)
5. **Publique**: `Crie src/agents/ifood.ts com a config do agente iFood`
6. **Commit**: `Faca um commit com a mensagem "add ifood agent definition"`

## Estrutura do projeto

```
src/
  App.tsx                  # Componente raiz, gerencia estado global
  main.tsx                 # Entry point React
  index.css                # Tailwind CSS

  types/
    agent.ts               # Interfaces: Agent, Message, ViewState

  data/
    defaultAgents.ts       # 3 agentes seed (Mercado Livre, iFood, Shopee)

  hooks/
    useLocalStorage.ts     # Persistencia generica em localStorage
    useAgents.ts           # CRUD de agentes, navegacao, mensagens
    useChat.ts             # Streaming OpenAI, controle de envio

  lib/
    openai.ts              # Client OpenAI singleton + gestao de API key
    publish.ts             # Gera arquivo .ts + download

  components/
    Layout.tsx             # Shell: drawer + area principal
    Drawer.tsx             # Barra lateral com lista de agentes
    DrawerAgentItem.tsx    # Item individual no drawer
    ChatView.tsx           # Interface de chat completa
    ChatMessage.tsx        # Bolha de mensagem (user/assistant)
    ChatInput.tsx          # Campo de texto + botao enviar/parar
    PromptEditor.tsx       # Painel lateral para editar system prompt
    NewAgentForm.tsx       # Formulario de criacao de agente
    ApiKeyModal.tsx        # Modal para configurar API key
    EmptyState.tsx         # Tela inicial sem agente selecionado

  agents/                  # Destino dos agentes publicados
    .gitkeep
```

## Scripts disponiveis

| Comando | Descricao |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento com HMR |
| `npm run build` | Compila TypeScript e gera build de producao em `dist/` |
| `npm run preview` | Serve o build de producao localmente |
| `npm run lint` | Roda ESLint no projeto |

## Stack

- **React 19** + **TypeScript**
- **Vite 8** (bundler + dev server)
- **Tailwind CSS 4** (estilizacao)
- **Lucide React** (icones)
- **OpenAI SDK** (chat com streaming via GPT-4o)
