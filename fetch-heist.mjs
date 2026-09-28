import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env', 'utf8')
const url = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim()
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim()

const supabase = createClient(url, key)

const { data: player } = await supabase
  .from('players')
  .select('*')
  .eq('name', 'jezini')
  .single()

if (!player) {
  console.error('Player "jezini" não encontrado')
  process.exit(1)
}

const { data: heists } = await supabase
  .from('heists')
  .select('*')
  .eq('player_id', player.id)
  .order('updated_at', { ascending: false })

if (!heists || heists.length === 0) {
  console.error('Nenhum assalto encontrado')
  process.exit(1)
}

const h = heists[0]
const salaDesc = (i) => (h.anotacoes.split('|SALA|')[i + 1] ?? '').trim()
const salasDescobertas = h.salas_descobertas ?? [false, false, false, false]
const anotacoes = (h.anotacoes.split('|SALA|')[0] ?? '').trim()

console.log('=== FICHA DE ASSALTO ===')
console.log('')
console.log(`info Nome Real: ${h.nome_real || '(vazio)'}`)
console.log(`info Nome de Disfarce: ${h.nome_disfarce || '(vazio)'}`)
console.log(`info Local da Base: ${h.local_base || '(vazio)'}`)
console.log(`info Objetivo: ${h.objetivo || '(vazio)'}`)
console.log('')
console.log(`info Defesas da Base: ${h.defesas_texto || '(vazio)'}`)
console.log(`info Defesas descobertas: ${h.defesas_descobertas ? 'sim' : 'não'}`)
console.log('')
console.log(`info Falha de Segurança: ${h.falha_texto || '(vazio)'}`)
console.log(`info Falha descoberta: ${h.falha_descoberta ? 'sim' : 'não'}`)
console.log('')
console.log(`info Reforço: ${h.reforco || '(vazio)'}`)
console.log(`info Grupo Dominante: ${h.grupo_dominante || '(vazio)'}`)
console.log('')
console.log(`info Sala 1: ${salaDesc(0) || '(vazio)'} [${salasDescobertas[0] ? 'descoberta' : 'oculta'}]`)
console.log(`info Sala 2: ${salaDesc(1) || '(vazio)'} [${salasDescobertas[1] ? 'descoberta' : 'oculta'}]`)
console.log(`info Sala 3: ${salaDesc(2) || '(vazio)'} [${salasDescobertas[2] ? 'descoberta' : 'oculta'}]`)
console.log(`info Sala 4: ${salaDesc(3) || '(vazio)'} [${salasDescobertas[3] ? 'descoberta' : 'oculta'}]`)
console.log('')
console.log(`info Fase do Assalto: ${h.fase_atual}/3`)
console.log(`info Nível de Suspeita: ${h.suspeita}/5`)
console.log(`info Relógio de Execução: ${h.relogio}/4`)
console.log('')
console.log(`info Anotações: ${anotacoes || '(vazio)'}`)
console.log('')
console.log(`info Criada em: ${new Date(h.created_at).toLocaleDateString('pt-BR')}`)
console.log(`info Atualizada em: ${new Date(h.updated_at).toLocaleDateString('pt-BR')}`)
