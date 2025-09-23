-- Tabela de usuários para controle de acesso via Kirvano
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Política de segurança (permitir leitura pública)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to users" ON users
  FOR SELECT USING (true);

-- Inserir alguns usuários de teste
INSERT INTO users (email, status) VALUES 
('demo@brincafacil.com', 'approved'),
('teste@exemplo.com', 'approved'),
('admin@brincafacil.com', 'approved');
