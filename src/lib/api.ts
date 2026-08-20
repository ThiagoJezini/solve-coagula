import { supabase } from './supabase'
import type { Player, Character, CharacterInsert, CharacterUpdate, Heist, HeistInsert } from '../types'

export async function getOrCreatePlayer(name: string): Promise<Player> {
  const { data: existing } = await supabase
    .from('players')
    .select('*')
    .eq('name', name)
    .single()

  if (existing) return existing

  const { data, error } = await supabase
    .from('players')
    .insert({ name })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCharacters(playerId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('player_id', playerId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createCharacter(playerId: string): Promise<Character> {
  const { data, error } = await supabase
    .from('characters')
    .insert({ player_id: playerId } as CharacterInsert)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCharacter(id: string): Promise<Character | null> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function updateCharacter(id: string, updates: CharacterUpdate): Promise<void> {
  const { error } = await supabase
    .from('characters')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getHeists(playerId: string): Promise<Heist[]> {
  const { data, error } = await supabase
    .from('heists')
    .select('*')
    .eq('player_id', playerId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createHeist(playerId: string): Promise<Heist> {
  const newHeist: HeistInsert = {
    player_id: playerId,
    nome: '',
    nome_real: '',
    nome_disfarce: '',
    local_base: '',
    objetivo: '',
    fase_atual: 1,
    suspeita: 0,
    relogio: 0,
    reforco: '',
    falha_descoberta: false,
    falhas_texto: '',
    defesas_texto: '',
    falha_texto: '',
    anotacoes: '',
  }
  const { data, error } = await supabase
    .from('heists')
    .insert(newHeist)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateHeist(id: string, updates: Partial<Heist>): Promise<void> {
  const { error } = await supabase
    .from('heists')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function deleteHeist(id: string): Promise<void> {
  const { error } = await supabase
    .from('heists')
    .delete()
    .eq('id', id)

  if (error) throw error
}
