-- Criar tabela de galinhas
CREATE TABLE IF NOT EXISTS galinhas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo_barras VARCHAR(20) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  raca VARCHAR(50) NOT NULL,
  idade INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'doente', 'vendida')),
  producao_semanal INTEGER DEFAULT 0,
  data_aquisicao DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('gasto', 'ganho')),
  categoria VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_galinhas_codigo_barras ON galinhas(codigo_barras);
CREATE INDEX IF NOT EXISTS idx_galinhas_status ON galinhas(status);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_galinhas_updated_at BEFORE UPDATE ON galinhas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transacoes_updated_at BEFORE UPDATE ON transacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
