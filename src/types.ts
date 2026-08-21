export interface Player {
  id: string
  name: string
  created_at: string
}

export interface Heist {
  id: string
  player_id: string
  nome: string
  nome_real: string
  nome_disfarce: string
  local_base: string
  objetivo: string
  objetivo_obtido?: boolean
  grupo_dominante: string
  fase_atual: number
  suspeita: number
  relogio: number
  reforco: string
  falha_descoberta: boolean
  defesas_descobertas: boolean
  falhas_texto: string
  defesas_texto: string
  falha_texto: string
  anotacoes: string
  created_at: string
  updated_at: string
}

export type HeistInsert = Omit<Heist, 'id' | 'created_at' | 'updated_at'>

export interface Character {
  id: string
  player_id: string
  jogador: string
  bruxo: string
  xp: number
  num_consciencia: number
  pilar_consciencia: number
  num_espirito: number
  pilar_espirito: number
  num_corpo: number
  pilar_corpo: number
  num_natureza: number
  pilar_natureza: number
  num_leis: number
  pilar_leis: number
  cargas_foco: number
  foco_descricao: string
  maldicoes: string
  maldicoes_selected: string[]
  stress: number
  risco_de_vida: number
  morrendo: boolean
  ferimentos: string
  descansos_restantes: number
  ferimentos_selected: string[]
  q1: string
  q1_used: boolean
  q2: string
  q2_used: boolean
  q3: string
  q3_used: boolean
  q4: string
  q4_used: boolean
  q5: string
  q5_used: boolean
  transmutacoes: string
  transmutacoes_selected: string[]
  vantagens: string
  vantagens_selected: string[]
  created_at: string
  updated_at: string
}

export type CharacterInsert = Omit<Character, 'id' | 'created_at' | 'updated_at'>
export type CharacterUpdate = Partial<Omit<Character, 'id' | 'player_id' | 'created_at'>>
