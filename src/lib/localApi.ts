import type { Character, CharacterUpdate, Player } from '../types'

const PLAYERS_KEY = 'solve_players'
const CHARACTERS_KEY = 'solve_characters'

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function loadPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePlayers(players: Player[]): void {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCharacters(chars: Character[]): void {
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars))
}

function delay<T>(value: T, ms = 60): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function getOrCreatePlayer(name: string): Promise<Player> {
  const players = loadPlayers()
  const existing = players.find((p) => p.name === name)
  if (existing) return delay(existing)
  const now = new Date().toISOString()
  const newPlayer: Player = {
    id: uuid(),
    name,
    created_at: now,
  }
  savePlayers([...players, newPlayer])
  return delay(newPlayer)
}

export async function getCharacters(playerId: string): Promise<Character[]> {
  const chars = loadCharacters()
  const filtered = chars.filter((c) => c.player_id === playerId)
  filtered.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
  return delay(filtered)
}

export async function createCharacter(playerId: string): Promise<Character> {
  const chars = loadCharacters()
  const now = new Date().toISOString()
  const newChar: Character = {
    id: uuid(),
    player_id: playerId,
    jogador: '',
    bruxo: '',
    xp: 0,
    num_consciencia: 0,
    pilar_consciencia: 0,
    num_espirito: 0,
    pilar_espirito: 0,
    num_corpo: 0,
    pilar_corpo: 0,
    num_natureza: 0,
    pilar_natureza: 0,
    num_leis: 0,
    pilar_leis: 0,
    cargas_foco: 0,
    foco_descricao: '',
    maldicoes: '',
    maldicoes_selected: [],
    stress: 0,
    risco_de_vida: 0,
    morrendo: false,
    ferimentos: '',
    descansos_restantes: 3,
    ferimentos_selected: [],
    q1: '',
    q1_used: false,
    q2: '',
    q2_used: false,
    q3: '',
    q3_used: false,
    q4: '',
    q4_used: false,
    q5: '',
    q5_used: false,
    transmutacoes: '',
    transmutacoes_selected: [],
    vantagens: '',
    vantagens_selected: [],
    created_at: now,
    updated_at: now,
  }
  saveCharacters([newChar, ...chars])
  return delay(newChar)
}

export async function getCharacter(id: string): Promise<Character | null> {
  const chars = loadCharacters()
  const found = chars.find((c) => c.id === id)
  return delay(found ?? null)
}

export async function updateCharacter(id: string, updates: CharacterUpdate): Promise<void> {
  const chars = loadCharacters()
  const index = chars.findIndex((c) => c.id === id)
  if (index === -1) return
  chars[index] = {
    ...chars[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  saveCharacters(chars)
  return delay(undefined)
}

export async function deleteCharacter(id: string): Promise<void> {
  const chars = loadCharacters().filter((c) => c.id !== id)
  saveCharacters(chars)
  return delay(undefined)
}

export function _resetLocalDb(): void {
  localStorage.removeItem(PLAYERS_KEY)
  localStorage.removeItem(CHARACTERS_KEY)
}
