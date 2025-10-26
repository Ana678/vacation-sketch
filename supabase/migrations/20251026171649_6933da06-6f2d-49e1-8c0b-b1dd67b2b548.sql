-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create atividades table (pre-cadastradas)
CREATE TABLE public.atividades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  local text NOT NULL,
  descricao text,
  foto_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view atividades"
  ON public.atividades FOR SELECT
  USING (true);

-- Create roteiros table
CREATE TABLE public.roteiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  descricao text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.roteiros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roteiros"
  ON public.roteiros FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roteiros"
  ON public.roteiros FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roteiros"
  ON public.roteiros FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roteiros"
  ON public.roteiros FOR DELETE
  USING (auth.uid() = user_id);

-- Create atividades_roteiro (many-to-many)
CREATE TABLE public.atividades_roteiro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roteiro_id uuid REFERENCES public.roteiros(id) ON DELETE CASCADE NOT NULL,
  atividade_id uuid REFERENCES public.atividades(id) ON DELETE CASCADE NOT NULL,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(roteiro_id, atividade_id)
);

ALTER TABLE public.atividades_roteiro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view atividades of own roteiros"
  ON public.atividades_roteiro FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.roteiros 
    WHERE roteiros.id = atividades_roteiro.roteiro_id 
    AND roteiros.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage atividades of own roteiros"
  ON public.atividades_roteiro FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.roteiros 
    WHERE roteiros.id = atividades_roteiro.roteiro_id 
    AND roteiros.user_id = auth.uid()
  ));

-- Create itinerarios table
CREATE TABLE public.itinerarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  roteiro_id uuid REFERENCES public.roteiros(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  descricao text,
  local text,
  data_inicio date NOT NULL,
  data_fim date NOT NULL,
  dias int GENERATED ALWAYS AS (data_fim - data_inicio + 1) STORED,
  status text DEFAULT 'planejado' CHECK (status IN ('planejado', 'em_andamento', 'concluido')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.itinerarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own itinerarios"
  ON public.itinerarios FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itinerarios"
  ON public.itinerarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itinerarios"
  ON public.itinerarios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itinerarios"
  ON public.itinerarios FOR DELETE
  USING (auth.uid() = user_id);

-- Create atividades_itinerario table
CREATE TABLE public.atividades_itinerario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerario_id uuid REFERENCES public.itinerarios(id) ON DELETE CASCADE NOT NULL,
  atividade_id uuid REFERENCES public.atividades(id) ON DELETE CASCADE NOT NULL,
  dia int NOT NULL,
  horario time,
  ordem int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.atividades_itinerario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view atividades of own itinerarios"
  ON public.atividades_itinerario FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.itinerarios 
    WHERE itinerarios.id = atividades_itinerario.itinerario_id 
    AND itinerarios.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage atividades of own itinerarios"
  ON public.atividades_itinerario FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.itinerarios 
    WHERE itinerarios.id = atividades_itinerario.itinerario_id 
    AND itinerarios.user_id = auth.uid()
  ));

-- Create avaliacoes table
CREATE TABLE public.avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  itinerario_id uuid REFERENCES public.itinerarios(id) ON DELETE CASCADE NOT NULL,
  atividade_id uuid REFERENCES public.atividades(id) ON DELETE CASCADE NOT NULL,
  nota int NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, itinerario_id, atividade_id)
);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all avaliacoes"
  ON public.avaliacoes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own avaliacoes"
  ON public.avaliacoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avaliacoes"
  ON public.avaliacoes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own avaliacoes"
  ON public.avaliacoes FOR DELETE
  USING (auth.uid() = user_id);

-- Create publicacoes table
CREATE TABLE public.publicacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  texto text NOT NULL,
  foto_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.publicacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view publicacoes"
  ON public.publicacoes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own publicacoes"
  ON public.publicacoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own publicacoes"
  ON public.publicacoes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own publicacoes"
  ON public.publicacoes FOR DELETE
  USING (auth.uid() = user_id);

-- Create comentarios table
CREATE TABLE public.comentarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publicacao_id uuid REFERENCES public.publicacoes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  texto text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comentarios"
  ON public.comentarios FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own comentarios"
  ON public.comentarios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comentarios"
  ON public.comentarios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comentarios"
  ON public.comentarios FOR DELETE
  USING (auth.uid() = user_id);

-- Create favoritos table
CREATE TABLE public.favoritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  roteiro_id uuid REFERENCES public.roteiros(id) ON DELETE CASCADE,
  itinerario_id uuid REFERENCES public.itinerarios(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  CHECK (
    (roteiro_id IS NOT NULL AND itinerario_id IS NULL) OR
    (roteiro_id IS NULL AND itinerario_id IS NOT NULL)
  ),
  UNIQUE(user_id, roteiro_id),
  UNIQUE(user_id, itinerario_id)
);

ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favoritos"
  ON public.favoritos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favoritos"
  ON public.favoritos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favoritos"
  ON public.favoritos FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_roteiros_updated_at
  BEFORE UPDATE ON public.roteiros
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_itinerarios_updated_at
  BEFORE UPDATE ON public.itinerarios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_publicacoes_updated_at
  BEFORE UPDATE ON public.publicacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();