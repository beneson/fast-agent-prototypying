-- Create agents table for published agent definitions
CREATE TABLE IF NOT EXISTS public.agents (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'Bot',
  color text NOT NULL DEFAULT 'bg-indigo-500',
  system_prompt text NOT NULL,
  model text NOT NULL DEFAULT 'gpt-4o',
  temperature real NOT NULL DEFAULT 0.7,
  max_tokens integer NOT NULL DEFAULT 4096,
  is_default boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (anyone can list published agents)
CREATE POLICY "Anyone can read agents"
  ON public.agents FOR SELECT
  USING (true);

-- Allow anonymous insert (publish new agents)
CREATE POLICY "Anyone can insert agents"
  ON public.agents FOR INSERT
  WITH CHECK (true);

-- Allow anonymous update (update prompts of published agents)
CREATE POLICY "Anyone can update agents"
  ON public.agents FOR UPDATE
  USING (true);

-- Allow anonymous delete
CREATE POLICY "Anyone can delete agents"
  ON public.agents FOR DELETE
  USING (true);
