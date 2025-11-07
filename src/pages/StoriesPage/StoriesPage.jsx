import React, { useState, useEffect } from 'react'
import { ArrowLeft, Clock, BookOpen, Smile, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StoriesPage = () => {
  const navigate = useNavigate()
  const [selectedStory, setSelectedStory] = useState(null)
  const [stories, setStories] = useState([])

  // Carregar histórias do localStorage ou usar dados padrão
  useEffect(() => {
    const defaultStories = getDefaultStories()
    const savedStories = localStorage.getItem('brincafacil-stories')
    
    // IDs das histórias que foram removidas (1-5)
    const removedStoryIds = [1, 2, 3, 4, 5]
    
    // Sempre começar com as histórias padrão atualizadas
    let finalStories = [...defaultStories]
    
    if (savedStories) {
      try {
        const parsedStories = JSON.parse(savedStories)
        // Filtrar histórias removidas e adicionar apenas histórias customizadas do usuário
        parsedStories.forEach(savedStory => {
          // Não adicionar histórias removidas (ids 1-5) e não adicionar duplicatas
          if (!removedStoryIds.includes(savedStory.id) && !defaultStories.find(ds => ds.id === savedStory.id)) {
            finalStories.push(savedStory)
          }
        })
      } catch (e) {
        console.error('Erro ao carregar histórias:', e)
      }
    }
    
    // Atualizar sempre com as histórias padrão mais recentes
    setStories(finalStories)
    localStorage.setItem('brincafacil-stories', JSON.stringify(finalStories))
  }, [])

  const getDefaultStories = () => {
    return [
      {
        id: 6,
        title: 'Rei Leão',
        image: '🦁',
        image_url: '/Historia/Historinha-o-Rei-Leao-Historia-Para-Dormir.webp',
        readingTime: 12,
        age: '3+',
        rating: 4.9,
        category: 'Histórias para dormir',
        description: 'Aslan é o Rei Leão da Pride Lands, corajoso e sábio. Uma história inspiradora sobre liderança, coragem e o verdadeiro significado de ser rei.',
        gradient: 'from-orange-500 to-yellow-400',
        bgGradient: 'from-orange-100 to-yellow-50',
        content: `Na vasta e ensolarada savana africana, onde a terra vermelha se encontrava com o céu azul infinito, reinava um leão majestoso chamado Aslan. Aslan não era apenas um leão, ele era o Rei Leão, o líder orgulhoso e protetor de toda a Pride Lands.

Aslan era forte como uma rocha, corajoso como o sol nascente e possuía uma juba dourada e exuberante que brilhava como ouro sob a luz do sol. Sua juba era tão vasta e imponente que parecia uma coroa, um símbolo de sua realeza e sabedoria. Todos os animais da Pride Lands admiravam e respeitavam Aslan, pois sabiam que ele era justo, bondoso e sempre colocaria o bem-estar de seu reino em primeiro lugar.

Desde pequeno, Aslan foi treinado para ser rei. Seu pai, o antigo e sábio Rei Mufasa, o ensinou sobre a importância do ciclo da vida, a responsabilidade de proteger os mais fracos e a necessidade de governar com justiça e compaixão. Aslan amava seu pai e se esforçava para seguir seus passos, mas ele também sabia que precisava encontrar seu próprio caminho para ser um bom rei.

Aslan tinha um melhor amigo, um suricate esperto e engraçado chamado Timba. Timba sempre estava ao lado de Aslan, oferecendo conselhos sábios e piadas engraçadas para aliviar a tensão. Timba era leal e corajoso, e Aslan confiava nele mais do que em qualquer outro.

Um dia, uma grande seca atingiu a Pride Lands. A água secou, a grama ficou marrom e os animais começaram a passar fome. Aslan sabia que precisava fazer algo para salvar seu reino. Ele reuniu todos os animais e anunciou que faria uma longa jornada em busca de água.

A jornada foi longa e perigosa. Aslan e Timba enfrentaram tempestades de areia, rios caudalosos e predadores famintos. Mas Aslan nunca desistiu. Ele sabia que seu povo dependia dele, e ele não os decepcionaria.

Em uma noite escura e fria, Aslan e Timba se perderam na savana. Eles estavam cansados, famintos e desanimados. Timba começou a duvidar se eles algum dia encontrariam água.

— Aslan, talvez devêssemos voltar — disse Timba, com a voz trêmula. — Talvez não haja água para encontrar.

Aslan olhou para Timba com seus olhos dourados e disse:

— Timba, eu sei que você está cansado, mas não podemos desistir. Nosso povo precisa de nós. Eu prometi que encontraria água, e eu vou cumprir minha promessa.

Aslan respirou fundo e rugiu com toda a sua força. Seu rugido ecoou pela savana, assustando os animais próximos. Mas, de repente, algo aconteceu. Uma pequena coruja, assustada com o rugido de Aslan, voou para o alto e começou a piar freneticamente.

— Silêncio, pequena coruja — disse Aslan, gentilmente. — O que te aflige?

A coruja apontou com a asa para uma direção distante e disse:

— Água! Há água por ali! Um oásis escondido!

Aslan e Timba seguiram a coruja até um vale escondido, onde encontraram um lindo oásis com água fresca e abundante. Aslan rugiu de alegria e agradeceu à coruja por sua ajuda.

Aslan e Timba levaram a água de volta para a Pride Lands, salvando seu reino da seca. Os animais ficaram gratos e alegres, e Aslan foi aclamado como um herói.

A partir desse dia, Aslan se tornou um rei ainda mais sábio e amado. Ele aprendeu que a coragem não é apenas sobre força física, mas também sobre perseverança, esperança e a capacidade de ouvir os outros. Ele continuou a governar com justiça e compaixão, protegendo os mais fracos e garantindo que todos os animais da Pride Lands vivessem em paz e harmonia.

E assim, Aslan, o leão forte, corajoso e com uma bela juba dourada, viveu para sempre em seus corações, um exemplo de liderança, bondade e amor pela sua terra e pelo seu povo. E sua história, contada de geração em geração, ensinou a todos que, com coragem, sabedoria e um coração bondoso, é possível superar qualquer obstáculo e construir um mundo melhor para todos.`
      },
      {
        id: 7,
        title: 'O Concurso de Música da Fazenda',
        image: '🎵',
        image_url: '/Historia/Historinha-O-Concurso-de-Musica-da-Fazenda-Historia-Para-Dormir.webp',
        readingTime: 11,
        age: '3+',
        rating: 4.8,
        category: 'Histórias sobre amizade',
        description: 'Os animais da Fazenda Paraíso participam de um concurso de música. Uma história encantadora sobre trabalho em equipe, colaboração e transformar diferenças em beleza.',
        gradient: 'from-orange-400 to-yellow-500',
        bgGradient: 'from-orange-50 to-yellow-100',
        content: `Na ensolarada Fazenda Paraíso, os animais viviam em harmonia e alegria. A vaca Margarida dedilhava melodias suaves no seu banjo, o porco Pipo era um mestre do trombone, a ovelha Olívia cantava baladas doces com sua voz aveludada e o galo Gaudêncio, claro, era o maestro natural, regendo tudo com seus cocoricós rítmicos.

Um dia, uma alegre notícia chegou à fazenda através da coruja carteira, Olívia: a cidade vizinha, Vale Verde, estava organizando o primeiro Concurso de Música Rural! O prêmio era uma farta cesta de petiscos deliciosos e a honra de se apresentar na Festa da Colheita.

A notícia causou um rebuliço na Fazenda Paraíso. A ambição musical de cada animal se acendeu como uma fogueira. "Devemos participar!", exclamou Margarida, afinando seu banjo. "A Fazenda Paraíso precisa mostrar seu talento!"

Gaudêncio, sempre entusiasmado, concordou prontamente. "Formaremos uma banda! E venceremos esse concurso!", declarou ele com um cocoricó confiante.

A tarefa seguinte era decidir quem faria parte da banda e qual seria o estilo da música. E foi aí que os problemas começaram. Pipo insistia em tocar apenas jazz no trombone, argumentando que era a música mais sofisticada. Olívia queria cantar apenas baladas românticas, alegando que eram as mais emocionantes. Margarida defendia o bluegrass animado, afirmando que era a música mais divertida. Gaudêncio, por sua vez, queria uma mistura de tudo, um verdadeiro espetáculo musical.

Os ensaios se tornaram um caos. Pipo soprava seu trombone com força, interrompendo as baladas suaves de Olívia. Margarida dedilhava seu banjo em ritmo acelerado, destoando completamente do jazz de Pipo. Gaudêncio tentava reger a confusão, mas seus cocoricós se perdiam no meio da cacofonia.

Os outros animais da fazenda, que antes apreciavam a música, começaram a fugir dos ensaios. Até mesmo o Gato Miaumiau, conhecido por sua paciência infinita, se escondia no celeiro com as orelhas tapadas.

Percebendo que as coisas não estavam indo bem, a velha tartaruga Sabina, a mais sábia da fazenda, chamou todos para uma conversa. "Meus queridos", disse Sabina com sua voz calma e lenta. "A música deve unir, não separar. Vocês precisam encontrar um jeito de trabalhar juntos e valorizar as qualidades de cada um."

Os animais se entreolharam, envergonhados. Sabina estava certa. Eles estavam tão focados em seus próprios gostos musicais que se esqueceram do verdadeiro espírito da música: a colaboração e a diversão.

Gaudêncio teve uma ideia. "Que tal criarmos uma música que combine todos os nossos estilos?", sugeriu ele. "Podemos começar com uma balada suave de Olívia, adicionar o jazz de Pipo no meio, o bluegrass de Margarida no final e eu posso reger tudo com meus cocoricós rítmicos."

A ideia foi recebida com entusiasmo. Os animais começaram a trabalhar juntos, experimentando diferentes combinações e melodias. Pipo aprendeu a suavizar seu jazz para complementar a balada de Olívia. Margarida encontrou um jeito de adaptar seu bluegrass para se encaixar no ritmo do jazz. Olívia descobriu que sua voz soava ainda mais linda quando combinada com o som do trombone e do banjo.

Os ensaios se tornaram divertidos e criativos. Os animais riam, brincavam e se apoiavam mutuamente. A música começou a fluir naturalmente, unindo seus corações em uma melodia harmoniosa.

Finalmente, o dia do Concurso de Música Rural chegou. Os animais da Fazenda Paraíso subiram ao palco, nervosos mas confiantes. Gaudêncio se posicionou à frente, estufou o peito e deu o sinal de início.

Olívia começou cantando uma balada doce e emocionante, sua voz aveludada preenchendo o ar. Em seguida, Pipo entrou com um solo de trombone suave e sofisticado, adicionando um toque de jazz à melodia. Margarida assumiu o palco com seu banjo, tocando um bluegrass animado e contagiante, fazendo o público bater os pés. Gaudêncio regeu tudo com seus cocoricós rítmicos, mantendo o ritmo e a harmonia da música.

A combinação dos estilos musicais era surpreendente e encantadora. O público aplaudiu, gritou e dançou ao som da música da Fazenda Paraíso. A energia era contagiante, e todos sentiram a alegria e a paixão que os animais colocavam em sua apresentação.

Quando a música terminou, o silêncio pairou no ar por alguns segundos, seguido por uma explosão de aplausos e gritos de alegria. Os animais da Fazenda Paraíso se abraçaram, emocionados e orgulhosos.

E então, o anúncio final: "E os vencedores do primeiro Concurso de Música Rural são… a Fazenda Paraíso!"

Os animais da Fazenda Paraíso vibraram de alegria. Eles correram para o palco para receber sua cesta de petiscos deliciosos e o troféu de campeões. Mas a maior recompensa foi a união, a amizade e a alegria que a música lhes proporcionou.

Na Festa da Colheita, a banda da Fazenda Paraíso se apresentou novamente, encantando o público com sua música única e harmoniosa. E a partir daquele dia, a Fazenda Paraíso ficou ainda mais famosa por sua música, sua alegria e sua capacidade de transformar diferenças em beleza. E assim, todos os animais viveram felizes para sempre, cantando e tocando juntos, celebrando a magia da música e a força da amizade.`
      },
      {
        id: 8,
        title: 'A Lebre e a Tartaruga',
        image: '🐢',
        image_url: '/Historia/Historinha-A-Lebre-e-a-Tartaruga-Historia-Para-Dormir.webp',
        readingTime: 8,
        age: '3+',
        rating: 4.9,
        category: 'Histórias clássicas',
        description: 'A clássica fábula de Laura, a lebre veloz, e Téo, a tartaruga determinada. Uma história sobre perseverança, humildade e o valor da persistência.',
        gradient: 'from-yellow-400 to-orange-500',
        bgGradient: 'from-yellow-50 to-orange-100',
        content: `Era uma vez, numa floresta encantada, onde a natureza vibrava com suas cores exuberantes e os animais viviam em harmonia, que duas criaturas distintas, Laura, uma lebre veloz e brincalhona, e Téo, uma tartaruga serena e determinada, compartilhavam seus dias.

Laura era reconhecida por sua agilidade e vivacidade. Desde os primeiros dias, ela corria pelos campos, exibindo sua destreza e habilidade, enquanto Téo, com sua casca resistente e passos vagarosos, explorava o mundo ao seu ritmo tranquilo.

A lebre Laura costumava orgulhar-se de sua velocidade, zombando dos outros animais por serem mais lentos. Enquanto isso, Téo, a tartaruga, apreciava cada passo que dava, concentrando-se na jornada em vez da velocidade.

Certo dia, Laura estava tagarelando sobre sua velocidade, espalhando sua arrogância pela floresta. Ela se gabava de como ninguém poderia superá-la numa corrida. Todos os animais se cansavam de ouvir suas palavras, mas Téo, a tartaruga, ouvia com serenidade, sem se deixar abalar.

Com o tempo, as brincadeiras de Laura começaram a irritar os outros animais. Então, um sábio búfalo, cansado de sua arrogância, propôs um desafio inusitado: uma corrida entre Laura e Téo, atravessando a floresta até uma árvore distante, onde uma bandeira seria o ponto final.

Laura gargalhou com a ideia. Ela não conseguia entender como a tartaruga poderia competir em uma corrida. A lebre aceitou o desafio com entusiasmo, enquanto Téo, confiante em sua determinação, concordou sem hesitar.

A notícia se espalhou pela floresta, e todos os animais aguardavam ansiosos pelo dia da corrida. Laura, confiante em sua vitória, zombava da tartaruga, enquanto Téo mantinha a serenidade, concentrando-se em sua preparação.

Finalmente, o grande dia chegou. A linha de partida foi estabelecida e todos os animais se reuniram para assistir à corrida. O búfalo deu o sinal e as duas criaturas partiram em direção à árvore distante.

Laura disparou na frente, deixando Téo para trás. Ela corria tão rapidamente que nem percebia o cansaço que começava a surgir. Ela estava tão confiante em sua vitória que decidiu fazer uma pausa para descansar e se divertir ao longo do caminho.

Enquanto isso, Téo avançava com passos firmes e constantes. Ela não se importava com a velocidade da lebre, pois sabia que sua determinação a levaria ao seu destino. A tartaruga seguiu em frente, sem se deixar abater pela distância que ainda faltava.

Quando Laura finalmente chegou à metade do percurso, ela olhou para trás e não viu a tartaruga. Confusa, decidiu descansar mais um pouco, aproveitando o tempo para algumas brincadeiras. A confiança da lebre era tamanha que ela até cochilou um pouco.

Enquanto isso, Téo avançava lentamente, focada em alcançar seu objetivo. Ela não se preocupava com a distração da lebre ou com o tempo que passava. Sua determinação era sua maior força.

Quando Laura acordou, percebeu que estava atrasada e correu o mais rápido que pôde em direção à árvore final. Para sua surpresa, ao chegar lá, encontrou Téo já esperando por ela, com um sorriso calmo no rosto.

Laura estava atônita. Ela não conseguia entender como a tartaruga havia chegado antes dela. Téo explicou serenamente que havia avançado de forma constante, sem se deter, e alcançado seu destino.

Os animais que assistiram à cena aplaudiram Téo pela sua determinação e disciplina. Eles aprenderam uma valiosa lição com a história: nem sempre é a velocidade que importa, mas a persistência, a determinação e a concentração ao longo do caminho.

Laura percebeu humildemente que sua arrogância a tinha levado à derrota. Ela aprendeu a valorizar não apenas sua velocidade, mas também a persistência e a paciência de Téo. A partir daquele dia, a lebre se tornou mais respeitosa e aprendeu a apreciar cada passo de sua jornada.

E assim, naquela floresta, a lebre Laura e a tartaruga Téo se tornaram grandes amigos, valorizando as diferenças um do outro e compreendendo a importância de não subestimar o potencial de alguém baseado apenas na aparência ou na velocidade.`
      },
      {
        id: 9,
        title: 'O Caracol Valente',
        image: '🐌',
        image_url: '/Historia/Historinha-O-Caracol-Valente-Historia-Para-Dormir.webp',
        readingTime: 6,
        age: '2+',
        rating: 4.8,
        category: 'Histórias sobre perseverança',
        description: 'Carlos é um caracol que sonha em chegar ao topo da colina para ver a flor dourada. Uma história inspiradora sobre determinação, coragem e nunca desistir dos sonhos.',
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-100',
        content: `Era uma vez um pequeno caracol chamado Carlos que vivia em um jardim cheio de flores coloridas. Carlos era diferente dos outros caracóis porque ele se movia mais devagar do que todos. Enquanto seus amigos deslizavam rapidamente de uma folha para outra, Carlos ficava para trás, sempre no seu próprio ritmo.

Apesar de sua lentidão, Carlos tinha um grande sonho: ele queria chegar ao topo da grande colina no centro do jardim, onde havia uma bela flor dourada que brilhava como o sol. Todos os dias, Carlos olhava para a colina e se imaginava alcançando a flor dourada, mas os outros caracóis riam dele.

"Você nunca vai conseguir, Carlos! É muito longe e você é muito devagar!" eles diziam.

Mas Carlos não deixava as palavras desanimadoras dos outros o afetarem. Ele sabia que sua jornada seria longa e cheia de desafios, mas também sabia que, se desistisse, nunca realizaria seu sonho.

E assim, certo dia, Carlos começou sua aventura em direção à colina. No caminho, ele enfrentou obstáculos que pareciam impossíveis de superar: pedras grandes, poças d'água e até folhas caídas que eram gigantes comparadas ao seu tamanho. Às vezes, o cansaço quase o fazia parar, mas Carlos sempre lembrava de seu sonho e seguia em frente, um passo de cada vez.

Dias se passaram, e Carlos continuava a subir, devagar, mas sempre firme. Ele encontrou outros animais pelo caminho, como uma formiga trabalhadora que o ajudou a atravessar uma grande poça e uma borboleta gentil que lhe ofereceu sombra durante um dia quente.

Finalmente, após muitos dias de perseverança, Carlos chegou ao topo da colina. Lá, ele viu a flor dourada brilhando intensamente, e uma onda de felicidade encheu seu pequeno coração. Ele havia conseguido! Todo o esforço, todas as dificuldades enfrentadas valeram a pena.

Quando os outros caracóis viram Carlos no topo da colina, ficaram espantados e se sentiram inspirados pela sua determinação. Eles perceberam que, apesar de todas as dificuldades, Carlos nunca desistiu de seu sonho, e isso o levou a alcançar algo extraordinário.

A partir daquele dia, Carlos não foi mais visto como o caracol lento, mas como o caracol que nunca desistia, aquele que mostrou a todos que, com coragem, perseverança e um coração cheio de sonhos, qualquer um pode alcançar o impossível.

E assim, o pequeno caracol Carlos tornou-se uma inspiração para todos no jardim, mostrando que a verdadeira força vem de nunca desistir, mesmo quando o caminho é difícil.`
      },
      {
        id: 10,
        title: 'Noite de São João',
        image: '🔥',
        image_url: '/Historia/Historinha-Noite-de-Sao-Joao-em-Pdf.webp',
        readingTime: 9,
        age: '3+',
        rating: 4.9,
        category: 'Histórias sobre tradições',
        description: 'Mariana ama a festa de São João e descobre a lenda antiga sobre o nascimento de São João Batista. Uma história encantadora sobre tradições, comunidade e a magia das festas juninas.',
        gradient: 'from-orange-500 to-red-500',
        bgGradient: 'from-orange-50 to-red-100',
        content: `Era uma vez, numa pequena vila aninhada entre montanhas verdejantes, uma menina chamada Mariana. Mariana amava as festas juninas mais do que qualquer outra coisa no mundo. E, de todas as festas juninas, a Noite de São João era a sua favorita.

Mariana adorava tudo na Noite de São João: o cheiro da fogueira crepitando, o sabor do milho assado, a alegria das quadrilhas, o colorido das bandeirinhas balançando ao vento e, acima de tudo, a magia que pairava no ar.

Na vila de Mariana, a Noite de São João era uma celebração grandiosa. Todos se reuniam na praça principal, enfeitada com bandeirinhas de todas as cores, para dançar, comer e se divertir. As crianças vestiam roupas caipiras, com remendos coloridos e chapéus de palha, e os adultos se juntavam à festa com a mesma alegria.

Este ano, a Noite de São João prometia ser ainda mais especial. Dona Aurora, a contadora de histórias da vila, havia prometido contar uma lenda antiga sobre a origem da festa. Mariana estava ansiosa para ouvir a história e descobrir os segredos da Noite de São João.

Quando a noite finalmente chegou, Mariana vestiu seu vestido caipira, enfeitado com fitas e flores, e correu para a praça. A fogueira já estava acesa, iluminando os rostos sorridentes das pessoas. O cheiro de pipoca e quentão pairava no ar, e a música da quadrilha convidava a todos para dançar.

Mariana encontrou seus amigos, João e Clara, e juntos eles foram procurar Dona Aurora. A contadora de histórias estava sentada em um banquinho, rodeada de crianças curiosas. Quando Mariana e seus amigos se aproximaram, Dona Aurora sorriu e começou a contar a lenda da Noite de São João.

"Há muitos e muitos anos", começou Dona Aurora, "quando o mundo ainda era jovem e as estrelas brilhavam com mais intensidade, uma jovem chamada Isabel estava grávida de seu primeiro filho. Isabel morava nas montanhas, em uma casa simples, e esperava ansiosamente a chegada do bebê."

"Como era costume na época, Isabel precisava avisar sua prima, Maria, que morava em uma vila distante, sobre o nascimento do bebê. Mas como as montanhas eram altas e os caminhos eram longos, Isabel precisava de um sinal que pudesse ser visto de longe."

"Então, Isabel pediu a seu marido, Zacarias, que acendesse uma grande fogueira no topo da montanha quando o bebê nascesse. Assim, Maria saberia que o bebê havia chegado e poderia ir visitá-la."

"E assim aconteceu. Quando o bebê nasceu, Zacarias acendeu uma grande fogueira no topo da montanha. A fogueira era tão grande e brilhante que podia ser vista de todas as partes da vila. Maria viu o sinal e soube que Isabel havia dado à luz um menino, que foi chamado de João Batista."

"Desde então, as pessoas acendem fogueiras na Noite de São João para lembrar o nascimento de São João Batista e o sinal que Isabel enviou a Maria. As fogueiras simbolizam a luz, a esperança e a alegria da vida."

Mariana, João e Clara ouviram a história com atenção, maravilhados com a beleza da lenda. Eles entenderam por que a Noite de São João era tão especial e por que as pessoas acendiam fogueiras, dançavam quadrilhas e se reuniam para celebrar.

Depois da história, Mariana e seus amigos foram dançar quadrilha. Eles se juntaram aos outros casais e seguiram os passos da dança, guiados pelo marcador. Eles riram, cantaram e se divertiram muito.

Mais tarde, eles comeram milho assado, pipoca e quentão. Eles brincaram de pescaria, jogaram argolas e tentaram acertar o alvo na boca do palhaço. Eles ganharam brindes, prêmios e muitos sorrisos.

Quando a noite chegou ao fim, Mariana se despediu de seus amigos e voltou para casa. Ela estava cansada, mas feliz. Ela havia aprendido uma lição importante sobre a história e as tradições de sua vila.

Ao deitar na cama, Mariana olhou pela janela e viu a fogueira ainda crepitando na praça. Ela sorriu, lembrando da lenda de Isabel e Zacarias e do nascimento de São João Batista. Ela sabia que a Noite de São João era muito mais do que uma festa: era uma celebração da vida, da fé e da comunidade.

E, enquanto dormia, Mariana sonhou com fogueiras brilhantes, bandeirinhas coloridas e quadrilhas animadas. Ela sonhou com a magia da Noite de São João e com a alegria de celebrar as tradições de sua vila. Ela sabia que, no próximo ano, estaria de volta à praça, dançando, cantando e se divertindo na Noite de São João. Porque, para Mariana, a Noite de São João era a noite mais mágica do ano.`
      },
      {
        id: 11,
        title: 'O Leão Medroso',
        image: '🦁',
        image_url: '/Historia/Historinha-O-Leao-Medroso-Historia-Infantil-Para-Dormir.webp',
        readingTime: 7,
        age: '3+',
        rating: 4.8,
        category: 'Histórias sobre coragem',
        description: 'Leo é um leão diferente: ele tem medo de muitas coisas. Mas quando encontra um elefantinho perdido, descobre que a verdadeira coragem é agir mesmo com medo.',
        gradient: 'from-orange-500 to-yellow-400',
        bgGradient: 'from-orange-100 to-yellow-50',
        content: `Era uma vez, na vasta savana africana, um leão chamado Leo. Ao contrário de outros leões, que eram corajosos e destemidos, Leo era muito medroso. Ele tinha medo de trovões, de águas profundas e, mais do que tudo, do escuro. Os outros animais da savana muitas vezes riam dele e o chamavam de "Leo, o Medroso".

Um dia, enquanto Leo estava descansando em sua caverna, ele ouviu um choro distante. Curioso e preocupado, ele decidiu seguir o som. Chegando a uma clareira, Leo encontrou um pequeno elefante preso em um arbusto espinhoso.

"Por favor, me ajude!", implorou o elefantinho. "Eu me perdi do meu bando e estou com muito medo."

Apesar de seu próprio medo, Leo sentiu compaixão pelo elefantinho. Ele sabia que precisava ser corajoso, mesmo que fosse apenas por um momento. Então, ele cuidadosamente começou a puxar os espinhos para liberar o pequeno elefante.

"Não se preocupe", disse Leo com uma voz suave. "Eu vou te ajudar a encontrar sua família."

Depois de libertar o elefantinho, Leo se ofereceu para acompanhá-lo até a beira da floresta, onde o bando de elefantes costumava passar. No caminho, eles encontraram muitos desafios: atravessar um rio profundo, enfrentar um trovão repentino e caminhar pela escuridão da noite. Leo sentia seu coração bater rápido de medo, mas ele não desistiu.

Cada vez que o elefantinho ficava assustado, Leo se lembrava de que ele era a única esperança do pequeno elefante. Isso lhe dava coragem para seguir em frente. Finalmente, depois de uma longa jornada, eles encontraram o bando de elefantes. A mãe do elefantinho, com lágrimas de alegria, agradeceu a Leo.

"Você foi muito corajoso", disse ela. "Nunca esquecerei o que você fez por nós."

Leo percebeu que, embora tivesse medo de muitas coisas, ele era capaz de ser corajoso quando mais importava. Ele aprendeu que a verdadeira coragem não é a ausência de medo, mas a capacidade de agir apesar do medo.

Quando Leo voltou para a savana, os outros animais ficaram surpresos ao ouvir sobre sua bravura. Eles nunca mais riram de Leo e passaram a chamá-lo de "Leo, o Valente". E assim, Leo descobriu que todos têm medo de algo, mas enfrentar esses medos pode nos tornar mais fortes e corajosos do que jamais imaginamos.

E, a partir daquele dia, Leo viveu feliz e confiante, sabendo que a verdadeira coragem vem de dentro.`
      },
      {
        id: 12,
        title: '101 Dalmatas',
        image: '🐕',
        image_url: '/Historia/historinha-101-dalmatas-historia-para-dormir.webp',
        readingTime: 10,
        age: '4+',
        rating: 4.9,
        category: 'Histórias clássicas',
        description: 'Pongo e Perdita são dois dálmatas que precisam resgatar seus filhotes sequestrados pela excêntrica Cruella De Vil. Uma aventura emocionante sobre coragem, lealdade e amor incondicional.',
        gradient: 'from-blue-400 to-purple-500',
        bgGradient: 'from-blue-50 to-purple-100',
        content: `Nos subúrbios de Londres, em uma charmosa casa vitoriana, viviam dois adoráveis dálmatas, Pongo e Perdita, ao lado de seus donos, Roger e Anita. Pongo, um dálmata brincalhão e inteligente, adorava a companhia de seu dono, Roger, um talentoso compositor musical. Enquanto isso, Perdita, uma dálmata afetuosa e leal, desfrutava da vida ao lado de Anita, uma talentosa designer de moda.

A vida tranquila desses dálmatas mudou quando Anita foi visitada por uma antiga colega de escola, a excêntrica Cruella De Vil. Cruella, conhecida por seu amor por peles de animais, chegou em um carro extravagante, coberta por peles exóticas e acompanhada por dois capangas desajeitados. Ela expressou seu interesse em comprar os filhotes dálmatas que Pongo e Perdita estavam esperando.

Roger e Anita, encantados com seus cachorros, recusaram a oferta. Porém, Cruella não era conhecida por aceitar um "não" como resposta. Determinada a obter os filhotes de dálmatas, ela não desistiu da ideia. O nascimento dos filhotes foi uma festa na casa de Roger e Anita, mas a felicidade logo se transformou em preocupação quando Cruella soube que os filhotes haviam nascido.

Uma noite, enquanto Roger e Anita estavam fora, Cruella, com a ajuda de seus capangas, Horácio e Gaspar, invadiu a casa e sequestrou os filhotes dálmatas, deixando Pongo e Perdita devastados. Os dálmatas, angustiados e desesperados, buscavam uma maneira de encontrar seus filhotes perdidos.

Pongo, conhecido por sua inteligência e coragem, teve uma ideia brilhante. Durante seus passeios matinais, ele percebeu que todos os filhotes dálmatas pareciam iguais, o que significava que eles poderiam se disfarçar e passar despercebidos entre os inúmeros dálmatas de Londres. Pongo decidiu que eles iriam resgatar seus filhotes e, para isso, precisavam da ajuda de outros animais.

Com a ajuda do cão da fazenda, Coronel, e do cavalo Capitão, Pongo e Perdita embarcaram em uma jornada pela cidade em busca de seus filhotes. Enquanto isso, os capangas de Cruella, Horácio e Gaspar, tinham a tarefa de reunir 101 dálmatas para transformá-los em casacos de pele.

A busca dos dálmatas pela cidade foi repleta de aventuras e desafios. Eles encontraram outros animais que se uniram à causa, incluindo um grupo de cachorros da cidade liderados por um velho vira-lata chamado Fiel. Juntos, eles enfrentaram diversos obstáculos, desde escapar de perigosas armadilhas até despistar os capangas de Cruella.

Enquanto isso, os filhotes dálmatas estavam presos em uma mansão sombria e distante, aguardando seu destino cruel nas mãos de Cruella. Porém, com a astúcia e determinação dos dálmatas pais, e a ajuda dos amigos que fizeram ao longo da jornada, eles estavam um passo mais perto de salvar os filhotes.

A busca emocionante culminou em um confronto final na mansão de Cruella, onde os dálmatas conseguiram libertar seus filhotes e mais 84 dálmatas que estavam presos lá. Com a ajuda de um golpe de sorte e a confusão causada pelos cachorros, Cruella e seus capangas foram capturados pela polícia.

No final, todos os dálmatas, incluindo Pongo, Perdita e seus filhotes, voltaram para casa com Roger e Anita, onde receberam amor e cuidados. A casa estava cheia de felicidade e os dálmatas eram uma grande família unida, celebrando sua vitória e aprendendo o verdadeiro significado da coragem, lealdade e amor incondicional.`
      },
      {
        id: 13,
        title: 'O Jardim das Quatro Irmãs',
        image: '🌸',
        image_url: '/Historia/historinha-o-jardim-das-quatro-irmas-historia-para-dormir.webp',
        readingTime: 9,
        age: '3+',
        rating: 4.9,
        category: 'Histórias sobre amizade',
        description: 'Primavera, Verão, Outono e Inverno são quatro irmãs que competem para ver quem é mais importante. Uma história encantadora sobre união, trabalho em equipe e o valor das diferenças.',
        gradient: 'from-pink-400 to-purple-500',
        bgGradient: 'from-pink-50 to-purple-100',
        content: `Em um lugar muito distante, existia um lindo jardim que estava sempre verde e florido. Neste jardim, moravam quatro irmãs encantadas: Primavera, Verão, Outono e Inverno. Cada uma delas tinha um jeitinho especial de cuidar do jardim e, por causa disso, estavam sempre competindo para ver quem era a mais importante.

Primavera, a mais velha, era cheia de flores coloridas. Ela adorava ver as flores brotarem e as árvores florescerem. Com seus vestidos floridos e um chapéu feito de pétalas, ela caminhava pelo jardim, deixando um rastro de perfumes e cores ao seu passar.

Verão, a segunda irmã, era p cheia de energia. Seu sorriso brilhava como o sol e sua risada era contagiante. Ela gostava de aquecer o jardim com seus raios quentes e de trazer as frutas doces. Verão sempre estava cercada de borboletas e passarinhos que vinham brincar com ela.

Outono, a terceira irmã, era a mais calma e tranquila. Com seus trajes de folhas douradas e laranja, ela adorava ver as árvores mudarem de cor e as folhas dançarem ao vento. Outono gostava de preparar a terra para o inverno, compartilhando suas folhas caídas como um manto suave que cobria o jardim.

Inverno, a mais nova, era cheia de mistério. Com seu vestido de neve e um gorro feito de flocos de gelo, ela celebrava o frio com a beleza de seu manto branco. Inverno adorava construir bonecos de neve e fazer os animais do jardim se aconchegarem em suas casinhas quentes.

Embora essas irmãs compartilhassem o mesmo jardim, elas viviam brigando constantemente. "Eu sou a mais importante, porque sou a primeira que traz vida e cores!", dizia Primavera, com orgulho. "Mas eu trago o sol e as frutas doces! As pessoas me amam mais do que a você!", respondia Verão, batendo os pés no chão.

Outono, sempre serena, tentava acalmá-las: "Mas eu preparo o jardim para vocês! Sem mim, vocês não teriam seu lugar especial." E Inverno, com um olhar triste, sussurrava: "Não quero brigar. Eu só desejo trazer minha beleza também."

Certa manhã, as irmãs acordaram e perceberam que o jardim estava triste. As flores não nasciam, as folhas não caíam e, até o sol, que costumava brilhar, estava escondido atrás das nuvens cinzentas. Tudo parecia perdido. O jardim estava em silêncio, sem a alegria das cores e das risadas.

Preocupadas, as quatro irmãs se reuniram em volta de uma árvore enorme, a mais antiga do jardim. "O que está acontecendo com nosso lar?", perguntou Primavera, angustiada.

Verão tentou olhar mais de perto, mas nada mudava. Outono olhou para as folhas secas e Inverno observou a paisagem sem neve. Foi então que elas perceberam: estavam tão focadas em seus próprios dons que se esqueceram de que o verdadeiro poder estava na união.

Sentindo a tristeza do jardim, as irmãs decidiram tentar algo diferente. "E se fizéssemos algo juntas?", sugeriu Outono, com seus olhos brilhando de esperança. "Podemos unir nossas belezas, em vez de competir."

Elas começaram a trabalhar em equipe. Primavera trouxe suas flores coloridas e plantou-as ao redor das árvores. Verão, cheia de energia, trouxe seu calor e acelerou o crescimento das plantas. Outono decorou tudo com suas folhas encantadas, criando um tapete suave de cores e texturas.

Por fim, Inverno, que costumava ser tímida, resolveu fazer algo especial. Com um gesto delicado, ela espalhou flocos de neve sobre o jardim, cobrindo tudo com um manto de brilho. "Essa neve vai refletir o sol quando ele voltar", disse ela, sorrindo.

A mágica começou a acontecer! Com o calor do Verão, a neve derreteu lentamente, fazendo pequenas gotículas brilhantes que pareciam estrelas caindo do céu. As flores de Primavera começaram a brotar, as árvores de Outono balançaram suavemente e, aos poucos, o sol entrou em cena, iluminando o jardim e suas novas criações.

Todos os seres do jardim – aves, borboletas e até os pequenos insetos – voltaram felizes, dançando entre as flores e folhas. Logo, o jardim estava mais lindo do que nunca. As quatro irmãs admiravam seu trabalho conjunto, maravilhadas com a beleza que haviam criado.

"Olha como nosso jardim brilha!", exclamou Verão, encantada. "Sim!", respondeu Primavera, segurando a mão de Inverno. "Juntas, somos mais fortes!"

A partir daquele dia, as irmãs aprenderam o valor da união. Elas entenderam que a beleza do mundo vinha não apenas das diferenças de cada uma, mas do que podiam fazer juntas. E assim, o Jardim das Quatro Irmãs tornou-se um lugar de alegria, onde cada estação tinha sua importância e todas eram especiais.

E toda vez que as flores brotavam, o sol brilhava e a neve caía, as irmãs lembravam-se de que, no coração do jardim, a verdadeira magia estava na amizade e respeito mútuo.

E a moral da história é: a beleza do mundo está na união das diferenças, e quando trabalhamos em equipe, somos capazes de coisas incríveis!`
      },
      {
        id: 14,
        title: 'Os Três Porquinhos',
        image: '🐷',
        image_url: '/Historia/historinha-os-tres-porquinhos-historia-para-dormir.webp',
        readingTime: 8,
        age: '3+',
        rating: 4.9,
        category: 'Histórias clássicas',
        description: 'Três porquinhos constroem casas diferentes quando saem de casa. Uma história clássica sobre trabalho duro, perseverança e o valor do esforço.',
        gradient: 'from-pink-400 to-orange-500',
        bgGradient: 'from-pink-50 to-orange-100',
        content: `Era uma vez uma família de porquinhos felizes que tinha três filhos. Com o tempo, os pais perceberam que os porquinhos crescidos eram demasiado dependentes. Não contribuíam nas tarefas domésticas nem demonstravam interesse em se esforçar. Em consenso, decidiram que os porquinhos deveriam viver sozinhos, já que estavam bem crescidinhos. Deram-lhes algum dinheiro e conselhos sábios. Os três porquinhos partiram para a floresta, cada um buscando construir sua própria casa.

O primeiro porquinho, o mais preguiçoso, optou por erguer uma casinha rápida que não demandasse muito esforço. Assim, construiu uma casa de palha, apesar dos alertas de seus irmãos sobre a falta de segurança.

O segundo porquinho, menos preguiçoso que o primeiro, mas também avesso ao trabalho, optou por uma casa de madeira, considerando-a prática e duradoura.

Já o terceiro porquinho, mais esperto e trabalhador, decidiu erguer uma casa de tijolos. Embora a construção levasse mais tempo, após três dias de esforço intenso, a casa ficou pronta.

Os três porquinhos ouviram falar de um lobo perigoso rondando a floresta. E logo ele apareceu, buscando uma refeição de carne suína.

O lobo bateu à porta da casa do primeiro porquinho, que, tentando intimidá-lo, disse:

"Vá embora, lobo. Você não entrará aqui."

O lobo persistiu:

"Abra esta porta ou eu soprar-ei e destruirei sua casa."

Vendo que o porquinho não abria a porta, o lobo soprou com tanta força que a casa de palha voou pelos ares. O porquinho, desesperado, correu para a casa de madeira do irmão. O lobo o seguiu, mas não conseguiu alcançá-lo.

Então o lobo bateu à porta da casa do segundo porquinho. Este, tentando intimidá-lo, disse:

"Vá embora, lobo. Na minha casa de madeira, você não entrará."

O lobo insistiu:

"Abra esta porta ou eu soprar-ei e destruirei esta casa."

Vendo que os porquinhos não abririam a porta, o lobo soprou com tanta força que a casa de madeira desabou. Os porquinhos desesperados correram para a casa de tijolos do irmão. O lobo os seguiu, mas não conseguiu alcançá-los.

Então o lobo bateu à porta da casa do terceiro porquinho. Os porquinhos, tentando intimidá-lo, cantavam:

"Quem teme o lobo mau? Grande lobo mau, grande lobo mau! Quem teme o lobo mau? Ele é um sujeito legal!"

O lobo, furioso, gritou:

"Abra esta porta agora!"

Os porquinhos responderam:

"Vá embora, lobo. Você não destruirá esta casa, pois é feita de tijolo e cimento."

O lobo persistiu:

"Abra esta porta ou eu soprar-ei e destruirei esta casa."

Vendo que os porquinhos não abririam a porta, o lobo soprou, soprou, soprou, mas a casa permaneceu intacta. Cansado, sentou-se na porta para descansar. Foi então que teve uma ideia: subiria ao telhado e entraria pela chaminé. Os porquinhos, percebendo sua artimanha, agiram imediatamente. Prepararam um grande balde de água fervente e o colocaram na ponta da chaminé, aguardando.

Quando o lobo subiu pela chaminé, caiu diretamente no balde de água fervente.

"Ai, ai, ai!!!!" – gritou o lobo, correndo para o lago para aliviar as queimaduras. Assustado, nunca mais incomodou os porquinhos.

Os porquinhos aprenderam que o esforço resulta em melhores resultados. Decidiram viver juntos e viveram felizes para sempre.`
      },
      {
        id: 15,
        title: 'O Corvo e o Jarro',
        image: '🐦‍⬛',
        image_url: '/Historia/Historinha-O-Corvo-e-o-Jarro-Historinha-Para-Dormir.webp',
        readingTime: 9,
        age: '3+',
        rating: 4.8,
        category: 'Histórias sobre perseverança',
        description: 'Cornélio é um corvo sedento que encontra água em um jarro, mas não consegue alcançá-la. Uma história inspiradora sobre criatividade, persistência e pensar fora da caixa.',
        gradient: 'from-gray-400 to-blue-500',
        bgGradient: 'from-gray-50 to-blue-100',
        content: `Era uma vez, em terras ensolaradas onde os campos dourados se encontravam com o céu azul, um corvo chamado Cornélio. Cornélio era conhecido por sua inteligência acima da média, mas também por sua impaciência. Voava pelos céus com suas penas negras brilhantes, sempre em busca de novas aventuras e, claro, de um bom bocado para saciar sua fome.

Num dia quente de verão, enquanto sobrevoava um vale seco e árido, Cornélio sentiu uma sede terrível. Sua garganta estava tão seca que ele mal conseguia coaxar. Desesperado, ele começou a procurar por água, voando de um lado para o outro, mas sem sucesso. O sol castigava a terra, e a água parecia ter desaparecido por completo.

De repente, lá no meio de um campo ressecado, Cornélio avistou algo brilhando. Era um jarro de barro, meio escondido sob a sombra de uma velha árvore. Com o coração cheio de esperança, Cornélio voou até o jarro e espiou lá dentro. Para sua alegria, havia água! Mas sua alegria logo se transformou em frustração.

O jarro era alto e estreito, e a água estava no fundo, muito abaixo do alcance do seu bico. Cornélio tentou, esticou-se o máximo que pôde, mas não conseguiu alcançar a água. Ele tentou inclinar o jarro, mas era muito pesado para ele. O corvo andava de um lado para o outro, agitado e impaciente, sem saber o que fazer.

"Que infortúnio!" exclamou Cornélio, batendo as asas em desespero. "Ter água tão perto, mas não poder alcançá-la! É uma grande injustiça!"

Cornélio pensou em desistir. Talvez devesse voar em busca de outro lugar com água, mas a sede era tão forte que ele se sentia fraco demais para voar por muito tempo. Sentou-se no chão, derrotado, e começou a observar o jarro com atenção.

Enquanto olhava para o jarro, Cornélio começou a perceber pequenas pedrinhas espalhadas ao redor. Uma ideia surgiu em sua mente. Uma ideia que poderia parecer louca, mas que valia a pena tentar.

"E se eu usasse as pedrinhas para elevar o nível da água?" pensou Cornélio. "Talvez, com paciência e persistência, eu consiga alcançar a água."

Cornélio começou a recolher as pedrinhas, uma por uma, e jogá-las dentro do jarro. Era um trabalho lento e cansativo. A cada pedrinha que caía, o nível da água subia apenas um pouquinho. Cornélio estava exausto, mas não desistiu. Ele sabia que cada pedrinha o aproximava do seu objetivo.

Outros animais que passavam por ali zombavam de Cornélio. "Olha o corvo tolo!" diziam eles. "Pensando que vai conseguir encher o jarro com pedrinhas! Que ideia ridícula!"

Cornélio ignorava os comentários maldosos e continuava a trabalhar. Ele havia aprendido que a sabedoria muitas vezes se esconde por trás da persistência e da paciência.

Depois de muito trabalho, quando o sol já começava a se pôr no horizonte, Cornélio percebeu que o nível da água estava quase no topo do jarro. Com um último esforço, ele jogou mais algumas pedrinhas e, finalmente, conseguiu alcançar a água com seu bico.

Cornélio bebeu avidamente, saciando sua sede. A água fresca e pura nunca havia lhe parecido tão deliciosa. Ele aprendeu uma lição valiosa naquele dia. A lição de que a inteligência, combinada com a persistência e a paciência, pode superar qualquer obstáculo.

Com o coração cheio de gratidão, Cornélio voou para o alto, coaxando alegremente. Sua história se espalhou por toda a região, inspirando outros animais a nunca desistirem de seus objetivos e a usarem sua inteligência para encontrar soluções criativas.

Cornélio continuou sua jornada, sempre lembrando do jarro e das pedrinhas. Ele se tornou um símbolo de sabedoria e perseverança, um exemplo de que mesmo os menores e mais simples atos podem levar a grandes conquistas. E assim, o corvo sedento, que um dia quase desistiu, tornou-se o corvo sábio, que ensinou a todos a importância da persistência e da criatividade para alcançar seus sonhos.`
      },
      {
        id: 16,
        title: 'Os 5 Patinhos',
        image: '🦆',
        image_url: '/Historia/Historinha-5-patinhos-Historia-Para-Dormir.webp',
        readingTime: 10,
        age: '3+',
        rating: 4.8,
        category: 'Histórias sobre família',
        description: 'Pata Linda e seus cinco patinhos partem para uma aventura no rio. Uma história encantadora sobre família, união, cuidado e a importância de prestar atenção.',
        gradient: 'from-blue-400 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-100',
        content: `Era uma vez, em um lago azul cintilante cercado por juncos altos e salgueiros chorões, uma pata chamada Pata Linda e seus cinco patinhos adoráveis: Quack, Pip, Pateta, Bolinha e Lelé. Cada patinho tinha sua própria personalidade peculiar. Quack era o mais corajoso, sempre liderando as aventuras. Pip era o mais curioso, sempre bicando e explorando tudo ao seu redor. Pateta era o mais brincalhão, vivendo para nadar e mergulhar. Bolinha era o mais comilão, sempre faminto por minhocas e sementes. E Lelé era o mais distraído, frequentemente se perdendo ou se encantando com borboletas.

Um dia ensolarado, Pata Linda decidiu levar seus patinhos para uma aventura no rio que desaguava no lago. Ela sabia que era importante para eles aprenderem a nadar em águas mais profundas e a se protegerem de perigos desconhecidos. "Sigam-me de perto, meus pequenos", disse ela com um grasnado suave. "Hoje, vamos explorar o rio!"

Os patinhos, animados com a perspectiva de uma nova aventura, seguiram a mãe em fila indiana. Quack, sendo o mais corajoso, liderava a fila, com o peito estufado e os olhos atentos. Pip, logo atrás, bicava as pedras na margem, procurando por insetos interessantes. Pateta dava cambalhotas na água, enquanto Bolinha nadava diligentemente, ansioso para encontrar um bom lugar para comer. Lelé, como sempre, ficava para trás, encantado com uma libélula azul que voava perto dele.

A jornada começou tranquila, com o rio calmo e a correnteza suave. Pata Linda ensinava aos seus filhotes sobre os perigos do rio, como os peixes grandes que poderiam tentar mordiscar seus pés e as pedras escorregadias que poderiam fazê-los cair. Os patinhos ouviam atentamente, absorvendo cada palavra de sua mãe.

De repente, o rio se estreitou e a correnteza se tornou mais forte. Pata Linda alertou seus filhotes para nadarem com mais força. Quack, com sua bravura, liderou o caminho, mas Pip, curioso como era, se distraiu com uma flor colorida que flutuava na água. Ele esticou o pescoço para pegá-la, mas a correnteza o arrastou para longe da mãe e dos irmãos.

"Mamãe! Socorro!", gritou Pip, desesperado.

Pata Linda, ao perceber que Pip estava em perigo, grasnou alto para os outros patinhos ficarem juntos e nadou rapidamente em direção ao filho. Com um esforço tremendo, ela conseguiu alcançar Pip e o puxou para um lugar seguro.

"Pip, meu querido, você precisa prestar mais atenção!", repreendeu Pata Linda, aliviada por tê-lo resgatado. "O rio pode ser perigoso, e você não pode se distrair assim."

Pip, assustado e arrependido, prometeu que seria mais cuidadoso. Os patinhos continuaram a nadar, com Pip mais perto da mãe do que nunca.

Mais adiante, encontraram um tronco de árvore caído que bloqueava o caminho. Pata Linda explicou que eles precisariam contornar o tronco para continuar. Quack, sempre o líder, sugeriu que eles mergulhassem por baixo do tronco.

"É muito arriscado, Quack", disse Pata Linda. "A correnteza pode nos arrastar para longe."

Pateta, sempre o brincalhão, teve uma ideia. "Podemos tentar pular por cima do tronco!", exclamou ele.

Pata Linda pensou por um momento. Era uma ideia ousada, mas poderia funcionar. "Tudo bem, vamos tentar", disse ela. "Mas tomem cuidado para não caírem."

Um por um, os patinhos tentaram pular por cima do tronco. Quack saltou com facilidade, seguido por Pip, que estava determinado a mostrar que podia ser corajoso. Pateta deu um salto espetacular, fazendo uma pirueta no ar antes de cair na água. Bolinha, com sua barriga cheia, teve um pouco mais de dificuldade, mas conseguiu superar o obstáculo com a ajuda da mãe.

Por último, foi a vez de Lelé. Distraído como sempre, ele não havia prestado atenção ao que os outros estavam fazendo. Quando chegou a sua vez, ele tentou pular sem tomar impulso e acabou caindo no rio.

"Lelé!", gritaram os outros patinhos.

Pata Linda nadou rapidamente até Lelé e o ajudou a voltar para cima do tronco. "Lelé, você precisa prestar mais atenção!", disse ela, preocupada. "Você não pode ficar se distraindo o tempo todo."

Lelé, envergonhado, prometeu que se esforçaria mais. Os patinhos finalmente conseguiram contornar o tronco e continuaram sua aventura no rio.

Depois de muitas outras aventuras e desafios superados, Pata Linda decidiu que era hora de voltar para casa. Os patinhos estavam cansados, mas felizes por terem aprendido tanto naquele dia. Eles haviam aprendido a nadar em águas mais profundas, a se protegerem de perigos e a importância de prestar atenção e ajudar uns aos outros.

Ao chegarem ao lago, os patinhos correram para seus ninhos, ansiosos para descansar. Pata Linda os observou com um sorriso orgulhoso. Ela sabia que seus filhotes ainda tinham muito a aprender, mas também sabia que eles estavam no caminho certo para se tornarem patos fortes, corajosos e sábios.

E assim, os cinco patinhos, Quack, Pip, Pateta, Bolinha e Lelé, adormeceram, sonhando com as aventuras do dia e ansiosos para explorar o mundo ao seu redor. E Pata Linda, a mãe pata amorosa, velou por eles, sabendo que o amor e a união familiar eram as maiores proteções contra os perigos do mundo.`
      },
      {
        id: 17,
        title: 'Lucas e a Dança da Chuva',
        image: '🌧️',
        image_url: '/Historia/Historinha-Lucas-e-a-Danca-da-Chuva-Historia-Infantil-Educativa.webp',
        readingTime: 6,
        age: '3+',
        rating: 4.8,
        category: 'Histórias educativas',
        description: 'Lucas é um menino curioso que descobre como a chuva se forma. Uma história educativa e encantadora sobre o ciclo da água, evaporação e a magia da natureza.',
        gradient: 'from-blue-400 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-100',
        content: `Lucas era um menino muito curioso. Ele adorava observar o céu e as mudanças do clima. Um dia, enquanto brincava no quintal, sentiu um pingo frio tocar sua bochecha. Logo em seguida, outro caiu em sua mão. Ele olhou para cima e viu nuvens escuras cobrindo o céu azul.

— Mamãe! Como a chuva sabe que é hora de cair? — perguntou ele, intrigado.

Sua mãe sorriu e se sentou ao seu lado na varanda.

— Ah, meu querido, a chuva faz parte de um ciclo mágico que acontece todos os dias! Eu vou te contar como funciona.

Lucas se acomodou ao lado da mãe, pronto para ouvir mais uma história fascinante.

— Tudo começa com o Sol — disse sua mãe. — Ele brilha forte sobre os rios, lagos e oceanos, aquecendo a água. Quando a água fica quente, ela se transforma em vapor e sobe para o céu. Esse processo se chama evaporação.

— Uau! Então a água sobe? Mas eu nunca vi! — disse Lucas, arregalando os olhos.

— Isso acontece bem devagar, de um jeito invisível para nós. Mas, quando esse vapor sobe bem alto no céu, onde está mais frio, ele se junta e forma pequenas gotinhas. Muitas dessas gotinhas juntas criam as nuvens. Esse processo se chama condensação.

Lucas olhou para as nuvens cinzentas que se acumulavam no céu.

— Então essas nuvens cheias de gotinhas estão se formando agora?

— Isso mesmo! E quando essas gotinhas ficam muito pesadas, elas caem em forma de chuva. Esse momento se chama precipitação. A água volta para o solo, alimentando as plantas, enchendo os rios e lagos. Depois, com o calor do Sol, tudo recomeça. Esse é o ciclo da água!

Lucas ficou encantado. Ele olhou para o chão e viu a terra absorvendo os primeiros pingos da chuva.

— Então a água que está caindo agora já esteve em outro lugar antes?

— Exatamente! Pode ser que essa mesma água já tenha sido um rio, parte de um oceano ou até mesmo uma poça d'água onde um sapinho brincava!

Lucas riu, imaginando a água fazendo uma grande viagem pelo mundo. Ele abriu as mãos para sentir a chuva e disse:

— Mamãe, agora eu entendi! A chuva é como uma dança da água, indo e voltando sem parar!

A mãe de Lucas sorriu, feliz ao ver seu filho compreendendo mais um pedacinho da natureza.

E assim, Lucas nunca mais viu a chuva como algo simples. Agora, ele sabia que cada gota tinha uma história para contar.`
      },
      {
        id: 18,
        title: 'Lili e Zoe na Floresta',
        image: '🌳',
        image_url: '/Historia/Historinha-Lili-e-Zoe-na-Floresta-Historia-Para-Dormir.webp',
        readingTime: 11,
        age: '3+',
        rating: 4.8,
        category: 'Histórias sobre amizade',
        description: 'Lili e Zoe são duas melhores amigas que decidem explorar a floresta sem avisar suas mães. Uma história sobre amizade, responsabilidade e a importância de obedecer aos pais.',
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-100',
        content: `Lili e Zoe eram duas melhores amigas inseparáveis, com uma paixão em comum: explorar. Moravam em uma casinha aconchegante na beira da floresta, um lugar mágico cheio de árvores altas, riachos cristalinos e segredos sussurrados pelo vento. Lili, com seus cabelos cacheados e olhos curiosos, era a mais aventureira. Zoe, de tranças loiras e sorriso tímido, era a mais cautelosa, mas também adorava a emoção de descobrir coisas novas.

Um dia ensolarado, com o céu pintado de azul e o ar perfumado com o cheiro das flores silvestres, Lili teve uma ideia.

— Zoe, que tal explorarmos a floresta hoje? — perguntou ela, com os olhos brilhando.

Zoe hesitou por um momento. A floresta era um lugar fascinante, mas também um pouco assustador. E, mais importante, suas mães sempre as alertavam para não entrarem na floresta sozinhas, sem pedir permissão.

— Mas Lili… nossas mães não vão gostar — respondeu Zoe, com a voz hesitante.

— Ah, Zoe, vamos só um pouquinho! — insistiu Lili. — Prometo que não vamos longe. Queremos apenas ver o que tem além daquela colina!

Zoe, com o coração dividido entre a obediência e a curiosidade, acabou cedendo ao entusiasmo de Lili. Afinal, quem resistiria a uma aventura com a melhor amiga?

— Tudo bem, Lili, mas prometemos voltar antes do pôr do sol — concordou Zoe, com um sorriso nervoso.

E assim, sem avisar suas mães, Lili e Zoe se aventuraram na floresta. A princípio, tudo era maravilhoso. Elas caminhavam lado a lado, admirando as árvores imponentes, as flores coloridas e os passarinhos que cantavam melodias alegres. Encontraram um riacho cristalino e refrescaram os pés na água gelada. Descobriram pegadas misteriosas na terra e imaginaram que pertenciam a algum animal selvagem.

A cada passo, a floresta se tornava mais densa e escura. As árvores se fechavam sobre suas cabeças, bloqueando a luz do sol. Os sons da floresta se intensificavam, com o canto dos pássaros se misturando ao farfalhar das folhas e ao zumbido dos insetos.

Em um determinado momento, Lili, que sempre ia à frente, parou de repente.

— Olha, Zoe! — exclamou ela, apontando para um caminho estreito que se perdia entre as árvores. — Parece que esse caminho leva a algum lugar interessante!

Zoe olhou para o caminho com apreensão. Ele parecia escuro e misterioso, e ela não tinha certeza se queria segui-lo.

— Lili, acho melhor voltarmos — disse Zoe, com a voz tremendo um pouco. — Já estamos longe de casa, e está começando a ficar tarde.

— Ah, Zoe, não seja medrosa! — respondeu Lili, com um tom de desafio. — Vamos só um pouquinho mais. Se não gostarmos, voltamos na hora!

Zoe, mais uma vez, cedeu à insistência de Lili. Elas seguiram pelo caminho estreito, com o coração batendo forte e a sensação de que estavam se aventurando em território desconhecido.

O caminho as levou a um lugar mágico: um pequeno vale escondido, cercado por árvores altíssimas e com uma cachoeira cristalina desaguando em um lago tranquilo. O lugar era tão lindo que as duas amigas ficaram sem palavras por alguns instantes.

— Uau! Que lugar incrível! — exclamou Lili, com os olhos brilhando.

— É… lindo — concordou Zoe, ainda um pouco apreensiva.

Elas passaram algum tempo explorando o vale, admirando a cachoeira e o lago, e imaginando que eram as únicas pessoas no mundo a conhecer aquele lugar secreto. No entanto, quando perceberam, o sol já estava se pondo e o céu começava a se tingir de cores alaranjadas.

— Lili, precisamos voltar! — disse Zoe, com a voz cheia de pavor. — Nossas mães devem estar preocupadas!

Lili, finalmente, percebeu que haviam ido longe demais e que suas mães deviam estar muito preocupadas.

— Ai, meu Deus! Você tem razão! — respondeu Lili, com a voz embargada. — Vamos voltar correndo!

As duas amigas começaram a correr de volta pelo caminho estreito, mas logo perceberam que estavam perdidas. A floresta, que antes parecia mágica e encantadora, agora se mostrava escura e ameaçadora.

Elas gritaram pelos seus nomes, mas ninguém respondeu. Tropeçavam em raízes e galhos, arranhando os braços e as pernas. O medo as invadia, e lágrimas começavam a rolar por seus rostos.

Depois de muito tempo vagando perdidas pela floresta, Lili e Zoe finalmente encontraram uma trilha familiar. Correram o mais rápido que puderam, até que avistaram a luz de sua casa.

Ao chegarem, viram suas mães esperando na porta, com os rostos cheios de preocupação. Quando as viram, as mães correram para abraçá-las, aliviadas e emocionadas.

— Lili! Zoe! Onde vocês estavam? — perguntou a mãe de Lili, com a voz embargada. — Estávamos tão preocupadas!

— Nós… nós fomos explorar a floresta — respondeu Lili, com a voz tremendo. — Mas nos perdemos…

As mães de Lili e Zoe as levaram para dentro de casa e as confortaram. Explicaram que estavam muito preocupadas e que era perigoso entrar na floresta sozinhas, sem avisar.

Lili e Zoe se sentiram muito culpadas por terem desobedecido suas mães e por tê-las preocupado tanto. Prometeram que nunca mais fariam isso.

Naquela noite, enquanto estavam deitadas em suas camas, Lili e Zoe conversaram sobre tudo o que havia acontecido. Perceberam que a aventura havia sido emocionante, mas também perigosa e irresponsável. Aprenderam que era importante respeitar as regras e obedecer aos pais, pois eles sempre querem o melhor para seus filhos.

E, acima de tudo, aprenderam que a verdadeira aventura não está em desafiar as regras, mas em explorar o mundo com responsabilidade, respeito e amor. A partir daquele dia, Lili e Zoe continuaram a explorar a floresta, mas sempre com a permissão e a companhia de suas mães, aprendendo a valorizar a segurança e o carinho que recebiam.`
      },
      {
        id: 19,
        title: 'João e o pé de feijão',
        image: '🌱',
        image_url: '/Historia/historia-de-joao-e-o-pe-de-feijao.webp',
        readingTime: 10,
        age: '4+',
        rating: 4.9,
        category: 'Histórias clássicas',
        description: 'João troca sua vaca por feijões mágicos que crescem até o céu. Uma aventura clássica sobre coragem, astúcia e a busca por uma vida melhor.',
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-100',
        content: `João e a mãe eram muito pobres. Um dia a mãe do João mandou-o ao mercado vender a única vaca que possuíam. No caminho, João encontrou um homem que o fez parar e lhe disse:

— Essa vaca é para vender?

— É, sim — respondeu João.

— Então, dou-te cinco feijões por ela — disse o homem.

— Não me parece que seja um preço justo por uma vaca — disse o João.

— Mas estes não são uns feijões quaisquer — disse o homem — são feijões mágicos.

— Sendo assim, fico com eles e pode levar a vaca — disse João.

Quando chegou a casa, João mostrou os feijões à mãe. Ela ficou tão zangada que os arrancou da mão de João e atirou-os pela janela fora. Nem sequer ligou quando João lhe disse que os feijões eram mágicos.

— Isso é coisa que não existe… feijões mágicos! — disse ela, e mandou-o para a cama sem jantar. Como estava enganada! Os feijões germinaram durante a noite e cresceram, cresceram, CRESCERAM.

Na manhã seguinte, havia um ENORME pé de feijão a crescer perto da janela.

— Vou ver o que há lá em cima! — disse o João; e começou a trepar.

— Tem cuidado! — gritou a mãe.

João trepou, trepou cada vez mais alto até que, por fim, chegou a um mundo acima das nuvens. Bateu à primeira porta que encontrou e a mulher dum gigante veio abrir. Convidou João a entrar e a tomar o pequeno-almoço. João estava mesmo a acabar de comer quando ouviu o som de uns passos pesados e uma voz a gritar muito alto:

— UM, DOIS, TRÊS, CHEIRA-ME A SANGUE DE HOMEM INGLÊS!

— Depressa! Depressa! — disse a mulher. — É o meu marido, o gigante. Ele come rapazinhos como tu ao pequeno-almoço. Depressa! Depressa! Esconde-te no forno. E o João assim fez. ELE não queria ser comido.

O gigante tinha a certeza de sentir o cheiro de rapaz, mas não o conseguiu encontrar. Teve de se contentar com as papas de aveia ao pequeno-almoço. Quando esvaziou o prato, o gigante chamou a sua galinha. João, que estava a espreitar do forno, viu tudo o que se passou.

— Põe um ovo, galinha! — ordenou o gigante. E, logo a seguir, a galinha pôs um lindo ovo de ouro.

— A mãe havia de gostar de ter uma galinha assim — pensou João.

João esperou que o gigante adormecesse e então saiu silenciosamente do esconderijo. Pegou na galinha e escondeu-a dentro da camisa.

— Vais comigo para casa — disse ele. Correu para fora da casa sem acordar o gigante e deixou-se deslizar pelo pé de feijão abaixo.

— Veja o que lhe trago! — gritou João quando viu a mãe a vir ao seu encontro.

Na manhã seguinte, João tornou a subir pelo pé de feijão e voltou a casa do gigante.

— UM, DOIS, TRÊS! — rugiu o gigante. — CHEIRA-ME A SANGUE DE HOMEM INGLÊS!

Desta vez, João escondeu-se numa gaveta, e o gigante teve de se contentar novamente com as papas de aveia, o que o irritou muito. Quando acabou de comer, o gigante mandou buscar a sua harpa.

— Toca, harpa — ordenou. E a harpa tocou sem que o gigante lhe tivesse tocado nas cordas uma só vez.

— A mãe havia de gostar de ter uma harpa que tocasse sozinha — pensou o João.

Por fim, o gigante adormeceu e João saiu silenciosamente do esconderijo. Estendeu a mão para pegar na harpa, mas, mal lhe tocou, ela começou a chamar muito alto:

— Meu amo! Meu amo! Acordai!

João enfiou rapidamente a harpa dentro da camisa para lhe abafar a voz, mas era tarde de mais. O gigante saltou da cadeira com um rugido.

— UM, DOIS, TRÊS! — gritou ele. — EU SABIA QUE SENTIA O CHEIRO DE UM INGLÊS!

João escapuliu-se pelo meio dos dedos do gigante e desatou a correr em direcção ao cimo do pé de feijão, tão depressa quanto as pernas lhe permitiam.

— UM, DOIS, TRÊS! — gritava o gigante. Estava furioso.

— UM, DOIS, TRÊS! À medida que João descia pelo pé de feijão, sentia-o a abanar e tremer. Sentia o bafo do gigante soprar-lhe no pescoço como um vento quente e devastador.

— UM, DOIS, TRÊS!

A mãe do João ouviu toda aquela barulheira e veio a correr. Quando viu o gigante, ficou muito assustada.

— Depressa! Depressa! Dê-me o machado! — gritou João já muito próximo do chão. Não havia tempo a perder. Tomou o machado das mãos da mãe e de um só golpe cortou o pé de feijão. Este caiu ao chão com grande estrondo e fez um buraco tão grande, que nem o pé de feijão nem o gigante voltaram a ser vistos à luz do dia.

Quanto a João e à mãe, foram muito felizes daí em diante. E, com uma galinha a pôr ovos de ouro e uma harpa a tocar sozinha, nunca mais foram pobres.`
      },
      {
        id: 20,
        title: 'Pinóquio',
        image: '🪵',
        image_url: '/Historia/images.jpeg',
        readingTime: 11,
        age: '4+',
        rating: 4.9,
        category: 'Histórias clássicas',
        description: 'Gepeto constrói um boneco de madeira que ganha vida. Uma história clássica sobre obediência, honestidade e o amor de um pai que transforma um menino de madeira em um menino de verdade.',
        gradient: 'from-orange-400 to-yellow-500',
        bgGradient: 'from-orange-50 to-yellow-100',
        content: `Era uma vez um homem chamado Gepeto, um talentoso carpinteiro que vivia sozinho. O seu sonho era ter um filho a quem pudesse oferecer todo o seu amor e carinho.

Um dia, Gepeto construiu um lindo boneco de madeira. Quando terminou a sua bela construção, suspirou:

"Quem me dera que este rapazinho de madeira fosse real e vivesse aqui comigo como meu filho!"

Após dizer estas palavras, aconteceu algo muito estranho. O pequeno rapaz de madeira ganhou vida! As palavras de Gepeto pareciam ter sido ouvidas!

O carpinteiro gritou de alegria e, entre gargalhadas de felicidade, disse:

"Sê bem-vindo pequeno rapaz! Vou chamar-te Pinóquio."

Gepeto tornou-se assim um pai para o rapaz. Logo na manhã seguinte ajudou-o a vestir-se, deu-lhe livros, um beijo na face e mandou-o para a escola. Sendo agora um menino como outros, era necessário aprender a ler, escrever e os números.

Contudo, antes de o menino sair para a escola, avisou-o:

"Assim que a escola terminar, vem imediatamente para casa. Não te esqueças!"

Pinóquio respondeu que sim e, alegremente, saiu a saltitar e foi a caminhar em direção à escola.

Pelo caminho, Pinóquio reparou que na praça havia um espetáculo de marionetas. Juntou-se a elas e, dançou tão bem, que o dono das marionetas lhe ofereceu cinco moedas de ouro. Ficou maravilhado e só pensava como Gepeto iria ficar feliz quando lhe entregasse as moedas.

Já perto da escola, Pinóquio encontrou dois homens maus. Como era muito ingénuo, os dois homens convenceram-no a ir com eles até uma hospedaria para comerem e depois dormirem.

Depois de comer, Pinóquio ficou sonolento e adormeceu facilmente. Sonhou que era rico e que ele e seu pai Gepeto viviam agora sem dificuldades e eram muito felizes.

Quando acordou, esses homens convenceram Pinóquio a enterrar as suas moedas de ouro num sítio que eles conheciam, dizendo:

"As moedas aqui enterradas transformar-se-ão numa árvore de dinheiro e nunca mais o teu pai, que já está velho e cansado, precisará de trabalhar!"

Pinóquio assim fez e ficou à espera que as moedas de ouro se transformassem numa árvore de dinheiro. Esperou muito tempo até que, cansado, adormeceu. Os homens maus apareceram e levaram as moedas de ouro, enquanto o rapaz dormia.

Quando acordou, Pinóquio reparou que lhe tinham levado as moedas e chorou. Não queria voltar para casa com medo de que Gepeto ficasse zangado e triste com ele…

Sem saber o que fazer, Pinóquio começou a caminhar, até que encontrou uma senhora vestida de azul, a quem pediu ajuda. O que ele não sabia era que a senhora era uma fada.

A fada azul disse que o ajudaria e perguntou-lhe quem eram os seus pais e onde vivia. Pinóquio respondeu:

"Não tenho casa nem ninguém com quem morar."

A fada azul apercebeu-se que Pinóquio mentia. O nariz do rapaz tinha começado a crescer!

A fada azul então indicou-lhe:

"Volta para casa, para junto do teu pai. Sê um menino bem-comportado e não mintas mais."

Pinóquio prometeu que assim faria e o seu nariz voltou ao tamanho normal.

De volta a casa, Pinóquio passou por um parque de diversões e não resistiu e entrou. O seu nariz começou a crescer outra vez. No parque, disseram-lhe que poderia comer todos os gelados que ele quisesse… o que não lhe disseram é que os gelados o iriam transformar num burro!

Pinóquio comeu até não poder mais e, assim que se transformou num burro, foi vendido a um circo.

No circo foi obrigado a trabalhar duramente. Além disso, foi tão maltratado que, pouco tempo depois, nem conseguia andar.

Como já não servia para trabalhar no circo, o dono mandou que o atirassem ao mar.

Assim que caiu no mar, Pinóquio transformou-se novamente num rapaz de madeira. Uma baleia que por ali passava viu-o e engoliu-o, pensando que era comida.

Dentro da baleia, qual não foi a surpresa de Pinóquio ao encontrar Gepeto! Este, vendo que Pinóquio não chegava da escola, tinha-o ir procurar. Caiu ao mar e acabou por ir parar à barriga da baleia. Estava muito fraco e doente. Um peixe que também lá se encontrava disse:

"Subam os dois para as minhas costas que eu levo-os para casa!"

E assim fizeram. Quando chegaram a casa, Pinóquio tomou muito bem conta de Gepeto até ele ficar bom. A fada azul apareceu outra vez e, ao ver que o rapaz tinha sido tão bom com Gepeto, disse:

"Como agora és um bom menino vou-te transformar num rapaz de verdade."

E assim foi. Gepeto tinha finalmente o filho que tanto desejava e os dois foram felizes para sempre!`
      }
    ]
  }

  const handleStoryClick = (story) => {
    setSelectedStory(story)
  }

  const handleBack = () => {
    if (selectedStory) {
      setSelectedStory(null)
    } else {
      navigate(-1)
    }
  }

  if (selectedStory) {
    return (
      <div className="container-app py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedStory.title}
            </h1>
            <p className="text-gray-600 text-sm">
              Hora da História 📖
            </p>
          </div>
        </div>

        {/* Imagem da história */}
        {selectedStory.image_url ? (
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={selectedStory.image_url} 
              alt={selectedStory.title}
              className="w-full h-64 object-cover"
            />
          </div>
        ) : (
          <div className="card bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <div className="text-center py-8">
              <div className="text-8xl mb-4">{selectedStory.image}</div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Clock size={16} />
                <span className="text-sm">{selectedStory.readingTime} min de leitura</span>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da história */}
        <div className="card">
          <div className="story-content">
            <div className="story-text">
              {selectedStory.content.split('\n\n').map((paragraph, index) => {
                const trimmedParagraph = paragraph.trim()
                const isDialogue = trimmedParagraph.startsWith('"') || (trimmedParagraph.includes(':') && trimmedParagraph.includes('"'))
                const isFirstParagraph = index === 0
                
                return (
                  <p 
                    key={index} 
                    className={`story-paragraph ${isDialogue ? 'story-dialogue' : ''} ${isFirstParagraph ? 'story-first' : ''}`}
                  >
                    {trimmedParagraph}
                  </p>
                )
              })}
            </div>
          </div>
        </div>

        {/* Botão de voltar */}
        <button
          onClick={handleBack}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Voltar para Histórias
        </button>
      </div>
    )
  }

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hora da História 📖
          </h1>
          <p className="text-gray-600 text-sm">
            Leitura em Família
          </p>
        </div>
      </div>

      {/* Lista de histórias */}
      <div className="space-y-3">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(story)}
            className="w-full card hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              {/* Imagem/Emoji da história - Área maior */}
              <div className="w-24 h-24 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {story.image_url ? (
                  <img 
                    src={story.image_url} 
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-purple-500">{story.image}</span>
                )}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {story.description || 'Uma história encantadora para toda a família.'}
                </p>
                <div className="flex items-center space-x-3 text-gray-600 text-xs mt-2">
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{story.readingTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Smile size={12} />
                    <span>{story.age || '2+'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span>{story.rating || 4.8}</span>
                  </div>
                </div>
              </div>

              {/* Seta */}
              <div className="text-gray-400 flex-shrink-0">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mensagem de boas-vindas */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <BookOpen size={24} className="text-orange-600" />
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Momento Especial</h3>
            <p className="text-gray-600 text-sm">
              Aproveite este tempo juntos para ler e criar memórias inesquecíveis!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoriesPage

