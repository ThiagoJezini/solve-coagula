import { useState, useEffect } from 'react'
import type { Player, Character, Heist } from './types'
import { getOrCreatePlayer, getCharacters, createCharacter, deleteCharacter, getHeists, createHeist, deleteHeist } from './lib/api'
import { CharacterSheet } from './CharacterSheet'
import { HeistSheet } from './components/HeistSheet'
import './App.css'

type View =
  | { screen: 'login' }
  | { screen: 'list'; player: Player; characters: Character[]; heists: Heist[] }
  | { screen: 'sheet'; character: Character; player: Player }
  | { screen: 'heist'; heist: Heist; player: Player }

export default function App() {
  const [view, setView] = useState<View>({ screen: 'login' })
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('solve_player')
    if (saved) {
      setPlayerName(saved)
    }
  }, [])

  async function handleLogin() {
    if (!playerName.trim()) return
    setLoading(true)
    setError('')
    try {
      const player = await getOrCreatePlayer(playerName.trim())
      localStorage.setItem('solve_player', player.name)
      const [chars, heists] = await Promise.all([
        getCharacters(player.id),
        getHeists(player.id),
      ])
      setView({ screen: 'list', player, characters: chars, heists })
    } catch (err) {
      let msg = 'erro desconhecido'
      if (err && typeof err === 'object') {
        const e = err as { message?: string; error_description?: string; details?: string; hint?: string; code?: string }
        msg = e.message || e.error_description || e.details || e.hint || e.code || JSON.stringify(err)
      } else if (typeof err === 'string') {
        msg = err
      }
      console.error('Supabase login error:', err)
      setError('Erro ao entrar: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  async function refreshList(player: Player) {
    const [chars, heists] = await Promise.all([
      getCharacters(player.id),
      getHeists(player.id),
    ])
    setView({ screen: 'list', player, characters: chars, heists })
  }

  async function handleCreateCharacter() {
    if (view.screen !== 'list') return
    setLoading(true)
    try {
      const newChar = await createCharacter(view.player.id)
      setView({ screen: 'sheet', character: newChar, player: view.player })
    } catch {
      setError('Erro ao criar ficha.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteCharacter(id: string) {
    if (view.screen !== 'list') return
    try {
      await deleteCharacter(id)
      await refreshList(view.player)
    } catch {
      setError('Erro ao deletar ficha.')
    }
  }

  async function handleCreateHeist() {
    if (view.screen !== 'list') return
    setLoading(true)
    try {
      const newHeist = await createHeist(view.player.id)
      setView({ screen: 'heist', heist: newHeist, player: view.player })
    } catch {
      setError('Erro ao criar ficha de assalto.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteHeist(id: string) {
    if (view.screen !== 'list') return
    try {
      await deleteHeist(id)
      await refreshList(view.player)
    } catch {
      setError('Erro ao deletar ficha de assalto.')
    }
  }

  function handleSelectCharacter(char: Character) {
    if (view.screen !== 'list') return
    setView({ screen: 'sheet', character: char, player: view.player })
  }

  function handleSelectHeist(heist: Heist) {
    if (view.screen !== 'list') return
    setView({ screen: 'heist', heist, player: view.player })
  }

  function handleBackFromSheet() {
    if (view.screen === 'sheet') {
      refreshList(view.player)
    }
  }

  function handleBackFromHeist() {
    if (view.screen === 'heist') {
      refreshList(view.player)
    }
  }

  function handleBackFromList() {
    setView({ screen: 'login' })
  }

  if (view.screen === 'sheet') {
    return <CharacterSheet character={view.character} onBack={handleBackFromSheet} />
  }

  if (view.screen === 'heist') {
    return <HeistSheet heist={view.heist} onBack={handleBackFromHeist} />
  }

  if (view.screen === 'list') {
    return (
      <div className="app">
        <div className="container">
          <div className="toolbar-list">
            <button className="btn-back" onClick={handleBackFromList}>
              ← Voltar
            </button>
          </div>
          <h1 className="app-title">Solve Coagula</h1>
          <p className="app-subtitle">Fichas de {view.player.name}</p>

          {error && <div className="error">{error}</div>}

          <h2 className="list-section-title">Fichas de personagem</h2>
          <div className="char-list">
            {view.characters.map((c) => (
              <div key={c.id} className="char-card" onClick={() => handleSelectCharacter(c)}>
                <div className="char-info">
                  <div className="char-name">{c.bruxo || 'Sem nome'}</div>
                  <div className="char-player">Jogador: {c.jogador || '—'}</div>
                  <div className="char-date">Atualizado: {new Date(c.updated_at).toLocaleDateString('pt-BR')}</div>
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => { e.stopPropagation(); handleDeleteCharacter(c.id) }}
                >
                  🗑️
                </button>
              </div>
            ))}

            {view.characters.length === 0 && (
              <p className="empty">Nenhuma ficha criada ainda.</p>
            )}
          </div>

          <button className="btn-primary" onClick={handleCreateCharacter} disabled={loading}>
            {loading ? 'Criando…' : '+ Nova Ficha'}
          </button>

          <h2 className="list-section-title">Fichas de assalto</h2>
          <div className="char-list">
            {view.heists.map((h) => (
              <div key={h.id} className="char-card" onClick={() => handleSelectHeist(h)}>
                <div className="char-info">
                  <div className="char-name">{h.nome_real || h.nome_disfarce || 'Sem nome'}</div>
                  <div className="char-player">{h.local_base || '—'}</div>
                  <div className="char-date">Atualizado: {new Date(h.updated_at).toLocaleDateString('pt-BR')}</div>
                </div>
                <button
                  className="btn-delete"
                  onClick={(e) => { e.stopPropagation(); handleDeleteHeist(h.id) }}
                >
                  🗑️
                </button>
              </div>
            ))}

            {view.heists.length === 0 && (
              <p className="empty">Nenhuma ficha de assalto ainda.</p>
            )}
          </div>

          <button className="btn-primary" onClick={handleCreateHeist} disabled={loading}>
            {loading ? 'Criando…' : '+ Ficha de Assalto'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container login-container">
        <h1 className="app-title">Solve Coagula</h1>
        <p className="app-subtitle">RPG de Mesa</p>

        {error && <div className="error">{error}</div>}

        <div className="login-form">
          <label className="login-label">Seu nome</label>
          <input
            className="login-input"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Digite seu nome de jogador"
          />
          <button className="btn-primary" onClick={handleLogin} disabled={loading || !playerName.trim()}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  )
}
