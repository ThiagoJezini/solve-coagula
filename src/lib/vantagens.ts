export type VantagemTipo = 'vantagem' | 'desvantagem'

export interface Vantagem {
  id: string
  nome: string
  tipo: VantagemTipo
  descricao: string
  mecanica: string
  pilar?: 'consciencia' | 'espirito' | 'corpo' | 'natureza' | 'leis'
  requires?: string
}

export const VANTAGENS: Vantagem[] = [
  {
    id: 'tecnico',
    nome: 'Técnico',
    tipo: 'vantagem',
    descricao: 'Vivência íntima com sistemas computacionais, fiação, engrenagens digitais e terminais.',
    mecanica: '+1 em testes que envolvam usar sistemas de computador.',
    pilar: 'leis',
  },
  {
    id: 'apostador-de-vontades',
    nome: 'Apostador de vontades',
    tipo: 'vantagem',
    descricao: 'Em vez de aceitar passivamente o custo, você joga a própria sorte contra o destino. Quando estiver pretes a riscar uma Motivação faça um teste DT 7, se passar você não risca a Motivação, se falhar você sofre 1d6 de Risco de VIda',
    mecanica: '',
    pilar: 'consciencia',
  },
  {
    id: 'pernas-nao-tao-curtas',
    nome: 'Pernas não tão curtas',
    tipo: 'vantagem',
    descricao: 'Conhece a hora exata de dobrar a esquina antes da vítima perceber.',
    mecanica: '+1 em testes que envolvam mentir mais de uma vez para o mesmo personagem que não seja de jogador.',
    pilar: 'consciencia',
  },
  {
    id: 'reliquia-de-familia',
    nome: 'Relíquia de família',
    tipo: 'vantagem',
    descricao: 'O objeto atravessa gerações. Aprendeu a manusear com intimidade, sem pensar.',
    mecanica: '+1 em testes que envolvam usar sua relíquia.',
    pilar: 'consciencia',
  },
  {
    id: 'procurado',
    nome: 'Procurado',
    tipo: 'desvantagem',
    descricao: 'Seu rosto está nos cartazes. Cada sombra pode ser um informante.',
    mecanica: '-2 em testes sempre que envolver esconder sua real identidade.',
    requires: 'ficha-suja',
  },
  {
    id: 'ficha-suja',
    nome: 'Ficha suja',
    tipo: 'desvantagem',
    descricao: 'Há coisas no seu passado que as autoridades podem descobrir.',
    mecanica: '-1 em testes sempre que alguma autoridade descobre algo pessoal seu.',
  },
  {
    id: 'traido',
    nome: 'Traído',
    tipo: 'desvantagem',
    descricao: 'Alguém que você confiou se voltou contra você. O nome do algoz queima a memória.',
    mecanica: '-1 em testes sempre que confrontar seu algoz.',
  },
]

export const VANTAGEM_BY_ID = (id: string) => VANTAGENS.find((v) => v.id === id)
