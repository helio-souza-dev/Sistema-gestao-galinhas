USE galinha_gestao;

-- Inserir dados iniciais de exemplo
INSERT INTO galinhas (codigo_barras, nome, raca, idade, status, producao_semanal, data_aquisicao) VALUES
('GAL001', 'Galinha 1', 'Rhode Island Red', 8, 'ativa', 6, '2024-01-15'),
('GAL002', 'Galinha 2', 'Leghorn', 6, 'ativa', 7, '2024-02-01'),
('GAL003', 'Galinha 3', 'Sussex', 10, 'ativa', 5, '2024-01-20')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Inserir transações de exemplo
INSERT INTO transacoes (tipo, categoria, valor, descricao, data) VALUES
('gasto', 'Ração', 150.00, 'Ração para 1 mês', '2024-12-01'),
('ganho', 'Ovos', 200.00, 'Venda de 100 ovos', '2024-12-05'),
('gasto', 'Medicamentos', 80.00, 'Vacinas e vermífugos', '2024-11-28'),
('ganho', 'Ovos', 180.00, 'Venda de 90 ovos', '2024-11-30');
