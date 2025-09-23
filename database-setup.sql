-- ============================================
-- BRINCAFÁCIL - CONFIGURAÇÃO DO BANCO DE DADOS
-- ============================================

-- 1. Tabelas principais
-- ============================================

-- Tabela de emails autorizados
CREATE TABLE IF NOT EXISTS authorized_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis das crianças
CREATE TABLE IF NOT EXISTS children_profiles (
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
CREATE TABLE IF NOT EXISTS activities (
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
  video_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de desenhos
CREATE TABLE IF NOT EXISTS cartoons (
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
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('activity', 'cartoon')),
  activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
  cartoon_id INTEGER REFERENCES cartoons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type, activity_id, cartoon_id)
);

-- 2. Row Level Security
-- ============================================

ALTER TABLE children_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança
-- ============================================

-- Políticas para children_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON children_profiles;
CREATE POLICY "Users can view their own profile" ON children_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON children_profiles;
CREATE POLICY "Users can create their own profile" ON children_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON children_profiles;
CREATE POLICY "Users can update their own profile" ON children_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own favorites" ON user_favorites;
CREATE POLICY "Users can create their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON user_favorites;
CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para leitura pública
DROP POLICY IF EXISTS "Allow read access to activities" ON activities;
CREATE POLICY "Allow read access to activities" ON activities
  FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Allow read access to cartoons" ON cartoons;
CREATE POLICY "Allow read access to cartoons" ON cartoons
  FOR SELECT USING (active = true);

-- 4. Dados de Exemplo - Emails Autorizados
-- ============================================
-- IMPORTANTE: Substitua pelos emails reais que terão acesso

INSERT INTO authorized_emails (email) VALUES 
('admin@brincafacil.com'),
('teste@exemplo.com')
ON CONFLICT (email) DO NOTHING;

-- 5. Dados de Exemplo - Atividades
-- ============================================

INSERT INTO activities (title, description, instructions, materials, categories, duration, participants, difficulty, min_age, max_age, safety_tips, variations, rating) VALUES 

-- Atividades Criativas
(
  'Pintura com os Dedos',
  'Explore cores e texturas usando apenas os dedos para criar arte',
  ARRAY[
    'Prepare o espaço com jornal ou plástico',
    'Coloque tintas laváveis em pratinhos',
    'Vista roupas que podem sujar',
    'Molhe os dedos na tinta',
    'Crie desenhos livres no papel',
    'Deixe secar e admire a obra de arte!'
  ],
  ARRAY['Tinta atóxica', 'Papel grande', 'Avental', 'Pratinhos'],
  ARRAY['creative', 'indoor'],
  25,
  '1-2',
  'easy',
  2,
  5,
  ARRAY['Use apenas tintas atóxicas', 'Supervisione sempre', 'Proteja móveis e chão'],
  ARRAY[
    'Use esponjas em vez dos dedos',
    'Misture cores para descobrir novas',
    'Faça carimbos com batata cortada'
  ],
  4.7
),

(
  'Teatro de Sombras',
  'Crie histórias mágicas usando luz e sombras',
  ARRAY[
    'Escolha uma parede lisa e clara',
    'Posicione uma lanterna a 1 metro da parede',
    'Use as mãos para fazer formas de animais',
    'Conte uma história simples',
    'Convide a criança a participar',
    'Criem novas formas juntos!'
  ],
  ARRAY['Lanterna ou celular', 'Parede clara'],
  ARRAY['creative', 'indoor', 'quiet'],
  20,
  '1-3',
  'easy',
  3,
  8,
  ARRAY['Cuidado com lanterna quente', 'Não olhe diretamente para a luz'],
  ARRAY[
    'Use objetos para criar sombras diferentes',
    'Grave a história inventada',
    'Faça um cenário com papelão'
  ],
  4.6
),

-- Atividades Físicas
(
  'Circuito de Obstáculos em Casa',
  'Monte um percurso divertido usando móveis e objetos da casa',
  ARRAY[
    'Mapeie um caminho seguro pela casa',
    'Use almofadas para pular',
    'Passe por baixo de cadeiras',
    'Faça zigue-zague entre objetos',
    'Estabeleça um ponto de chegada',
    'Cronometrem juntos!'
  ],
  ARRAY['Almofadas', 'Cadeiras', 'Cronômetro'],
  ARRAY['physical', 'indoor'],
  15,
  '1-4',
  'medium',
  3,
  8,
  ARRAY['Remova objetos pontiagudos', 'Verifique estabilidade dos móveis', 'Supervisione sempre'],
  ARRAY[
    'Faça de olhos vendados (com ajuda)',
    'Inclua música para dar ritmo',
    'Crie medalhas para os participantes'
  ],
  4.8
),

(
  'Dança das Estátuas',
  'Brincadeira musical clássica para gastar energia',
  ARRAY[
    'Escolha músicas animadas',
    'Explique as regras: dançar e parar',
    'Inicie a música',
    'Dance livremente',
    'Pare a música de surpresa',
    'Quem se mexer como estátua "sai"',
    'Continue até o último dançarino!'
  ],
  ARRAY['Música ou dispositivo musical'],
  ARRAY['physical', 'musical', 'indoor'],
  15,
  '2+',
  'easy',
  2,
  8,
  ARRAY['Espaço livre de obstáculos', 'Volume adequado para não incomodar'],
  ARRAY[
    'Tematize as danças (robôs, animais)',
    'Faça poses específicas quando parar',
    'Inclua movimentos lentos e rápidos'
  ],
  4.9
),

-- Atividades Educativas
(
  'Caça ao Tesouro de Números',
  'Encontre números escondidos pela casa enquanto aprende matemática',
  ARRAY[
    'Esconda cartões com números de 1 a 10',
    'Desenhe um mapa simples da casa',
    'Dê a primeira pista',
    'Ajude a encontrar cada número',
    'Contem juntos cada descoberta',
    'Comemore o "tesouro" final!'
  ],
  ARRAY['Cartões numerados', 'Papel para mapa', 'Prêmio pequeno'],
  ARRAY['educational', 'indoor', 'creative'],
  30,
  '1-2',
  'medium',
  4,
  7,
  ARRAY['Esconda em locais seguros', 'Evite lugares altos'],
  ARRAY[
    'Use letras em vez de números',
    'Inclua operações simples',
    'Faça com cores ou formas'
  ],
  4.5
),

-- Atividades ao Ar Livre
(
  'Jardim de Investigação',
  'Explore a natureza como um verdadeiro cientista',
  ARRAY[
    'Pegue uma lupa e caderninho',
    'Procure insetos, folhas e flores',
    'Observe as diferenças',
    'Desenhe o que encontrar',
    'Conte quantos tipos diferentes achou',
    'Crie uma "coleção" de folhas'
  ],
  ARRAY['Lupa', 'Caderno', 'Lápis de cor'],
  ARRAY['outdoor', 'educational'],
  40,
  '1-2',
  'easy',
  3,
  8,
  ARRAY['Não toque plantas desconhecidas', 'Cuidado com insetos', 'Use protetor solar'],
  ARRAY[
    'Fotografe em vez de coletar',
    'Pesquise nomes dos achados',
    'Faça um herbário'
  ],
  4.4
),

-- Atividades Calmas
(
  'Hora da História Inventada',
  'Criem juntos histórias mágicas e divertidas',
  ARRAY[
    'Sentem-se confortavelmente',
    'Escolha um personagem inicial',
    'Comece: "Era uma vez..."',
    'Deixe a criança continuar a história',
    'Alternem quem conta',
    'Desenhem a história no final'
  ],
  ARRAY['Papel', 'Lápis de cor', 'Imaginação'],
  ARRAY['quiet', 'creative', 'educational'],
  25,
  '1-2',
  'easy',
  3,
  8,
  NULL,
  ARRAY[
    'Gravem a história inventada',
    'Usem fantoches para contar',
    'Façam um livro ilustrado'
  ],
  4.6
),

-- Atividades Musicais
(
  'Banda Caseira',
  'Transforme objetos da casa em instrumentos musicais',
  ARRAY[
    'Reúna panelas, colheres, potes',
    'Teste diferentes sons',
    'Escolha uma música conhecida',
    'Pratiquem o ritmo juntos',
    'Façam um mini show',
    'Gravem a apresentação!'
  ],
  ARRAY['Panelas', 'Colheres', 'Potes vazios', 'Arroz (para chocalho)'],
  ARRAY['musical', 'creative', 'indoor'],
  20,
  '1-4',
  'easy',
  2,
  6,
  ARRAY['Volume adequado', 'Objetos sem pontas'],
  ARRAY[
    'Façam instrumentos com recicláveis',
    'Inventem uma música própria',
    'Incluam dança na apresentação'
  ],
  4.7
),

-- Nova atividade: Equilíbrio da Fita
(
  'Equilíbrio da Fita',
  'Desafio de equilíbrio onde as crianças devem caminhar sobre uma fita no chão carregando bolinhas em copos. Desenvolve coordenação motora, equilíbrio, concentração e foco.',
  ARRAY[
    'Explique que só pode pisar em cima da fita',
    'Cada criança segura um papelão com 2 copos e bolinhas',
    'O objetivo é chegar até o final da fita sem derrubar as bolinhas',
    'Se uma bolinha cair, a criança deve voltar ao início',
    'Podem competir para ver quem chega primeiro',
    'Ou cada um pode tentar no seu próprio tempo'
  ],
  ARRAY[
    'Fita adesiva ou fita crepe (3-4 metros)',
    '1 papelão retangular (30x20cm por criança)',
    '2 copos plásticos pequenos por criança',
    '2 bolinhas pequenas por criança (ping pong ou similar)',
    'Cola ou fita dupla face para fixar os copos',
    'Marcador para linha de chegada'
  ],
  ARRAY['physical', 'coordination', 'indoor', 'competition'],
  20,
  '1-4',
  'medium',
  4,
  10,
  ARRAY[
    'Certifique-se que o chão não está escorregadio',
    'Remova obstáculos ao redor da fita',
    'Use bolinhas leves que não machucam se caírem',
    'Supervisione crianças menores para evitar quedas',
    'Mantenha distância segura entre participantes'
  ],
  ARRAY[
    'Versão mais fácil: Use fita mais larga',
    'Versão avançada: Faça curvas na fita',
    'Modo cooperativo: Façam juntos ajudando uns aos outros',
    'Versão com obstáculos: Adicione pequenos desafios no percurso',
    'Modo relay: Passem o papelão de um para outro',
    'Versão noturna: Use bolinhas que brilham no escuro'
  ],
  'https://youtube.com/shorts/vvoAW-aiLd4?feature=share',
  4.6
),

-- Nova atividade: Luva das Cores
(
  'Luva das Cores',
  'Atividade de classificação de cores usando uma luva transparente e papelão. Desenvolve raciocínio lógico, coordenação motora fina e reconhecimento de cores.',
  ARRAY[
    'Mostre a luva com os dedos coloridos para a criança',
    'Explique que cada dedo tem uma cor específica',
    'Apresente o recipiente com objetos coloridos misturados',
    'Peça para colocar objetos vermelhos no dedo vermelho',
    'Continue com todas as cores, uma de cada vez',
    'Celebre cada acerto e ajude quando necessário',
    'No final, conte quantos objetos de cada cor foram colocados'
  ],
  ARRAY[
    '1 luva transparente (descartável ou de limpeza)',
    '1 papelão grande (40x30cm)',
    'Tintas ou papel colorido (5 cores diferentes)',
    'Objetos pequenos coloridos (pompons, blocos, botões)',
    'Cola forte ou fita dupla face',
    'Marcadores coloridos',
    'Recipiente para organizar as peças'
  ],
  ARRAY['educational', 'fine-motor', 'indoor', 'logic'],
  25,
  '1-2',
  'medium',
  3,
  8,
  ARRAY[
    'Supervisione o uso de objetos pequenos para evitar engolimento',
    'Use luvas atóxicas e objetos seguros para crianças',
    'Certifique-se que as tintas estão completamente secas',
    'Guarde peças pequenas fora do alcance após a brincadeira',
    'Verifique se a criança não é alérgica ao material da luva'
  ],
  ARRAY[
    'Versão com números: cada dedo recebe uma quantidade específica',
    'Modo cronometrado: veja quanto tempo leva para classificar tudo',
    'Versão com formas: use círculos, quadrados, triângulos',
    'Adicione texturas: objetos lisos, rugosos, macios',
    'Versão cooperativa: duas crianças classificam juntas',
    'Modo avançado: misture cores (laranja = vermelho + amarelo)'
  ],
  'https://www.youtube.com/shorts/1yjYBtOM3YI',
  4.7
),

-- Nova atividade: Desafio da Corda Guia
(
  'Desafio da Corda Guia',
  'Brincadeira onde as crianças controlam um copo com bolinha através de fitas curvas puxando uma corda. Desenvolve raciocínio lógico, coordenação motora e noção espacial.',
  ARRAY[
    'Explique que o objetivo é levar o copo da largada até a chegada',
    'O copo deve seguir sempre em cima da fita, sem sair dela',
    'A criança controla o copo puxando a corda em diferentes direções',
    'Se a bolinha cair ou o copo sair da fita, volta ao início',
    'Pode ser individual (contra o tempo) ou competição entre participantes',
    'Encoraje estratégia: puxar devagar nas curvas, mais rápido nas retas',
    'Celebre tanto a conclusão quanto as tentativas de melhoria'
  ],
  ARRAY[
    'Fita adesiva ou fita crepe (8-10 metros)',
    '1 copo plástico pequeno por participante',
    '1 bolinha pequena por copo (ping pong ou similar)',
    'Corda ou barbante (3-4 metros por participante)',
    'Funil pequeno (para colocar a bolinha)',
    'Marcadores para pontos de largada e chegada',
    'Cronômetro (para competições)'
  ],
  ARRAY['logic', 'coordination', 'indoor', 'competition', 'strategic'],
  30,
  '1-4',
  'hard',
  5,
  12,
  ARRAY[
    'Supervisione o uso das cordas para evitar acidentes',
    'Certifique-se que o espaço ao redor do percurso está livre',
    'Use bolinhas grandes o suficiente para não serem engolidas',
    'Verifique se as fitas estão bem coladas para evitar escorregões',
    'Mantenha distância segura entre participantes em competições'
  ],
  ARRAY[
    'Versão mais fácil: Percurso mais reto com menos curvas',
    'Versão avançada: Adicione obstáculos ou túneis no percurso',
    'Modo cooperativo: Duas crianças controlam o mesmo copo',
    'Versão com obstáculos: Coloque pequenos cones para desviar',
    'Modo relay: Passem o controle do copo entre participantes',
    'Versão noturna: Use copos que brilham no escuro',
    'Desafio duplo: Cada criança controla dois copos simultaneamente'
  ],
  'https://youtube.com/shorts/_E5z7z2wDrU?feature=share',
  4.8
),

-- Nova atividade: Pinça dos Dedões
(
  'Pinça dos Dedões',
  'Brincadeira com tampinhas presas nos dedos para desenvolver o movimento de pinça. As crianças transferem feijões entre bandejas usando apenas os dedões. Desenvolve coordenação motora fina e prepara para a escrita.',
  ARRAY[
    'Mostre como juntar o polegar e indicador para "beliscar" o feijão',
    'Demonstre como pegar um feijão da bandeja cheia',
    'Ensine a transferir cuidadosamente para a bandeja vazia',
    'Comece com poucos feijões e aumente gradualmente',
    'Encoraje movimentos lentos e precisos',
    'Celebre cada feijão transferido com sucesso',
    'Quando terminar, contem juntos quantos feijões foram transferidos'
  ],
  ARRAY[
    '4 tampinhas pequenas (de garrafa ou pote)',
    'Fita adesiva ou elásticos pequenos',
    'Feijões grandes ou grãos similares (200-300 unidades)',
    '2 bandejas ou pratos rasos',
    'Cronômetro (opcional)',
    'Recipiente para guardar os feijões',
    'Toalha ou pano para limpar'
  ],
  ARRAY['fine-motor', 'educational', 'indoor', 'concentration'],
  20,
  '1-2',
  'medium',
  3,
  8,
  ARRAY[
    'Supervisione sempre para evitar que crianças pequenas engulam feijões',
    'Use feijões grandes o suficiente para não representar risco',
    'Certifique-se que as tampinhas estão bem fixadas',
    'Pare se a criança demonstrar frustração excessiva',
    'Mantenha os feijões organizados para evitar bagunça'
  ],
  ARRAY[
    'Versão mais fácil: Use objetos maiores como blocos pequenos',
    'Modo cronometrado: Veja quantos feijões consegue em 2 minutos',
    'Versão com cores: Separe feijões de cores diferentes',
    'Desafio de precisão: Use recipientes menores',
    'Modo cooperativo: Duas crianças trabalham na mesma bandeja',
    'Versão com contagem: Conte em voz alta cada feijão transferido',
    'Desafio avançado: Use apenas uma mão por vez'
  ],
  'https://youtube.com/shorts/FFeICSqNvSI?feature=share',
  4.6
),

-- Nova atividade: Resgate dos Bonecos
(
  'Resgate dos Bonecos',
  'Brincadeira onde bonecos são "presos" em um prato com elásticos e a criança precisa resgatá-los. Desenvolve raciocínio lógico, coordenação motora fina e habilidades sensoriais.',
  ARRAY[
    'Explique que os bonecos estão "presos" e precisam ser resgatados',
    'Mostre como remover cuidadosamente um elástico por vez',
    'Ensine a observar qual elástico está segurando cada boneco',
    'Encoraje a criança a planejar antes de puxar',
    'Se um boneco cair, celebre o "resgate" bem-sucedido',
    'Deixe a criança montar o próximo desafio',
    'Varie a complexidade conforme a idade e habilidade'
  ],
  ARRAY[
    '1 prato fundo ou recipiente rígido',
    '3-4 bonecos pequenos (brinquedos de plástico)',
    '15-20 elásticos de diferentes cores e tamanhos',
    'Opcional: uma bandeja para organizar',
    'Opcional: cronômetro para desafios'
  ],
  ARRAY['logic', 'fine-motor', 'indoor', 'problem-solving', 'sensory'],
  25,
  '1-2',
  'medium',
  4,
  10,
  ARRAY[
    'Supervisione sempre para evitar que elásticos sejam colocados na boca',
    'Use elásticos grandes o suficiente para não representar risco de engolimento',
    'Certifique-se que os bonecos não têm peças pequenas soltas',
    'Pare se a criança demonstrar frustração excessiva',
    'Verifique se os elásticos não estão muito apertados'
  ],
  ARRAY[
    'Versão mais fácil: Use menos elásticos e apenas uma cor',
    'Modo cronometrado: Resgate todos os bonecos em 3 minutos',
    'Versão por cores: Remova apenas elásticos de uma cor específica',
    'Desafio cooperativo: Uma criança monta, outra resgata',
    'Modo história: Crie narrativas sobre o resgate',
    'Versão avançada: Use mais bonecos e elásticos entrelaçados',
    'Desafio sensorial: Faça de olhos vendados (com supervisão)'
  ],
  'https://youtube.com/shorts/I1XxTNt45LQ?feature=share',
  4.7
),

-- Nova atividade: Encaixe das Caixas de Ovos
(
  'Encaixe das Caixas de Ovos',
  'Brincadeira premium onde as crianças precisam encaixar formas coloridas cortadas de caixas de ovos nas pontas correspondentes. Desenvolve raciocínio lógico, reconhecimento de cores, coordenação motora fina e resolução de problemas.',
  ARRAY[
    'Apresente a caixa de ovos com pontas coloridas para a criança',
    'Mostre as formas cortadas de cores correspondentes',
    'Explique que cada forma tem seu lugar específico na cor correspondente',
    'Comece com uma cor de cada vez para facilitar',
    'Deixe a criança tentar encaixar livremente',
    'Ajude quando necessário, mas encoraje a tentativa independente',
    'Comemore cada encaixe correto',
    'Quando dominar, misture todas as cores para maior desafio'
  ],
  ARRAY[
    '2 caixas de ovos (papelão ou plástico)',
    'Tinta atóxica ou papel colorido (5-6 cores diferentes)',
    'Tesoura (para adulto usar)',
    'Cola não tóxica',
    'Pincéis pequenos',
    'Toalha para limpeza',
    'Bandeja ou recipiente para organizar as peças'
  ],
  ARRAY['educational', 'fine-motor', 'indoor', 'colors', 'logic', 'creative'],
  30,
  '1-2',
  'medium',
  3,
  8,
  ARRAY[
    'Supervisione sempre para evitar que as crianças coloquem peças na boca',
    'Use apenas tintas e colas atóxicas e seguras',
    'Verifique se as bordas cortadas estão lisas para evitar machucados',
    'Guarde peças pequenas fora do alcance após a brincadeira',
    'Pare se a criança demonstrar frustração excessiva',
    'Certifique-se que as tintas estão completamente secas antes do uso'
  ],
  ARRAY[
    'Versão mais fácil: Use apenas 3 cores e formas maiores',
    'Modo cronometrado: Veja quanto tempo leva para encaixar todas as peças',
    'Versão com números: Além das cores, adicione números aos encaixes',
    'Desafio cooperativo: Duas crianças trabalham juntas',
    'Versão com texturas: Adicione diferentes texturas às formas',
    'Modo avançado: Crie padrões específicos de encaixe',
    'Versão educativa: Ensine nomes das cores em outro idioma',
    'Desafio da memória: Mostre o padrão correto e depois deixe tentar de memória'
  ],
  'https://youtube.com/shorts/Zn4Cp3PdZGw?feature=share',
  4.8
),

-- ============================================
-- 30 BRINCADEIRAS TRADICIONAIS
-- Foco em raciocínio, coordenação motora e pensamento lógico
-- ============================================

-- 1. Jogo da Velha Gigante
(
  'Jogo da Velha Gigante',
  'Versão ampliada do clássico jogo da velha usando o corpo todo. Desenvolve raciocínio estratégico, coordenação motora e pensamento lógico avançado.',
  ARRAY[
    'Desenhe um grande jogo da velha no chão com giz ou fita',
    'Cada quadrado deve ter pelo menos 50cm para a criança caber',
    'Use objetos como marcadores (sapatos, brinquedos)',
    'Explique as regras: três em linha para ganhar',
    'Deixe a criança andar e posicionar os marcadores',
    'Incentive o planejamento antes de cada jogada',
    'Celebre tanto vitórias quanto boas estratégias'
  ],
  ARRAY[
    'Giz ou fita adesiva',
    '6 marcadores diferentes (3 de cada cor)',
    'Espaço amplo no chão',
    'Opcional: cronômetro para jogadas'
  ],
  ARRAY['logic', 'strategic', 'traditional', 'physical'],
  20,
  '2',
  'easy',
  4,
  10,
  ARRAY[
    'Certifique-se que o chão não está escorregadio',
    'Use marcadores grandes que não sejam perigosos',
    'Supervisione para evitar disputas'
  ],
  ARRAY[
    'Versão 3D: Use caixas empilhadas',
    'Modo cooperativo: jogem contra o tempo',
    'Versão matemática: adicione números aos quadrados'
  ],
  4.7
),

-- 2. Amarelinha Numérica
(
  'Amarelinha Numérica',
  'Brincadeira tradicional que combina movimento corporal com aprendizado de números e sequências lógicas.',
  ARRAY[
    'Desenhe a amarelinha tradicional numerada de 1 a 10',
    'Explique que deve pular em cada número na ordem',
    'Use uma pedrinha para marcar a casa "proibida"',
    'Ensine a pular com um pé só e com os dois',
    'Crie desafios: pular de costas, conte em voz alta',
    'Varie as sequências: só números pares, só ímpares'
  ],
  ARRAY[
    'Giz colorido ou fita adesiva',
    'Pedrinhas pequenas ou saquinhos de areia',
    'Espaço plano e seguro'
  ],
  ARRAY['traditional', 'physical', 'educational', 'coordination'],
  25,
  '1-4',
  'easy',
  3,
  8,
  ARRAY[
    'Verifique se o chão não tem obstáculos',
    'Use calçados adequados para não escorregar',
    'Cuidado com quedas durante os pulos'
  ],
  ARRAY[
    'Amarelinha das letras',
    'Versão com operações matemáticas',
    'Amarelinha das cores',
    'Modo cronometrado'
  ],
  4.8
),

-- 3. Torre de Hanói Caseira
(
  'Torre de Hanói Caseira',
  'Versão simplificada do famoso quebra-cabeças que desenvolve planejamento sequencial e raciocínio lógico.',
  ARRAY[
    'Use 3 palitos ou cabos como base',
    'Prepare discos de tamanhos diferentes (latas, pratos)',
    'Explique: mover todos os discos de um palito para outro',
    'Regra: disco maior nunca fica em cima do menor',
    'Comece com apenas 3 discos',
    'Demonstre os primeiros movimentos',
    'Deixe a criança descobrir a sequência'
  ],
  ARRAY[
    '3 palitos ou cabos de vassoura',
    '3-5 discos de tamanhos diferentes',
    'Base estável para fixar os palitos',
    'Opcional: timer para desafios'
  ],
  ARRAY['logic', 'problem-solving', 'traditional', 'sequential'],
  30,
  '1-2',
  'medium',
  5,
  10,
  ARRAY[
    'Fixe bem os palitos para não tombarem',
    'Use discos sem bordas cortantes',
    'Supervisione para evitar frustração excessiva'
  ],
  ARRAY[
    'Versão mais fácil: apenas 2 discos',
    'Desafio cronometrado',
    'Torre colorida: cada disco uma cor',
    'Versão gigante com pneus'
  ],
  4.6
),

-- 4. Caça ao Tesouro Lógico
(
  'Caça ao Tesouro Lógico',
  'Brincadeira tradicional com pistas que exigem raciocínio lógico e resolução de problemas sequenciais.',
  ARRAY[
    'Prepare 5-7 pistas que envolvam lógica simples',
    'Cada pista leva à próxima através de dedução',
    'Use enigmas visuais adequados à idade',
    'Esconda as pistas em locais seguros',
    'Acompanhe a criança nas deduções',
    'Dê dicas sutis quando necessário',
    'Celebre cada pista descoberta'
  ],
  ARRAY[
    'Papel para as pistas',
    'Lápis coloridos',
    'Pequenos prêmios ou pistas',
    'Mapa simples da casa/área'
  ],
  ARRAY['logic', 'problem-solving', 'traditional', 'adventure'],
  40,
  '1-3',
  'medium',
  5,
  12,
  ARRAY[
    'Esconda pistas apenas em locais seguros',
    'Evite lugares altos ou perigosos',
    'Acompanhe sempre a criança'
  ],
  ARRAY[
    'Caça ao tesouro matemático',
    'Versão com charadas rimadas',
    'Pistas fotográficas',
    'Caça ao tesouro da natureza'
  ],
  4.9
),

-- 5. Jogo dos Palitos
(
  'Jogo dos Palitos',
  'Jogo tradicional de estratégia que desenvolve pensamento antecipado e raciocínio matemático.',
  ARRAY[
    'Disponha 21 palitos em fileiras ou monte',
    'Explique: cada jogador tira 1, 2 ou 3 palitos',
    'Objetivo: não ser quem pega o último palito',
    'Comece você demonstrando estratégias',
    'Deixe a criança descobrir padrões',
    'Discuta as jogadas depois de cada partida',
    'Varie o número inicial de palitos'
  ],
  ARRAY[
    '21 palitos ou gravetos',
    'Superfície plana para organizar',
    'Opcional: papel para anotar estratégias'
  ],
  ARRAY['logic', 'strategic', 'traditional', 'mathematical'],
  20,
  '2',
  'medium',
  6,
  12,
  ARRAY[
    'Use palitos sem pontas afiadas',
    'Evite que a criança se frustre com derrotas',
    'Ensine que perder também é aprender'
  ],
  ARRAY[
    'Versão com 15 palitos',
    'Jogo dos fósforos (sem fogo)',
    'Variação: quem pega o último ganha',
    'Jogo em equipes'
  ],
  4.5
),

-- 6. Tangram Tradicional
(
  'Tangram Tradicional',
  'Quebra-cabeças chinês milenar que desenvolve percepção espacial e raciocínio geométrico.',
  ARRAY[
    'Apresente as 7 peças do tangram',
    'Mostre figuras simples para montar (casa, barco)',
    'Deixe a criança explorar livremente primeiro',
    'Proponha desafios graduais',
    'Incentive a criação de figuras próprias',
    'Desenhe contornos para ela preencher',
    'Celebre cada figura completada'
  ],
  ARRAY[
    'Conjunto de tangram (madeira ou EVA)',
    'Livro com modelos ou figuras impressas',
    'Papel para desenhar novos desafios'
  ],
  ARRAY['logic', 'spatial', 'traditional', 'creative'],
  25,
  '1',
  'medium',
  4,
  10,
  ARRAY[
    'Use peças grandes o suficiente para não engolir',
    'Verifique se não há pontas cortantes',
    'Guarde as peças organizadas'
  ],
  ARRAY[
    'Tangram gigante no chão',
    'Tangram magnético',
    'Criação de histórias com as figuras',
    'Tangram em equipes'
  ],
  4.7
),

-- 7. Jogo da Memória Gigante
(
  'Jogo da Memória Gigante',
  'Versão ampliada do clássico jogo da memória que exercita a memória visual e coordenação motora.',
  ARRAY[
    'Prepare cartas grandes (pelo menos 15x15cm)',
    'Use imagens simples e coloridas',
    'Disponha as cartas viradas para baixo',
    'Explique: virar duas cartas por vez',
    'Se formarem par, ficam viradas',
    'Se não, viram novamente para baixo',
    'Incentive a memorização das posições'
  ],
  ARRAY[
    '20-30 cartas grandes com pares',
    'Espaço amplo no chão',
    'Imagens atrativas para crianças'
  ],
  ARRAY['memory', 'traditional', 'coordination', 'visual'],
  30,
  '1-4',
  'easy',
  3,
  8,
  ARRAY[
    'Use cartas com bordas não cortantes',
    'Certifique-se que o chão está limpo',
    'Comece com menos pares para não frustrar'
  ],
  ARRAY[
    'Memória temática (animais, cores)',
    'Versão com sons',
    'Memória em movimento',
    'Modo cooperativo contra o tempo'
  ],
  4.8
),

-- 8. Labirinto de Fita
(
  'Labirinto de Fita',
  'Criação de labirintos no chão para desenvolver planejamento espacial e resolução de problemas.',
  ARRAY[
    'Use fita adesiva para criar caminhos no chão',
    'Faça um labirinto com entrada e saída',
    'Inclua becos sem saída para desafio',
    'Demonstre como seguir apenas as linhas',
    'Deixe a criança encontrar a saída',
    'Cronometrem as tentativas',
    'Criem novos labirintos juntos'
  ],
  ARRAY[
    'Fita adesiva colorida',
    'Espaço amplo no chão',
    'Cronômetro',
    'Pequenos prêmios para a chegada'
  ],
  ARRAY['spatial', 'problem-solving', 'traditional', 'physical'],
  35,
  '1-3',
  'easy',
  3,
  10,
  ARRAY[
    'Certifique-se que não há obstáculos no caminho',
    'Use fita que não danifique o chão',
    'Supervisione para evitar corridas perigosas'
  ],
  ARRAY[
    'Labirinto com obstáculos',
    'Versão de olhos vendados (com ajuda)',
    'Labirinto temático',
    'Múltiplas saídas'
  ],
  4.6
),

-- 9. Jogo do Mico Tradicional
(
  'Jogo do Mico Tradicional',
  'Jogo de cartas tradicional que desenvolve estratégia, memória e coordenação motora fina.',
  ARRAY[
    'Use baralho adaptado para crianças',
    'Remova uma carta para criar o "mico"',
    'Distribua todas as cartas igualmente',
    'Explique: formar pares e descartar',
    'Quem ficar com a carta sem par perde',
    'Ensine a observar as expressões dos outros',
    'Incentive estratégias simples'
  ],
  ARRAY[
    'Baralho infantil ou cartas grandes',
    'Mesa ou superfície plana',
    'Cadeiras para todos os jogadores'
  ],
  ARRAY['strategic', 'traditional', 'social', 'fine-motor'],
  25,
  '2-4',
  'easy',
  4,
  10,
  ARRAY[
    'Use cartas adequadas para o tamanho das mãos',
    'Ensine sobre ganhar e perder com esportividade',
    'Supervisione para evitar trapaças'
  ],
  ARRAY[
    'Mico com imagens temáticas',
    'Versão com números',
    'Mico cooperativo',
    'Versão gigante'
  ],
  4.7
),

-- 10. Dança das Cadeiras Estratégica
(
  'Dança das Cadeiras Estratégica',
  'Versão modificada da dança das cadeiras que adiciona elementos de estratégia e pensamento rápido.',
  ARRAY[
    'Disponha cadeiras em círculo (uma a menos que participantes)',
    'Adicione cartões com desafios em cada cadeira',
    'Quando a música para, além de sentar, cumprir o desafio',
    'Desafios podem ser: contar até 10, nomear cores, etc',
    'Quem cumprir o desafio primeiro fica na cadeira',
    'Varie os tipos de desafios a cada rodada'
  ],
  ARRAY[
    'Cadeiras seguras',
    'Cartões com desafios simples',
    'Música',
    'Espaço livre para movimento'
  ],
  ARRAY['strategic', 'traditional', 'physical', 'quick-thinking'],
  20,
  '3-6',
  'easy',
  4,
  8,
  ARRAY[
    'Use cadeiras estáveis',
    'Evite empurrões na disputa',
    'Certifique-se que todos entendem as regras'
  ],
  ARRAY[
    'Desafios matemáticos',
    'Versão com poses específicas',
    'Modo cooperativo',
    'Dança das almofadas'
  ],
  4.8
),

-- 11. Sequência de Cores
(
  'Sequência de Cores',
  'Jogo tradicional que desenvolve memória sequencial e coordenação motora através de padrões coloridos.',
  ARRAY[
    'Use 4-6 objetos coloridos diferentes',
    'Crie uma sequência simples (vermelho, azul, verde)',
    'Mostre a sequência para a criança',
    'Cubra e peça para repetir',
    'Aumente gradualmente a complexidade',
    'Inclua ritmo batendo palmas',
    'Celebre cada sequência correta'
  ],
  ARRAY[
    'Objetos coloridos (blocos, brinquedos)',
    'Pano para cobrir',
    'Espaço organizado para dispor os objetos'
  ],
  ARRAY['memory', 'sequential', 'traditional', 'coordination'],
  20,
  '1-2',
  'easy',
  3,
  7,
  ARRAY[
    'Use objetos grandes o suficiente para não engolir',
    'Comece com sequências curtas',
    'Não force se a criança perder o interesse'
  ],
  ARRAY[
    'Sequência com sons',
    'Versão com movimentos corporais',
    'Sequência musical',
    'Modo competitivo entre irmãos'
  ],
  4.6
),

-- 12. Construção de Torres
(
  'Construção de Torres',
  'Brincadeira tradicional que desenvolve coordenação motora fina, planejamento e noção espacial.',
  ARRAY[
    'Reúna blocos, latas ou caixas de tamanhos variados',
    'Desafie a construir a torre mais alta possível',
    'Ensine sobre equilíbrio e base estável',
    'Incentive planejamento antes de construir',
    'Crie competições amigáveis',
    'Fotografe as criações',
    'Discuta por que algumas torres caem'
  ],
  ARRAY[
    'Blocos de madeira ou latas vazias',
    'Superfície estável e plana',
    'Régua para medir alturas',
    'Câmera para registrar'
  ],
  ARRAY['engineering', 'traditional', 'fine-motor', 'spatial'],
  30,
  '1-3',
  'easy',
  2,
  8,
  ARRAY[
    'Use materiais sem pontas ou bordas cortantes',
    'Supervisione para evitar que caiam na criança',
    'Ensine a construir longe de objetos frágeis'
  ],
  ARRAY[
    'Torres temáticas (castelos, prédios)',
    'Construção em equipe',
    'Torres com pontes',
    'Desafio com materiais específicos'
  ],
  4.7
),

-- 13. Jogo dos Sete Erros Vivencial
(
  'Jogo dos Sete Erros Vivencial',
  'Versão física do clássico jogo que desenvolve atenção aos detalhes e memória visual.',
  ARRAY[
    'Organize um ambiente com vários objetos',
    'Deixe a criança observar por 1 minuto',
    'Peça para ela fechar os olhos',
    'Mude 3-5 objetos de lugar ou retire alguns',
    'Peça para encontrar as diferenças',
    'Comece com poucas mudanças',
    'Aumente gradualmente a dificuldade'
  ],
  ARRAY[
    'Vários objetos pequenos',
    'Mesa ou espaço organizado',
    'Cronômetro',
    'Papel para anotar acertos'
  ],
  ARRAY['observation', 'memory', 'traditional', 'detail-oriented'],
  25,
  '1-2',
  'medium',
  4,
  10,
  ARRAY[
    'Use apenas objetos seguros',
    'Não mude objetos para lugares perigosos',
    'Comece simples para não frustrar'
  ],
  ARRAY[
    'Versão com pessoas (mudanças de roupa)',
    'Jogo dos erros fotográfico',
    'Versão em duplas',
    'Erros temáticos (só cores, só formas)'
  ],
  4.8
),

-- 14. Cabo de Guerra Estratégico
(
  'Cabo de Guerra Estratégico',
  'Brincadeira tradicional modificada que adiciona elementos de estratégia e coordenação de equipe.',
  ARRAY[
    'Use uma corda resistente com marca no meio',
    'Divida em equipes equilibradas',
    'Marque posições estratégicas no chão',
    'Ensine sobre trabalho em equipe e sincronia',
    'Adicione comandos: "puxa", "segura", "prepara"',
    'Varie as formações das equipes',
    'Discuta estratégias após cada rodada'
  ],
  ARRAY[
    'Corda resistente e segura',
    'Fita para marcar o centro',
    'Espaço amplo e seguro',
    'Opcional: luvas para proteção'
  ],
  ARRAY['teamwork', 'traditional', 'physical', 'strategic'],
  20,
  '4-8',
  'easy',
  5,
  12,
  ARRAY[
    'Use corda que não machuca as mãos',
    'Certifique-se que o chão não é escorregadio',
    'Evite puxões muito bruscos',
    'Equilibre as equipes por peso/idade'
  ],
  ARRAY[
    'Cabo de guerra sentado',
    'Versão com obstáculos',
    'Múltiplas cordas',
    'Cabo de guerra intelectual (perguntas)'
  ],
  4.9
),

-- 15. Quebra-Cabeça de Chão
(
  'Quebra-Cabeça de Chão',
  'Quebra-cabeças grandes que podem ser montados no chão, desenvolvendo lógica espacial e persistência.',
  ARRAY[
    'Use quebra-cabeças grandes apropriados para a idade',
    'Prepare uma área limpa no chão',
    'Comece separando as bordas',
    'Ensine a agrupar por cores ou padrões',
    'Incentive tentativas mesmo que erradas',
    'Trabalhem juntos na solução',
    'Comemore a conclusão com foto'
  ],
  ARRAY[
    'Quebra-cabeças grandes (50-200 peças)',
    'Tapete ou superfície macia',
    'Boa iluminação',
    'Bandejas para organizar peças'
  ],
  ARRAY['logic', 'traditional', 'spatial', 'persistence'],
  45,
  '1-2',
  'medium',
  4,
  12,
  ARRAY[
    'Use peças grandes o suficiente para a idade',
    'Mantenha peças organizadas para não perder',
    'Supervisione para evitar que coloquem na boca'
  ],
  ARRAY[
    'Quebra-cabeça gigante (1000+ peças)',
    'Versão 3D',
    'Quebra-cabeça magnético',
    'Criação de quebra-cabeça próprio'
  ],
  4.6
),

-- 16. Jogo da Velha Tridimensional
(
  'Jogo da Velha Tridimensional',
  'Versão avançada do jogo da velha que desenvolve raciocínio espacial complexo e planejamento estratégico.',
  ARRAY[
    'Use 3 tabuleiros de jogo da velha empilhados',
    'Explique que pode ganhar em qualquer direção (x, y, z)',
    'Demonstre as possibilidades de vitória',
    'Comece com 2 níveis apenas',
    'Incentive visualização das jogadas',
    'Discuta estratégias após cada jogo',
    'Aumente para 3 níveis quando dominarem'
  ],
  ARRAY[
    '3 tabuleiros transparentes ou papel',
    'Marcadores de cores diferentes',
    'Suporte para empilhar os tabuleiros'
  ],
  ARRAY['logic', 'strategic', 'traditional', 'spatial'],
  35,
  '2',
  'hard',
  8,
  15,
  ARRAY[
    'Fixe bem os tabuleiros empilhados',
    'Use marcadores grandes e visíveis',
    'Comece simples para não frustrar'
  ],
  ARRAY[
    'Versão 4x4x4',
    'Jogo da velha cilíndrico',
    'Modo cooperativo contra o tempo',
    'Versão com pesos diferentes por nível'
  ],
  4.4
),

-- 17. Circuito de Coordenação
(
  'Circuito de Coordenação',
  'Percurso com estações que desenvolvem diferentes aspectos da coordenação motora e raciocínio.',
  ARRAY[
    'Monte 5-6 estações com desafios diferentes',
    'Estação 1: equilibrar objetos andando',
    'Estação 2: encaixar formas geométricas',
    'Estação 3: arremessar em alvos específicos',
    'Estação 4: seguir sequência de movimentos',
    'Cronometrem cada estação',
    'Variem os desafios a cada dia'
  ],
  ARRAY[
    'Cones ou marcadores',
    'Objetos para equilibrar',
    'Formas geométricas',
    'Alvos para arremesso',
    'Cronômetro'
  ],
  ARRAY['coordination', 'traditional', 'physical', 'multi-skill'],
  40,
  '1-4',
  'medium',
  4,
  10,
  ARRAY[
    'Certifique-se que todas as estações são seguras',
    'Adapte a dificuldade à idade',
    'Supervisione mudanças entre estações'
  ],
  ARRAY[
    'Circuito temático (animais, super-heróis)',
    'Versão em equipes',
    'Circuito noturno com lanternas',
    'Circuito aquático (verão)'
  ],
  4.8
),

-- 18. Jogo das Varetas
(
  'Jogo das Varetas',
  'Jogo tradicional que desenvolve coordenação motora fina, concentração e controle de movimentos.',
  ARRAY[
    'Use varetas coloridas ou palitos de churrasco',
    'Segure todas juntas e solte formando uma pilha',
    'Objetivo: retirar varetas sem mover as outras',
    'Comece com a vareta de cima',
    'Se mover outras varetas, perde a vez',
    'Conte pontos por cores (cada cor vale diferente)',
    'Ensine paciência e movimentos precisos'
  ],
  ARRAY[
    'Conjunto de varetas coloridas',
    'Superfície lisa e estável',
    'Papel para anotar pontos'
  ],
  ARRAY['fine-motor', 'traditional', 'concentration', 'precision'],
  25,
  '2-4',
  'medium',
  5,
  12,
  ARRAY[
    'Use varetas sem pontas muito afiadas',
    'Supervisione para evitar que coloquem na boca',
    'Ensine sobre paciência e frustração'
  ],
  ARRAY[
    'Varetas gigantes com cabo de vassoura',
    'Versão com imãs',
    'Jogo cooperativo',
    'Varetas temáticas com desenhos'
  ],
  4.7
),

-- 19. Detetive das Pistas
(
  'Detetive das Pistas',
  'Jogo de investigação que desenvolve raciocínio dedutivo e habilidades de observação.',
  ARRAY[
    'Crie um "caso" simples para resolver',
    'Espalhe pistas físicas pela casa',
    'Cada pista leva à próxima através de lógica',
    'Use fotografias, objetos e desenhos',
    'Incentive anotações das descobertas',
    'Celebre cada dedução correta',
    'Conclua com a solução do mistério'
  ],
  ARRAY[
    'Caderno de detetive',
    'Lupa (opcional)',
    'Pistas variadas (fotos, objetos)',
    'Lápis para anotações'
  ],
  ARRAY['logic', 'deductive', 'traditional', 'investigation'],
  45,
  '1-2',
  'medium',
  6,
  12,
  ARRAY[
    'Use apenas pistas em locais seguros',
    'Evite pistas que levem a perigo',
    'Acompanhe sempre a investigação'
  ],
  ARRAY[
    'Mistério dos objetos perdidos',
    'Detetive da natureza',
    'Caso em equipe',
    'Mistério com múltiplas soluções'
  ],
  4.9
),

-- 20. Equilibrista Maluco
(
  'Equilibrista Maluco',
  'Brincadeira que combina equilíbrio corporal com desafios cognitivos simultâneos.',
  ARRAY[
    'Use uma linha no chão ou banco baixo',
    'Criança deve caminhar mantendo equilíbrio',
    'Adicione desafios: carregar objetos, responder perguntas',
    'Varie: andar de costas, de lado, devagar',
    'Inclua obstáculos simples para desviar',
    'Comemore progressos mesmo com quedas',
    'Aumente gradualmente a dificuldade'
  ],
  ARRAY[
    'Fita no chão ou banco baixo',
    'Objetos leves para carregar',
    'Pequenos obstáculos seguros',
    'Colchonetes para segurança'
  ],
  ARRAY['balance', 'traditional', 'physical', 'multi-tasking'],
  20,
  '1-2',
  'medium',
  3,
  8,
  ARRAY[
    'Use alturas seguras (máximo 20cm)',
    'Coloque proteção embaixo',
    'Supervisione sempre',
    'Pare se mostrar medo excessivo'
  ],
  ARRAY[
    'Equilibrio com olhos vendados',
    'Versão em duplas',
    'Equilíbrio musical',
    'Desafio com diferentes texturas'
  ],
  4.6
),

-- 21. Mestre Mandou Lógico
(
  'Mestre Mandou Lógico',
  'Versão elaborada do "Mestre Mandou" que inclui sequências lógicas e raciocínio.',
  ARRAY[
    'Comece com comandos simples do mestre tradicional',
    'Adicione sequências: "faça A, depois B, então C"',
    'Inclua condições: "se você estiver de azul, pule"',
    'Use comandos com matemática simples',
    'Ensine escuta ativa e memória sequencial',
    'Deixe a criança ser "mestre" também',
    'Complique gradualmente as instruções'
  ],
  ARRAY[
    'Espaço livre para movimentos',
    'Cartões com comandos escritos',
    'Objetos para usar nos comandos'
  ],
  ARRAY['sequential', 'traditional', 'listening', 'logic'],
  25,
  '3-6',
  'easy',
  4,
  10,
  ARRAY[
    'Certifique-se que há espaço suficiente',
    'Use comandos adequados à idade',
    'Evite comandos perigosos'
  ],
  ARRAY[
    'Mestre mandou matemático',
    'Versão com música',
    'Comandos em outra língua',
    'Mestre mandou cooperativo'
  ],
  4.8
),

-- 22. Construtor de Padrões
(
  'Construtor de Padrões',
  'Atividade que desenvolve reconhecimento de padrões e raciocínio sequencial usando materiais simples.',
  ARRAY[
    'Use objetos coloridos (blocos, botões, brinquedos)',
    'Crie um padrão simples: vermelho, azul, vermelho, azul',
    'Peça para a criança continuar o padrão',
    'Varie: formas, tamanhos, texturas',
    'Deixe ela criar padrões próprios',
    'Fotografe os padrões criados',
    'Aumente a complexidade gradualmente'
  ],
  ARRAY[
    'Objetos variados em cores/formas',
    'Superfície plana para organizar',
    'Câmera para registrar criações',
    'Papel para desenhar padrões'
  ],
  ARRAY['patterns', 'traditional', 'sequential', 'creative'],
  30,
  '1-2',
  'easy',
  3,
  8,
  ARRAY[
    'Use objetos seguros para a idade',
    'Comece com padrões simples',
    'Não force se perder interesse'
  ],
  ARRAY[
    'Padrões musicais',
    'Padrões corporais',
    'Padrões na natureza',
    'Padrões matemáticos'
  ],
  4.7
),

-- 23. Telefone Sem Fio Inteligente
(
  'Telefone Sem Fio Inteligente',
  'Versão elaborada do clássico que adiciona elementos lógicos e de memória.',
  ARRAY[
    'Forme um círculo com pelo menos 4 pessoas',
    'Em vez de frases, use sequências lógicas',
    'Exemplo: "2 patos, 4 pernas, 1 lago"',
    'Cada pessoa deve repetir e adicionar um elemento',
    'Compare a mensagem final com a inicial',
    'Discuta como a informação se transformou',
    'Varie com números, cores, ações'
  ],
  ARRAY[
    'Pelo menos 4 participantes',
    'Papel para anotar as mensagens',
    'Lista de sequências preparadas'
  ],
  ARRAY['sequential', 'traditional', 'memory', 'communication'],
  20,
  '4+',
  'easy',
  4,
  10,
  ARRAY[
    'Use linguagem apropriada',
    'Evite mensagens que possam confundir',
    'Mantenha um ambiente respeitoso'
  ],
  ARRAY[
    'Telefone sem fio matemático',
    'Versão com desenhos',
    'Telefone sem fio em outras línguas',
    'Modo competitivo entre equipes'
  ],
  4.8
),

-- 24. Arquiteto Mirim
(
  'Arquiteto Mirim',
  'Atividade de construção livre que desenvolve criatividade, planejamento espacial e resolução de problemas.',
  ARRAY[
    'Ofereça materiais variados para construção',
    'Proponha um projeto: casa, ponte, torre',
    'Incentive planejamento antes de construir',
    'Discuta conceitos: estabilidade, altura, largura',
    'Deixe experimentar e errar',
    'Fotografe as criações finais',
    'Celebre criatividade, não apenas resultado'
  ],
  ARRAY[
    'Blocos, legos, caixas variadas',
    'Fita adesiva e cola',
    'Papel para desenhar plantas',
    'Régua e lápis'
  ],
  ARRAY['engineering', 'traditional', 'spatial', 'creative'],
  40,
  '1-3',
  'medium',
  4,
  12,
  ARRAY[
    'Use apenas materiais seguros',
    'Supervisione uso de ferramentas',
    'Evite construções muito altas sem apoio'
  ],
  ARRAY[
    'Arquitetura temática (castelos, cidades)',
    'Construção em equipe',
    'Arquitetura sustentável',
    'Réplicas de monumentos famosos'
  ],
  4.7
),

-- 25. Código Secreto das Cores
(
  'Código Secreto das Cores',
  'Jogo de decodificação que desenvolve raciocínio lógico e reconhecimento de padrões.',
  ARRAY[
    'Crie um código onde cada cor representa um número/letra',
    'Mostre a "chave" do código para a criança',
    'Prepare mensagens simples codificadas',
    'Ensine a decodificar passo a passo',
    'Deixe ela criar códigos próprios',
    'Troque mensagens codificadas',
    'Aumente a complexidade gradualmente'
  ],
  ARRAY[
    'Cartões coloridos',
    'Papel para mensagens',
    'Lápis coloridos',
    'Tabela de códigos impressa'
  ],
  ARRAY['logic', 'traditional', 'decoding', 'patterns'],
  35,
  '1-2',
  'medium',
  6,
  12,
  ARRAY[
    'Comece com códigos muito simples',
    'Use cores bem distintas',
    'Mantenha as mensagens apropriadas'
  ],
  ARRAY[
    'Código Morse colorido',
    'Códigos com símbolos',
    'Mensagens secretas em equipe',
    'Códigos numéricos'
  ],
  4.6
),

-- 26. Estátuas Musicais Pensantes
(
  'Estátuas Musicais Pensantes',
  'Versão cognitiva da dança das estátuas que adiciona desafios mentais.',
  ARRAY[
    'Toque música e deixe as crianças dançarem',
    'Quando parar, além de ficarem estátuas, dê um desafio',
    '"Congele como um animal que voa"',
    '"Vire estátua de algo que é azul"',
    '"Posição de quem está fazendo matemática"',
    'Quem se mexer ou não cumprir o desafio sai',
    'Varie os tipos de desafios'
  ],
  ARRAY[
    'Música variada',
    'Espaço livre para dança',
    'Lista de desafios preparada'
  ],
  ARRAY['creative-thinking', 'traditional', 'physical', 'quick-thinking'],
  20,
  '3-8',
  'easy',
  3,
  10,
  ARRAY[
    'Certifique-se que há espaço suficiente',
    'Use desafios apropriados para a idade',
    'Mantenha ambiente seguro para movimento'
  ],
  ARRAY[
    'Estátuas matemáticas',
    'Estátuas emocionais',
    'Versão cooperativa',
    'Estátuas contadoras de história'
  ],
  4.9
),

-- 27. Organizador Lógico
(
  'Organizador Lógico',
  'Atividade que desenvolve categorização, organização lógica e raciocínio classificatório.',
  ARRAY[
    'Reúna objetos variados (brinquedos, materiais)',
    'Peça para separar por categorias: cor, tamanho, uso',
    'Explique os critérios de organização',
    'Deixe ela propor novos critérios',
    'Crie desafios: "organizar de 3 formas diferentes"',
    'Discuta as escolhas de organização',
    'Aplique na arrumação real do quarto'
  ],
  ARRAY[
    'Objetos variados para classificar',
    'Caixas ou recipientes para organizar',
    'Etiquetas para identificar categorias'
  ],
  ARRAY['classification', 'traditional', 'logic', 'organization'],
  30,
  '1-2',
  'easy',
  3,
  8,
  ARRAY[
    'Use apenas objetos seguros',
    'Evite objetos muito pequenos para idade',
    'Mantenha ambiente organizado'
  ],
  ARRAY[
    'Organização por peso',
    'Classificação sensorial (texturas)',
    'Organização temática',
    'Desafio cronometrado'
  ],
  4.7
),

-- 28. Contador de Histórias Estruturado
(
  'Contador de Histórias Estruturado',
  'Atividade narrativa que desenvolve sequenciamento lógico e estruturação do pensamento.',
  ARRAY[
    'Use cartas com imagens ou objetos',
    'Ensine estrutura: início, meio, fim',
    'Sorteie 3-5 cartas para criar história',
    'Ajude a conectar os elementos logicamente',
    'Grave ou desenhe as histórias criadas',
    'Deixe ela ser a "autora principal"',
    'Discuta sequência e coerência'
  ],
  ARRAY[
    'Cartas com imagens variadas',
    'Caderno para desenhar',
    'Gravador (celular)',
    'Lápis coloridos'
  ],
  ARRAY['sequential', 'traditional', 'creative', 'narrative'],
  35,
  '1-2',
  'easy',
  4,
  10,
  ARRAY[
    'Use imagens apropriadas para idade',
    'Mantenha histórias positivas',
    'Respeite criatividade da criança'
  ],
  ARRAY[
    'Histórias matemáticas',
    'Contos colaborativos',
    'Histórias sem palavras',
    'Teatro das histórias criadas'
  ],
  4.8
),

-- 29. Laboratório de Misturas
(
  'Laboratório de Misturas',
  'Atividade experimental que desenvolve hipóteses, observação e raciocínio científico básico.',
  ARRAY[
    'Prepare recipientes com água, corantes, açúcar, sal',
    'Ensine a fazer hipóteses: "o que vai acontecer se..."',
    'Misture ingredientes seguros',
    'Observe e registre os resultados',
    'Compare com as hipóteses iniciais',
    'Repita experimentos para confirmar',
    'Discuta cause e efeito'
  ],
  ARRAY[
    'Recipientes transparentes',
    'Corantes alimentícios',
    'Ingredientes seguros (sal, açúcar)',
    'Caderno para anotações',
    'Avental de proteção'
  ],
  ARRAY['scientific', 'traditional', 'hypothesis', 'observation'],
  40,
  '1-2',
  'medium',
  4,
  10,
  ARRAY[
    'Use apenas ingredientes seguros e comestíveis',
    'Supervisione todas as misturas',
    'Use equipamentos apropriados para idade',
    'Mantenha área limpa e organizada'
  ],
  ARRAY[
    'Laboratório de cores',
    'Experimentos com densidades',
    'Misturas que fazem espuma',
    'Laboratório de texturas'
  ],
  4.6
),

-- 30. Planejador de Rotas
(
  'Planejador de Rotas',
  'Atividade que desenvolve planejamento espacial, orientação e pensamento estratégico.',
  ARRAY[
    'Desenhe um mapa simples da casa ou quintal',
    'Marque pontos de interesse: cozinha, quarto, jardim',
    'Proponha missões: "vá da sala até o jardim"',
    'Ensine a traçar a rota no papel primeiro',
    'Execute a rota planejada fisicamente',
    'Compare diferentes caminhos possíveis',
    'Discuta eficiência: mais rápido vs mais fácil'
  ],
  ARRAY[
    'Papel grande para mapas',
    'Lápis coloridos',
    'Régua',
    'Adesivos para marcar pontos'
  ],
  ARRAY['spatial', 'traditional', 'planning', 'navigation'],
  35,
  '1-2',
  'medium',
  5,
  12,
  ARRAY[
    'Use apenas rotas seguras',
    'Acompanhe durante execução das rotas',
    'Marque perigos no mapa',
    'Ensine sobre segurança nos trajetos'
  ],
  ARRAY[
    'Caça ao tesouro com mapa',
    'Rotas com obstáculos',
    'Mapas 3D',
    'Planejamento de viagens imaginárias'
  ],
  4.7
);

-- 6. Dados de Exemplo - Desenhos
-- ============================================

INSERT INTO cartoons (title, description, category, min_age, max_age, duration, rating, video_url) VALUES 

(
  'Bluey',
  'Aventuras da cachorrinha Bluey e sua família que ensinam sobre criatividade, amizade, resolução de problemas e vida familiar. Cada episódio traz lições valiosas sobre relacionamentos e desenvolvimento emocional.',
  'educational',
  2,
  7,
  22,
  4.9,
  'https://www.youtube.com/watch?v=example-bluey'
),

(
  'Caillou',
  'Histórias do garotinho de 4 anos que explora o mundo ao seu redor. Ensina sobre curiosidade, aprendizado, família e como lidar com diferentes situações do dia a dia.',
  'educational',
  2,
  6,
  25,
  4.7,
  'https://www.youtube.com/watch?v=example-caillou'
),

(
  'Comic',
  'Série de animação que combina humor e aventura com personagens carismáticos. Desenvolve criatividade, senso de humor e habilidades de resolução de problemas.',
  'entertainment',
  4,
  8,
  20,
  4.5,
  'https://www.youtube.com/watch?v=example-comic'
),

(
  'Puffin Rock',
  'Aventuras suaves e educativas na ilha de Puffin Rock, onde as crianças aprendem sobre natureza, animais e o mundo ao seu redor de forma gentil e relaxante.',
  'educational',
  2,
  6,
  15,
  4.6,
  'https://www.youtube.com/watch?v=example-puffin-rock'
),

(
  'Daniel Tigre',
  'Série que ensina sobre emoções, desenvolvimento social e habilidades de vida. Daniel aprende a lidar com diferentes sentimentos e situações com a ajuda de sua família e amigos.',
  'educational',
  2,
  5,
  25,
  4.8,
  'https://www.youtube.com/watch?v=example-daniel-tiger'
),

(
  'Show da Luna',
  'Aventuras da menina Luna que explora o mundo da ciência de forma divertida e acessível. Ensina conceitos científicos básicos através de experiências e descobertas.',
  'educational',
  3,
  8,
  30,
  4.7,
  'https://www.youtube.com/watch?v=example-show-da-luna'
),

(
  'Detetive Labrador',
  'Série de mistério e investigação onde o detetive Labrador resolve casos com a ajuda de crianças. Desenvolve raciocínio lógico, observação e pensamento dedutivo.',
  'educational',
  4,
  9,
  28,
  4.6,
  'https://www.youtube.com/watch?v=example-detetive-labrador'
),

(
  'Diário de Mika',
  'Histórias da menina Mika que compartilha suas experiências, sonhos e aventuras através de seu diário. Ensina sobre expressão criativa, autoconhecimento e desenvolvimento pessoal.',
  'creative',
  3,
  7,
  20,
  4.5,
  'https://www.youtube.com/watch?v=example-diario-de-mika'
);

-- ============================================
-- FINALIZAÇÃO
-- ============================================

-- Atualizar timestamps
UPDATE activities SET created_at = NOW();
UPDATE cartoons SET created_at = NOW();

-- Verificar se tudo foi criado corretamente
SELECT 'Activities created:' as info, COUNT(*) as count FROM activities;
SELECT 'Cartoons created:' as info, COUNT(*) as count FROM cartoons;
SELECT 'Authorized emails:' as info, COUNT(*) as count FROM authorized_emails;





