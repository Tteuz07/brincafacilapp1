-- Script SQL simples para BrincaFácil
-- Apenas para gerenciar emails autorizados

-- Tabela de emails autorizados
CREATE TABLE authorized_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir alguns emails de teste
INSERT INTO authorized_emails (email) VALUES 
('demo@brincafacil.com'),
('teste@exemplo.com'),
('admin@brincafacil.com');

-- Criar índice para performance
CREATE INDEX idx_authorized_emails_email ON authorized_emails(email);
CREATE INDEX idx_authorized_emails_active ON authorized_emails(active);

-- Política de segurança (permitir leitura pública)
ALTER TABLE authorized_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authorized emails" ON authorized_emails
  FOR SELECT USING (active = true);
