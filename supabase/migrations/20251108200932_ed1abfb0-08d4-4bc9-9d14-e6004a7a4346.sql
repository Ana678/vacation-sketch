-- Adicionar campos opcionais à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS interesses TEXT[];

-- Criar índice para melhor performance nas buscas por interesses
CREATE INDEX IF NOT EXISTS idx_profiles_interesses ON public.profiles USING GIN(interesses);