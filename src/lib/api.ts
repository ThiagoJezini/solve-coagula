import { supabase } from './supabase'
import type { Player, Character, CharacterInsert, CharacterUpdate } from '../types'

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
