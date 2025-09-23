-- Schema do banco de dados para o BrincaFácil App
-- Este arquivo contém todas as tabelas necessárias para o funcionamento completo do app

-- Tabela de usuários (perfis de pais/responsáveis)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  access_type VARCHAR(50) DEFAULT 'authorized', -- 'authorized', 'purchase', 'demo'
  purchase_data JSONB, -- Dados da compra da Kirvano
  subscription_expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de crianças
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Tabela de atividades disponíveis
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- 'motor', 'cognitive', 'social', 'language'
  age_range_min INTEGER NOT NULL,
  age_range_max INTEGER NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  duration_minutes INTEGER,
  materials_needed TEXT[],
  instructions TEXT,
  image_url TEXT,
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades realizadas pelas crianças
CREATE TABLE IF NOT EXISTS child_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  parent_notes TEXT,
  difficulty_felt INTEGER CHECK (difficulty_felt BETWEEN 1 AND 5),
  enjoyment_level INTEGER CHECK (enjoyment_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, activity_id)
);

-- Tabela de desenhos/cartoons
CREATE TABLE IF NOT EXISTS cartoons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de desenhos favoritos
CREATE TABLE IF NOT EXISTS cartoon_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  cartoon_id UUID REFERENCES cartoons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, cartoon_id)
);

-- Tabela de produtos da loja
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  image_url TEXT,
  category VARCHAR(100),
  is_digital BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de compras
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255), -- ID da transação na Kirvano
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Tabela de relatórios de desenvolvimento
CREATE TABLE IF NOT EXISTS development_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  motor_skills_score INTEGER CHECK (motor_skills_score BETWEEN 1 AND 5),
  cognitive_skills_score INTEGER CHECK (cognitive_skills_score BETWEEN 1 AND 5),
  social_skills_score INTEGER CHECK (social_skills_score BETWEEN 1 AND 5),
  language_skills_score INTEGER CHECK (language_skills_score BETWEEN 1 AND 5),
  overall_score DECIMAL(3,2),
  activities_completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, report_date)
);

-- Tabela de configurações do app
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de sistema
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'debug'
  message TEXT NOT NULL,
  context JSONB,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_children_active ON children(is_active);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_age_range ON activities(age_range_min, age_range_max);
CREATE INDEX IF NOT EXISTS idx_child_activities_child_id ON child_activities(child_id);
CREATE INDEX IF NOT EXISTS idx_child_activities_activity_id ON child_activities(activity_id);
CREATE INDEX IF NOT EXISTS idx_child_activities_completed_at ON child_activities(completed_at);
CREATE INDEX IF NOT EXISTS idx_favorites_child_id ON favorites(child_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_development_reports_child_id ON development_reports(child_id);
CREATE INDEX IF NOT EXISTS idx_development_reports_date ON development_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO app_settings (key, value, description) VALUES
('app_version', '1.0.0', 'Versão atual do aplicativo'),
('maintenance_mode', 'false', 'Modo de manutenção do sistema'),
('max_children_per_user', '5', 'Número máximo de crianças por usuário'),
('free_trial_days', '7', 'Dias de teste gratuito'),
('premium_price', '29.90', 'Preço do plano premium em BRL')
ON CONFLICT (key) DO NOTHING;

-- Inserir algumas atividades de exemplo
INSERT INTO activities (title, description, category, age_range_min, age_range_max, difficulty_level, duration_minutes, materials_needed, instructions) VALUES
('Torre de Blocos', 'Construir uma torre com blocos de diferentes tamanhos', 'motor', 1, 3, 2, 15, ARRAY['blocos de construção'], 'Peça para a criança empilhar os blocos do maior para o menor'),
('Quebra-cabeça Simples', 'Montar um quebra-cabeça com poucas peças', 'cognitive', 2, 4, 2, 20, ARRAY['quebra-cabeça infantil'], 'Ajude a criança a encontrar as peças que se encaixam'),
('Dança das Cores', 'Pular quando a música parar e tocar na cor mencionada', 'motor', 3, 6, 3, 10, ARRAY['música', 'objetos coloridos'], 'Coloque música e peça para pular quando parar, tocando na cor que você mencionar'),
('História com Figuras', 'Criar uma história usando figuras ou desenhos', 'language', 4, 7, 3, 25, ARRAY['figuras', 'papel', 'lápis'], 'Mostre figuras e peça para a criança criar uma história'),
('Jogo da Memória', 'Encontrar pares de cartas iguais', 'cognitive', 3, 8, 2, 15, ARRAY['cartas de memória'], 'Vire as cartas e peça para encontrar os pares iguais')
ON CONFLICT DO NOTHING;

-- Inserir alguns desenhos de exemplo
INSERT INTO cartoons (name, description, category) VALUES
('Bluey', 'A cachorrinha azul e suas aventuras familiares', 'animação'),
('Caillou', 'O menino de 4 anos e suas descobertas', 'educativo'),
('Daniel Tigre', 'As aventuras do pequeno tigre Daniel', 'educativo'),
('Luna', 'A menina que ama a lua e as estrelas', 'aventura'),
('Puffin Rock', 'As aventuras dos pinguins na rocha', 'natureza')
ON CONFLICT DO NOTHING;

