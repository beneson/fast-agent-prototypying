import OpenAI from 'openai'

let client: OpenAI | null = null

export function getOpenAIClient(apiKey?: string): OpenAI {
  const key = apiKey || localStorage.getItem('openai_api_key') || ''
  if (!client || apiKey) {
    client = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    })
  }
  return client
}

export function setApiKey(key: string) {
  localStorage.setItem('openai_api_key', key)
  client = null
}

export function getApiKey(): string {
  return localStorage.getItem('openai_api_key') || ''
}

export function hasApiKey(): boolean {
  return !!localStorage.getItem('openai_api_key')
}
