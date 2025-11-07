# BrincaFácil 🎯

Um PWA moderno e responsivo para pais e crianças de 2 a 8 anos, oferecendo brincadeiras personalizadas, desenhos educativos e dicas para os pais.

## ✨ Características

- **🎮 Brincadeiras Personalizadas**: Atividades filtradas por idade, interesses e espaço disponível
- **📺 Desenhos Educativos**: Seleção curada de conteúdo apropriado para cada faixa etária
- **❤️ Sistema de Favoritos**: Salve suas atividades e desenhos preferidos
- **📱 PWA**: Funciona offline e pode ser instalado como app nativo
- **🎨 Design Moderno**: Interface inspirada em apps como Duolingo e Khan Academy Kids
- **🔐 Autenticação Simples**: Login apenas com email autorizado

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **PWA**: Vite Plugin PWA
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Instalação

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o Repositório

\`\`\`bash
git clone <url-do-repositorio>
cd brincafacil-app
\`\`\`

### 2. Instale as Dependências

\`\`\`bash
npm install
\`\`\`

### 3. Configuração do Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma nova conta
2. Crie um novo projeto
3. Anote a URL do projeto e a chave anônima

### 4. Configuração das Variáveis de Ambiente

Crie um arquivo \`.env\` na raiz do projeto:

\`\`\`env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
\`\`\`

### 5. Configuração do Banco de Dados

Execute as seguintes queries SQL no editor SQL do Supabase:

\`\`\`sql
-- Tabela de emails autorizados
CREATE TABLE authorized_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis das crianças
CREATE TABLE children_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  avatar TEXT DEFAULT '🧒',
  interests TEXT[] DEFAULT '{}',
  space TEXT,
  companionship TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT[],
  materials TEXT[],
  categories TEXT[],
  duration INTEGER DEFAULT 15,
  participants TEXT DEFAULT '1-2',
  difficulty TEXT DEFAULT 'easy',
  min_age INTEGER DEFAULT 2,
  max_age INTEGER DEFAULT 8,
  rating DECIMAL(2,1) DEFAULT 4.5,
  safety_tips TEXT[],
  variations TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de desenhos
CREATE TABLE cartoons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  min_age INTEGER DEFAULT 2,
  max_age INTEGER DEFAULT 8,
  duration INTEGER,
  rating DECIMAL(2,1) DEFAULT 4.5,
  video_url TEXT,
  thumbnail_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de favoritos dos usuários
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('activity', 'cartoon')),
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  cartoon_id INTEGER REFERENCES cartoons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type, activity_id, cartoon_id)
);

-- Row Level Security
ALTER TABLE children_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view their own profile" ON children_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON children_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON children_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Permitir leitura pública para atividades e desenhos
CREATE POLICY "Allow read access to activities" ON activities
  FOR SELECT USING (active = true);

CREATE POLICY "Allow read access to cartoons" ON cartoons
  FOR SELECT USING (active = true);
\`\`\`

### 6. Adicionar Emails Autorizados

Adicione emails que terão acesso ao app:

\`\`\`sql
INSERT INTO authorized_emails (email) VALUES 
('seu-email@exemplo.com'),
('outro-email@exemplo.com');
\`\`\`

### 7. Dados de Exemplo (Opcional)

Para popular o banco com dados de exemplo:

\`\`\`sql
-- Atividades de exemplo
INSERT INTO activities (title, description, instructions, materials, categories, duration, participants, difficulty, min_age, max_age) VALUES 
(
  'Caça ao Tesouro em Casa', 
  'Uma divertida brincadeira de exploração dentro de casa',
  ARRAY[
    'Escolha 5-7 objetos para esconder pela casa',
    'Crie pistas simples para cada objeto',
    'Esconda os objetos em locais seguros',
    'Entregue a primeira pista para a criança',
    'Acompanhe a busca e dê dicas se necessário',
    'Comemore quando encontrar o "tesouro" final!'
  ],
  ARRAY['Papel e caneta', 'Objetos pequenos', 'Prêmio final'],
  ARRAY['indoor', 'educational', 'creative'],
  30,
  '1-3',
  'easy',
  3,
  8
),
(
  'Dança das Estátuas',
  'Brincadeira musical para gastar energia e se divertir',
  ARRAY[
    'Coloque uma música animada',
    'Dance livremente enquanto a música toca',
    'Quando a música parar, vire uma estátua',
    'Quem se mexer sai da brincadeira',
    'Continue até sobrar um vencedor!'
  ],
  ARRAY['Música ou celular'],
  ARRAY['physical', 'musical', 'indoor'],
  15,
  '2+',
  'easy',
  2,
  8
);

-- Desenhos de exemplo
INSERT INTO cartoons (title, description, category, min_age, max_age, duration) VALUES 
(
  'Peppa Pig - Episódios Educativos',
  'Aventuras da família Pig com lições sobre amizade e família',
  'educational',
  2,
  6,
  20
),
(
  'Natureza para Crianças',
  'Documentário infantil sobre animais e meio ambiente',
  'educational',
  4,
  8,
  25
),
(
  'Música Clássica para Relaxar',
  'Compilação de música clássica com animações suaves',
  'calm',
  2,
  8,
  30
);
\`\`\`

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse: http://localhost:5173

### Build para Produção

\`\`\`bash
npm run build
\`\`\`

### Preview da Build

\`\`\`bash
npm run preview
\`\`\`

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático a cada push

### Netlify

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: \`npm run build\`
4. Publish directory: \`dist\`

## 📱 PWA Features

- **Instalação**: Pode ser instalado como app nativo
- **Offline**: Funciona sem internet com dados em cache
- **Notificações**: Suporte a notificações push (futuro)
- **Responsivo**: Otimizado para mobile e desktop

## 🎨 Customização

### Cores

As cores principais podem ser alteradas em \`tailwind.config.js\`:

\`\`\`js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#FF7A00', // Cor principal laranja
        // ... outras variações
      }
    }
  }
}
\`\`\`

### Componentes

Todos os componentes estão em \`src/components/\` e podem ser facilmente customizados.

## 📂 Estrutura do Projeto

\`\`\`
src/
├── components/          # Componentes reutilizáveis
│   ├── ActivityCard/
│   ├── CartoonCard/
│   ├── Layout/
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── HomePage/
│   ├── ActivitiesPage/
│   ├── ProfilePage/
│   └── ...
├── store/              # Gerenciamento de estado
├── lib/                # Configurações e utilitários
└── ...
\`\`\`

## 🔐 Segurança

- Row Level Security (RLS) habilitado no Supabase
- Autenticação baseada em emails autorizados
- Validação de dados no frontend e backend
- HTTPS obrigatório em produção

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo \`LICENSE\` para mais detalhes.

## 📞 Suporte

- Email: suporte@brincafacil.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/brincafacil-app/issues)

## 🎯 Roadmap

- [ ] Sistema de notificações push
- [ ] Modo escuro
- [ ] Mais categorias de atividades
- [ ] Sistema de conquistas/gamificação
- [ ] Compartilhamento de atividades favoritas
- [ ] Estatísticas detalhadas de uso
- [ ] Suporte a múltiplas crianças por conta

---

Feito com ❤️ para famílias brasileiras

## SQL necessário no Supabase

create table if not exists public.licencas (
  email text primary key,
  status text not null default 'pendente', -- 'pago' | 'pendente' | 'estornado'
  origem text,
  updated_at timestamptz not null default now()
);

alter table public.licencas enable row level security;

create policy "select_own_licenca"
on public.licencas for select
using (auth.email() = email);















