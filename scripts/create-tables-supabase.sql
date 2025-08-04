-- 🐔 SCRIPT PARA CRIAR TABELAS NO SUPABASE
-- Execute este código no SQL Editor do Supabase

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
DROP TRIGGER IF EXISTS update_galinhas_updated_at ON galinhas;
CREATE TRIGGER update_galinhas_updated_at 
    BEFORE UPDATE ON galinhas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transacoes_updated_at ON transacoes;
CREATE TRIGGER update_transacoes_updated_at 
    BEFORE UPDATE ON transacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais de exemplo
INSERT INTO galinhas (codigo_barras, nome, raca, idade, status, producao_semanal, data_aquisicao) 
VALUES 
  ('GAL001', 'Galinha 1', 'Rhode Island Red', 8, 'ativa', 6, '2024-01-15'),
  ('GAL002', 'Galinha 2', 'Leghorn', 6, 'ativa', 7, '2024-02-01'),
  ('GAL003', 'Galinha 3', 'Sussex', 10, 'doente', 5, '2024-01-20')
ON CONFLICT (codigo_barras) DO NOTHING;

-- Inserir transações iniciais de exemplo
INSERT INTO transacoes (tipo, categoria, valor, descricao, data) 
VALUES 
  ('gasto', 'Ração', 150.00, 'Ração para 1 mês', '2024-12-01'),
  ('ganho', 'Ovos', 200.00, 'Venda de 100 ovos', '2024-12-05'),
  ('gasto', 'Medicamentos', 80.00, 'Vacinas e vermífugos', '2024-11-28'),
  ('ganho', 'Ovos', 180.00, 'Venda de 90 ovos', '2024-11-30');

-- Verificar se as tabelas foram criadas
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT COUNT(*) as total_galinhas FROM galinhas;
SELECT COUNT(*) as total_transacoes FROM transacoes;
