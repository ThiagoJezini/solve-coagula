import { useState, useEffect } from 'react'
import type { Player, Character } from './types'
import { getOrCreatePlayer, getCharacters, createCharacter, deleteCharacter } from './lib/localApi'
import { CharacterSheet } from './CharacterSheet'
import './App.css'

type View = { screen: 'login' } | { screen: 'list'; player: Player; characters: Character[] } | { screen: 'sheet'; character: Character; player: Player }

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
      const chars = await getCharacters(player.id)
      setView({ screen: 'list', player, characters: chars })
    } catch (err) {
      let msg = 'erro desconhecido'
      if (err && typeof err === 'object') {
        const e = err as { message?: string; error_description?: string; details?: string; hint?: string; code?: string }
        msg = e.message || e.error_description || e.details || e.hint || e.code || JSON.stringify(err)
      } else if (typeof err === 'string') {
        msg = err
      }
      console.error('Login error:', err)
      setError('Erro ao entrar: ' + msg)
    } finally {
      setLoading(false)
    }
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
      const chars = await getCharacters(view.player.id)
      setView({ screen: 'list', player: view.player, characters: chars })
    } catch {
      setError('Erro ao deletar ficha.')
    }
  }

  function handleSelectCharacter(char: Character) {
    if (view.screen !== 'list') return
    setView({ screen: 'sheet', character: char, player: view.player })
  }

  function handleBack() {
    if (view.screen === 'sheet') {
      getCharacters(view.player.id).then((chars) => {
        setView({ screen: 'list', player: view.player, characters: chars })
      })
    }
  }

  if (view.screen === 'sheet') {
    return <CharacterSheet character={view.character} onBack={handleBack} />
  }

  if (view.screen === 'list') {
    return (
      <div className="app">
        <div className="container">
          <div className="toolbar-list">
            <button className="btn-back" onClick={() => setView({ screen: 'login' })}>
              ← Voltar
            </button>
          </div>
          <h1 className="app-title">Solve Coagula</h1>
          <p className="app-subtitle">Fichas de {view.player.name}</p>

          {error && <div className="error">{error}</div>}

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
