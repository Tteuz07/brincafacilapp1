-- ============================================
-- ADICIONAR 15 NOVAS BRINCADEIRAS COM VÍDEOS
-- ============================================

INSERT INTO activities (title, description, instructions, materials, categories, duration, participants, difficulty, min_age, max_age, safety_tips, variations, video_url, rating) VALUES 

-- 1. Pescador de Argolas
(
  'Pescador de Argolas',
  'Brincadeira onde as crianças pescam argolas coloridas usando uma vara. Desenvolve coordenação motora, concentração e habilidades de precisão.',
  ARRAY[
    'Prepare as argolas coloridas no chão ou em uma caixa',
    'Mostre como segurar a vara de pescar',
    'Explique que o objetivo é fisgar as argolas',
    'Deixe a criança tentar pescar cada argola',
    'Conte quantas argolas foram pescadas',
    'Varie a distância para aumentar o desafio',
    'Celebre cada argola pescada com sucesso'
  ],
  ARRAY[
    'Vara de pescar (pode ser feita com cabo e gancho)',
    'Argolas coloridas (5-10 unidades)',
    'Caixa ou recipiente para as argolas',
    'Marcador para delimitar área de pesca'
  ],
  ARRAY['coordination', 'fine-motor', 'indoor', 'precision'],
  20,
  '1-3',
  'medium',
  3,
  8,
  ARRAY[
    'Supervisione o uso da vara para evitar acidentes',
    'Use argolas grandes o suficiente para não engolir',
    'Certifique-se que o gancho não é pontiagudo',
    'Mantenha distância segura entre participantes'
  ],
  ARRAY[
    'Versão com pontuação por cores',
    'Modo cronometrado',
    'Pescaria cooperativa em equipe',
    'Versão com obstáculos'
  ],
  'https://youtube.com/shorts/lSdHl6KzzOE',
  4.7
),

-- 2. Código das Cores
(
  'Código das Cores',
  'Jogo de decodificação onde as crianças seguem sequências de cores para resolver desafios. Desenvolve raciocínio lógico, memória e reconhecimento de padrões.',
  ARRAY[
    'Apresente o código de cores para a criança',
    'Mostre como cada cor representa uma ação ou número',
    'Comece com sequências simples de 2-3 cores',
    'Deixe a criança decodificar e executar',
    'Aumente gradualmente a complexidade',
    'Incentive a criação de códigos próprios',
    'Celebre cada código decifrado corretamente'
  ],
  ARRAY[
    'Cartões ou blocos coloridos',
    'Tabela de códigos impressa',
    'Papel para anotar sequências',
    'Marcadores coloridos'
  ],
  ARRAY['logic', 'educational', 'indoor', 'patterns', 'memory'],
  25,
  '1-2',
  'medium',
  4,
  10,
  ARRAY[
    'Use cores bem distintas e visíveis',
    'Comece com códigos muito simples',
    'Não force se a criança perder interesse',
    'Mantenha o ambiente organizado'
  ],
  ARRAY[
    'Versão com números',
    'Código musical',
    'Desafio cronometrado',
    'Modo cooperativo'
  ],
  'https://youtube.com/shorts/dNnWu-QgSvQ',
  4.8
),

-- 3. Encaixe as Cores
(
  'Encaixe as Cores',
  'Atividade de encaixe onde as crianças combinam peças coloridas com seus respectivos lugares. Desenvolve coordenação motora fina, reconhecimento de cores e resolução de problemas.',
  ARRAY[
    'Mostre as peças coloridas e os espaços correspondentes',
    'Explique que cada cor tem seu lugar específico',
    'Deixe a criança explorar e tentar encaixar',
    'Ajude quando necessário, mas incentive independência',
    'Comemore cada encaixe correto',
    'Misture as peças para repetir o desafio',
    'Varie a ordem para manter o interesse'
  ],
  ARRAY[
    'Base com espaços coloridos',
    'Peças coloridas para encaixar',
    'Bandeja para organizar as peças',
    'Toalha para limpeza'
  ],
  ARRAY['fine-motor', 'educational', 'indoor', 'colors', 'logic'],
  20,
  '1-2',
  'easy',
  2,
  6,
  ARRAY[
    'Use peças grandes o suficiente para não engolir',
    'Verifique se não há bordas cortantes',
    'Supervisione crianças menores',
    'Guarde as peças organizadas após o uso'
  ],
  ARRAY[
    'Versão com formas geométricas',
    'Modo cronometrado',
    'Encaixe de texturas',
    'Desafio de memória'
  ],
  'https://youtube.com/shorts/QpAXeeZ-0OA',
  4.6
),

-- 4. Circuito das Cores
(
  'Circuito das Cores',
  'Percurso colorido onde as crianças seguem um caminho de cores específicas. Desenvolve coordenação motora ampla, reconhecimento de cores e seguimento de instruções.',
  ARRAY[
    'Monte o circuito com marcadores coloridos no chão',
    'Explique a sequência de cores a seguir',
    'Demonstre como percorrer o circuito',
    'Deixe a criança fazer o percurso',
    'Varie os comandos: pular, andar, correr',
    'Adicione desafios em cada cor',
    'Cronometrem e tentem melhorar o tempo'
  ],
  ARRAY[
    'Marcadores coloridos ou fita adesiva',
    'Espaço amplo para o circuito',
    'Cronômetro',
    'Cartões com comandos por cor'
  ],
  ARRAY['physical', 'coordination', 'indoor', 'colors', 'educational'],
  25,
  '1-4',
  'easy',
  3,
  8,
  ARRAY[
    'Certifique-se que o chão não está escorregadio',
    'Remova obstáculos perigosos',
    'Supervisione durante o percurso',
    'Adapte a velocidade à idade da criança'
  ],
  ARRAY[
    'Circuito com obstáculos',
    'Versão em equipe',
    'Circuito musical',
    'Desafio noturno com cores que brilham'
  ],
  'https://youtube.com/shorts/yMdhre4XgWk',
  4.7
),

-- 5. Pebolim de Caixa
(
  'Pebolim de Caixa',
  'Versão caseira de pebolim feita com caixa de papelão. Desenvolve coordenação motora, estratégia e habilidades sociais através do jogo competitivo.',
  ARRAY[
    'Apresente o pebolim de caixa para as crianças',
    'Explique as regras básicas do jogo',
    'Mostre como girar as varetas para mover os jogadores',
    'Deixe cada criança praticar os movimentos',
    'Inicie uma partida amigável',
    'Incentive fair play e esportividade',
    'Celebre tanto vitórias quanto boas jogadas'
  ],
  ARRAY[
    'Caixa de papelão grande',
    'Varetas ou palitos de churrasco',
    'Pregadores de roupa como jogadores',
    'Bolinha pequena',
    'Fita adesiva para fixação'
  ],
  ARRAY['coordination', 'strategic', 'indoor', 'social', 'competition'],
  30,
  '2-4',
  'medium',
  5,
  12,
  ARRAY[
    'Supervisione o uso das varetas',
    'Use bolinha leve que não machuca',
    'Certifique-se que a estrutura está estável',
    'Ensine sobre ganhar e perder com respeito'
  ],
  ARRAY[
    'Torneio de pebolim',
    'Versão em equipes',
    'Pebolim temático',
    'Modo com regras especiais'
  ],
  'https://youtube.com/shorts/piQiioUe0pA',
  4.8
),

-- 6. Labirinto dos Túneis
(
  'Labirinto dos Túneis',
  'Brincadeira onde as crianças navegam por um labirinto com túneis. Desenvolve orientação espacial, resolução de problemas e coordenação motora.',
  ARRAY[
    'Monte o labirinto com túneis e caminhos',
    'Mostre a entrada e a saída',
    'Explique que devem encontrar o caminho certo',
    'Deixe a criança explorar o labirinto',
    'Ofereça dicas se necessário',
    'Cronometrem as tentativas',
    'Varie o percurso para novos desafios'
  ],
  ARRAY[
    'Caixas de papelão ou túneis de brinquedo',
    'Fita adesiva para conectar',
    'Marcadores para entrada e saída',
    'Cronômetro'
  ],
  ARRAY['spatial', 'problem-solving', 'indoor', 'physical', 'adventure'],
  35,
  '1-3',
  'medium',
  3,
  10,
  ARRAY[
    'Certifique-se que os túneis são seguros',
    'Verifique a ventilação adequada',
    'Supervisione crianças menores',
    'Evite túneis muito apertados'
  ],
  ARRAY[
    'Labirinto no escuro com lanternas',
    'Versão com desafios em cada túnel',
    'Modo cooperativo',
    'Labirinto temático'
  ],
  'https://youtube.com/shorts/DBHiKEe4r3I',
  4.7
),

-- 7. Caixa-Cascata
(
  'Caixa-Cascata',
  'Brincadeira onde bolinhas caem em cascata através de níveis de caixas. Desenvolve causa e efeito, coordenação motora e observação.',
  ARRAY[
    'Monte a estrutura de caixas em níveis',
    'Mostre como as bolinhas caem de nível em nível',
    'Deixe a criança soltar as bolinhas no topo',
    'Observe juntos o caminho das bolinhas',
    'Experimente diferentes posições das caixas',
    'Conte quantas bolinhas chegam ao final',
    'Discuta o que acontece em cada nível'
  ],
  ARRAY[
    'Caixas de diferentes tamanhos',
    'Bolinhas coloridas',
    'Fita adesiva para fixação',
    'Base estável para a estrutura'
  ],
  ARRAY['observation', 'cause-effect', 'indoor', 'physics', 'creative'],
  25,
  '1-2',
  'easy',
  2,
  7,
  ARRAY[
    'Fixe bem as caixas para não caírem',
    'Use bolinhas grandes o suficiente',
    'Supervisione para evitar que coloquem na boca',
    'Certifique-se da estabilidade da estrutura'
  ],
  ARRAY[
    'Cascata com obstáculos',
    'Versão com diferentes tipos de objetos',
    'Modo cronometrado',
    'Cascata musical'
  ],
  'https://youtube.com/shorts/4UrFCSf-Clc',
  4.6
),

-- 8. Estrada da Soma
(
  'Estrada da Soma',
  'Jogo educativo onde as crianças percorrem uma estrada resolvendo somas. Desenvolve habilidades matemáticas, raciocínio lógico e coordenação.',
  ARRAY[
    'Monte a estrada com números e operações',
    'Explique que devem resolver cada soma para avançar',
    'Comece com somas simples (1+1, 2+1)',
    'Deixe a criança resolver e avançar',
    'Ajude quando necessário',
    'Comemore cada resposta correta',
    'Aumente a dificuldade gradualmente'
  ],
  ARRAY[
    'Cartões com números',
    'Marcadores para a estrada',
    'Peão ou carrinho para mover',
    'Papel para cálculos'
  ],
  ARRAY['educational', 'mathematical', 'indoor', 'logic', 'sequential'],
  30,
  '1-2',
  'medium',
  5,
  10,
  ARRAY[
    'Adapte a dificuldade à idade',
    'Não force se a criança se frustrar',
    'Use materiais concretos para ajudar',
    'Celebre o esforço, não apenas acertos'
  ],
  ARRAY[
    'Estrada da subtração',
    'Versão com multiplicação',
    'Modo cooperativo',
    'Estrada temática'
  ],
  'https://youtube.com/shorts/iONblHDrKEs',
  4.8
),

-- 9. Carrinho Foguete
(
  'Carrinho Foguete',
  'Brincadeira onde carrinhos são impulsionados como foguetes. Desenvolve compreensão de física básica, coordenação e criatividade.',
  ARRAY[
    'Prepare os carrinhos e a rampa de lançamento',
    'Explique como o impulso faz o carrinho ir longe',
    'Demonstre o lançamento do carrinho foguete',
    'Deixe a criança experimentar diferentes forças',
    'Meçam a distância percorrida',
    'Testem diferentes ângulos de lançamento',
    'Discutam o que faz o carrinho ir mais longe'
  ],
  ARRAY[
    'Carrinhos de brinquedo',
    'Rampa ou superfície inclinada',
    'Fita métrica para medir distâncias',
    'Marcadores para registrar recordes'
  ],
  ARRAY['physics', 'outdoor', 'educational', 'creative', 'experimentation'],
  25,
  '1-3',
  'easy',
  3,
  10,
  ARRAY[
    'Use área segura sem obstáculos perigosos',
    'Supervisione o lançamento dos carrinhos',
    'Evite lançar em direção a pessoas',
    'Use carrinhos sem peças soltas'
  ],
  ARRAY[
    'Competição de distância',
    'Carrinho com obstáculos',
    'Versão com diferentes superfícies',
    'Modo em equipe'
  ],
  'https://youtube.com/shorts/u0LDZ6zC8tE',
  4.7
),

-- 10. Alinhamento Colorido
(
  'Alinhamento Colorido',
  'Jogo onde as crianças alinham objetos por cores em sequência. Desenvolve organização, reconhecimento de cores e coordenação motora fina.',
  ARRAY[
    'Apresente os objetos coloridos misturados',
    'Explique que devem alinhar por cores',
    'Mostre um exemplo de alinhamento',
    'Deixe a criança organizar as cores',
    'Incentive padrões e sequências',
    'Conte quantos objetos de cada cor',
    'Varie os desafios de alinhamento'
  ],
  ARRAY[
    'Objetos coloridos variados',
    'Bandeja ou superfície para alinhar',
    'Marcadores de cores',
    'Recipientes para organizar'
  ],
  ARRAY['fine-motor', 'educational', 'indoor', 'colors', 'organization'],
  20,
  '1-2',
  'easy',
  2,
  6,
  ARRAY[
    'Use objetos grandes o suficiente',
    'Supervisione crianças menores',
    'Mantenha o ambiente organizado',
    'Guarde as peças após o uso'
  ],
  ARRAY[
    'Alinhamento por tamanho',
    'Versão com formas',
    'Modo cronometrado',
    'Padrões complexos'
  ],
  'https://youtube.com/shorts/a6aUfpJm82Y',
  4.6
),

-- 11. Guerra de Disco
(
  'Guerra de Disco',
  'Jogo competitivo onde as crianças lançam discos para acertar alvos. Desenvolve coordenação motora, precisão e habilidades sociais.',
  ARRAY[
    'Prepare os discos e delimite a área de jogo',
    'Explique as regras do jogo',
    'Mostre como lançar os discos corretamente',
    'Deixe cada criança praticar os lançamentos',
    'Inicie a competição amigável',
    'Conte os pontos de cada jogador',
    'Celebre tanto vitórias quanto boas tentativas'
  ],
  ARRAY[
    'Discos de papel ou plástico',
    'Alvos ou marcadores',
    'Fita adesiva para delimitar área',
    'Placar para pontuação'
  ],
  ARRAY['physical', 'coordination', 'indoor', 'competition', 'social'],
  25,
  '2-4',
  'easy',
  4,
  10,
  ARRAY[
    'Use discos leves e seguros',
    'Mantenha distância segura entre jogadores',
    'Supervisione o jogo',
    'Ensine sobre fair play'
  ],
  ARRAY[
    'Guerra em equipes',
    'Versão com obstáculos',
    'Modo com alvos móveis',
    'Torneio de discos'
  ],
  'https://youtube.com/shorts/CUkB1y18zeo',
  4.7
),

-- 12. Conexão de Formas
(
  'Conexão de Formas',
  'Atividade onde as crianças conectam formas geométricas seguindo padrões. Desenvolve raciocínio espacial, reconhecimento de formas e lógica.',
  ARRAY[
    'Apresente as formas geométricas',
    'Mostre como conectar as formas',
    'Explique os padrões a seguir',
    'Deixe a criança experimentar conexões',
    'Incentive a criação de padrões próprios',
    'Discuta as formas e suas propriedades',
    'Celebre cada conexão bem-sucedida'
  ],
  ARRAY[
    'Formas geométricas de papel ou EVA',
    'Base para conectar',
    'Cola ou fita adesiva',
    'Modelos de padrões'
  ],
  ARRAY['spatial', 'educational', 'indoor', 'logic', 'creative'],
  30,
  '1-2',
  'medium',
  4,
  10,
  ARRAY[
    'Use materiais seguros',
    'Supervisione o uso de cola',
    'Verifique se não há bordas cortantes',
    'Mantenha organizado'
  ],
  ARRAY[
    'Conexão 3D',
    'Versão com cores',
    'Modo cronometrado',
    'Padrões complexos'
  ],
  'https://youtube.com/shorts/7HUmOeN0aB8',
  4.8
),

-- 13. Estação das Formas
(
  'Estação das Formas',
  'Jogo de classificação onde as crianças organizam formas em estações específicas. Desenvolve categorização, reconhecimento de formas e organização.',
  ARRAY[
    'Monte as estações com diferentes formas',
    'Explique que cada forma tem sua estação',
    'Mostre como classificar as formas',
    'Deixe a criança organizar as formas',
    'Conte quantas formas em cada estação',
    'Varie os critérios de classificação',
    'Celebre a organização completa'
  ],
  ARRAY[
    'Formas geométricas variadas',
    'Estações ou recipientes',
    'Etiquetas para identificação',
    'Bandeja para organizar'
  ],
  ARRAY['educational', 'classification', 'indoor', 'logic', 'organization'],
  25,
  '1-2',
  'easy',
  3,
  8,
  ARRAY[
    'Use formas grandes o suficiente',
    'Supervisione crianças menores',
    'Mantenha o ambiente organizado',
    'Guarde as peças após o uso'
  ],
  ARRAY[
    'Estação por cores',
    'Versão por tamanhos',
    'Modo cronometrado',
    'Classificação múltipla'
  ],
  'https://youtube.com/shorts/WXdRG8rdjqU',
  4.7
),

-- 14. Pinball de Caixa
(
  'Pinball de Caixa',
  'Versão caseira de pinball feita com caixa de papelão. Desenvolve coordenação motora, física básica e criatividade.',
  ARRAY[
    'Apresente o pinball de caixa',
    'Explique como funciona o jogo',
    'Mostre como lançar a bolinha',
    'Deixe a criança jogar livremente',
    'Conte os pontos marcados',
    'Experimente diferentes ângulos',
    'Discuta o que faz a bolinha ir mais longe'
  ],
  ARRAY[
    'Caixa de papelão',
    'Bolinhas pequenas',
    'Elásticos ou molas',
    'Obstáculos variados',
    'Marcadores de pontuação'
  ],
  ARRAY['coordination', 'physics', 'indoor', 'creative', 'fun'],
  30,
  '1-3',
  'medium',
  4,
  12,
  ARRAY[
    'Use bolinhas seguras',
    'Certifique-se da estabilidade da estrutura',
    'Supervisione o jogo',
    'Evite peças pequenas soltas'
  ],
  ARRAY[
    'Pinball temático',
    'Versão com múltiplas bolas',
    'Modo competitivo',
    'Pinball com luzes'
  ],
  'https://youtube.com/shorts/DKMEQb3ucKI',
  4.8
),

-- 15. Alinha Cor
(
  'Alinha Cor',
  'Jogo de alinhamento onde as crianças organizam cores em sequências específicas. Desenvolve reconhecimento de cores, padrões e coordenação motora fina.',
  ARRAY[
    'Apresente as peças coloridas',
    'Mostre o padrão de cores a seguir',
    'Explique a sequência correta',
    'Deixe a criança alinhar as cores',
    'Verifique se o padrão está correto',
    'Incentive novos padrões',
    'Celebre cada alinhamento bem-sucedido'
  ],
  ARRAY[
    'Peças coloridas variadas',
    'Base para alinhamento',
    'Cartões com padrões',
    'Recipiente para organizar'
  ],
  ARRAY['fine-motor', 'educational', 'indoor', 'colors', 'patterns'],
  20,
  '1-2',
  'easy',
  2,
  6,
  ARRAY[
    'Use peças grandes o suficiente',
    'Supervisione crianças menores',
    'Mantenha organizado',
    'Guarde as peças após o uso'
  ],
  ARRAY[
    'Alinhamento por tamanho',
    'Versão com formas',
    'Modo cronometrado',
    'Padrões complexos'
  ],
  'https://youtube.com/shorts/Jp2nogIj92Q',
  4.7
);

-- Atualizar timestamps
UPDATE activities SET created_at = NOW() WHERE video_url IS NOT NULL;

-- Verificar quantas atividades foram adicionadas
SELECT 'Novas atividades criadas:' as info, COUNT(*) as count 
FROM activities 
WHERE video_url IN (
  'https://youtube.com/shorts/lSdHl6KzzOE',
  'https://youtube.com/shorts/dNnWu-QgSvQ',
  'https://youtube.com/shorts/QpAXeeZ-0OA',
  'https://youtube.com/shorts/yMdhre4XgWk',
  'https://youtube.com/shorts/piQiioUe0pA',
  'https://youtube.com/shorts/DBHiKEe4r3I',
  'https://youtube.com/shorts/4UrFCSf-Clc',
  'https://youtube.com/shorts/iONblHDrKEs',
  'https://youtube.com/shorts/u0LDZ6zC8tE',
  'https://youtube.com/shorts/a6aUfpJm82Y',
  'https://youtube.com/shorts/CUkB1y18zeo',
  'https://youtube.com/shorts/7HUmOeN0aB8',
  'https://youtube.com/shorts/WXdRG8rdjqU',
  'https://youtube.com/shorts/DKMEQb3ucKI',
  'https://youtube.com/shorts/Jp2nogIj92Q'
);
