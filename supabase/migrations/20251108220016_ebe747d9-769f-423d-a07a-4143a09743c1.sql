-- Add campo para marcar atividades como concluídas
ALTER TABLE atividades_itinerario 
ADD COLUMN concluida BOOLEAN NOT NULL DEFAULT false;

-- Add index para melhor performance
CREATE INDEX idx_atividades_itinerario_concluida ON atividades_itinerario(concluida);