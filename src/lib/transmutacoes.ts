export const TRANSMUTACOES: Record<string, { nome: string; efeito: string; categoria?: string }[]> = {
  Consciência: [
    {
      nome: 'Mentirinha',
      efeito: 'Por uma cena. Você consegue fazer com que os traços físicos de pessoas numa quantidade baseada na sua Categoria ou a aparência de objetos sejam alterados numa área baseada na sua Categoria.\n\nMesmo ao tocar o que está sendo afetado o efeito não termina, quem está sendo enganado vai achar que se trata realmente do que ela estiver vendo. Caso o efeito seja algo danoso ele causa apenas 1 de dano não importando a magnitude da ilusão.',
      categoria: 'Quantidade/Tamanho',
    },
    {
      nome: 'Sequestrar a mente',
      efeito: 'Por uma cena. Você consegue entrar na mente de alguém e buscar uma informação lá dentro, você pode passar o tempo que quiser na mente e saber de qualquer informação que esse alguém sabe, o alvo e você ficam desmaiados durante o processo, não é possível ser acordado por nenhuma fonte externa.\n\nApós a primeira informação adquirida o alvo pode tentar encontrar você na mente dele, faça um teste DT CON, se falhar o alvo te encontrará e o efeito termina, caso passe você recebe mais uma informação e seu próximo teste é feito com -1 cumulativamente.',
      categoria: 'Distância',
    },
    {
      nome: 'Marionete',
      efeito: 'Instantâneo. Você pode sugestionar uma ação a um humano e ele irá atender sem objeções. Essa sugestão pode interromper qualquer linha de raciocínio anterior e será executada instantaneamente.\n\nO alvo não aceitará nenhuma sugestão que cause mal a ele e essa instrução pode conter no máximo 3 passos, como por exemplo: fique calado, ande até o fim do beco e permaneça parado.',
      categoria: 'Instantâneo',
    },
  ],
  Espírito: [
    {
      nome: 'Aura do Bom Samaritano',
      efeito: 'Por uma cena você cria uma área baseada na sua Categoria ao seu redor, humanos nessa área só podem falar a verdade, objetos propositalmente escondidos são encontrados, mesmo por efeitos de transmutações, para você é sobrenaturalmente perceptível que há algo escondido no local, você é capaz de determinar onde e quantos são.\n\nCaso criaturas sobrenaturais estejam nesta área você deve fazer um teste DT ESP, caso passe ela é obrigada a falar a verdade ou se revelar, se falhar ela se livra do efeito.\n\nCaso seja outro jogador ele faz um teste DT ESP e segue os efeitos descritos acima.',
      categoria: 'Quantidade',
    },
    {
      nome: 'Extensão',
      efeito: 'Por uma cena você é capaz de criar uma representação de sua alma com a aparência que desejar, esta representação fica ao seu lado e é capaz de te defender. Você deve escolher um efeito abaixo, esse efeito não pode ser alterado durante a cena.\n\nVocê pode automaticamente causar dano a um inimigo igual a 2x(pontos em espírito) a um inimigo.\n\nA Extensão pode te proteger, você nega o primeiro montante de estresse que receberia na rodada.\n\nA Extensão não pode ser alvo de ataques, e nem tem inteligência própria, ela precisa dos seus comandos, caso você caia inconsciente antes do fim da cena ela permanece ativada.',
      categoria: 'Por cena',
    },
    {
      nome: 'Acorrentar Mortos',
      efeito: 'Você consegue contatar uma alma que esteja no mesmo lugar que você e fazer ela te servir, essa alma te contará a verdade ao ser questionada, seu conhecimento se limita ao que ela viu em vida ou fora dela.\n\nA alma pode se revelar ou se manter escondida ao seu comando, uma alma pode atacar um alvo causando dano equivalente a seus pontos em Espírito para isso faça um teste DT ESP. A presença da alma em um local por alguns dias causa efeitos destrutivos a matéria envolta dela, rachaduras, infiltrações e decaimento acelerado.\n\nAo soltar a alma ela se dissipa e não pode mais ser chamada novamente.\n\nManter a alma acorrentada cobra um preço, para cada dia que a alma permanecer ativa você aumenta em 1 seu risco de vida.',
      categoria: 'Distância',
    },
  ],
  Corpo: [
    {
      nome: 'Treinado mais que o máximo',
      efeito: 'Por uma cena você consegue levar habilidades atléticas a um limite inumano, escolha um dos itens abaixo, você é capaz de reproduzir um deles pela cena o efeito não pode ser trocado a não ser que se use a Transmutação novamente.\n\nCorrer grandes distâncias num piscar de olhos\nPular alturas impossíveis.\nSe agarrar pelas paredes e teto\nCarregar algo extremamente pesado\nDestruir objetos sem se machucar\nAutomaticamente Causar 2x(pontos em Corpo) de dano a um inimigo corpo a corpo',
      categoria: 'Por cena',
    },
    {
      nome: 'Corpo fechado',
      efeito: 'Por uma cena você é imune a efeitos que aumentem seu estresse. Porém não é capaz de causar dano com nada que você esteja segurando. Se você jogar algo ou atirar com uma arma esse efeito se mantém.',
      categoria: 'Por cena',
    },
    {
      nome: 'Meu corpo minhas regras',
      efeito: 'Durante uma cena você pode alterar as propriedades do seu corpo escolha um dos efeitos abaixo, você é capaz de reproduzir um deles pela cena o efeito não pode ser trocado a não ser que se use a Transmutação novamente.\n\nReduzir densidade do corpo\nPode fazer seu corpo se esticar todo até sobrar apenas a finura de uma linha\nPode mudar sua aparência como quiser\nReduzir em 1 seu risco de vida',
      categoria: 'Por cena',
    },
  ],
  Natureza: [
    {
      nome: 'Táticas de matilha',
      efeito: 'Você consegue controlar um animal de grande porte ou um grupo de animais de pequeno porte, eles são controlados pela sua voz e manterão o último comando dado até o fim da cena, se o comando for cumprido e um novo não vier os animais se dispersam.\n\nToda vez que você usar isso para sua vantagem faça um teste DT NAT para realizar a ação que deseja com eles.',
      categoria: 'Quantidade',
    },
    {
      nome: 'Enraizar',
      efeito: 'Você controla as plantas de um local fazendo com que elas cresçam de forma acelerada, essas raízes e folhas são capazes de cobrir criaturas e objetos baseados na sua Categoria deixando-os imóveis. Essas raízes são um efeito oculto e não podem ser destruídas ou movidas por objetos convencionais apenas por forças sobrenaturais.',
      categoria: 'Tamanho',
    },
    {
      nome: 'Sapo',
      efeito: 'Durante uma cena você produz um soro que pode salvar ou matar. escolha um efeito abaixo esse efeito não pode ser trocado.\n\nUma toxina mortal automaticamente causa 2x(Pontos em natureza) de dano\nUm soro capaz de reduzir o estresse de um alvo para 0\nUm sonífero poderoso que faz o alvo dormir até ser acordado por outra pessoa',
      categoria: 'Por cena',
    },
  ],
  Leis: [
    {
      nome: 'Corrente elétrica',
      efeito: 'Durante uma cena você pode controlar a energia elétrica a sua volta, pode causar interferências em equipamentos eletrônicos para ligar ou desligar eles. Além disso, enquanto tiver uma fonte de corrente contínua você consegue desviar essa energia e automaticamente causar 2x(pontos em Leis) de dano em um alvo.',
      categoria: 'Distância',
    },
    {
      nome: 'Troca equivalente',
      efeito: 'Você sabe que nada se perde, tudo se transforma. Por uma cena você escolher um efeito:\n\nMudar o estado físico de um objeto inorgânico de tamanho da sua Categoria\nTransformar objetos numa quantidade baseados na sua categoria em outros\n\nSe algum desses efeitos for usado para causar dano a um inimigo faça um teste CD LEIS se pausar o efeito causa 2x(pontos em Leis) de dano em um alvo, se falhar causa metade.',
      categoria: 'Tamanho/Quantidade',
    },
    {
      nome: 'Sempre aposte no preto',
      efeito: 'Você cria sorte ao seu redor, não pode ser ferido e todos os efeitos negativos contra você erram. Além disso, todos os seus testes são feitos com +3, anote a quantidade de vezes que você se beneficiou dessa Transmutação na cena.\n\nApós a cena acabar para cada efeito de sorte extrema anotado sofra 1d6 de estresse.',
      categoria: 'Por cena',
    },
  ],
}