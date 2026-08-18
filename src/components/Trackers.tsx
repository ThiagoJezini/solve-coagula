import { useState, useEffect, useRef } from 'react'

interface TrackersProps {
  stress: number
  riscoDeVida: number
  onStressChange: (value: number) => void
  onRiscoChange: (value: number) => void
}

function rollDice(sides: number) {
  return Math.floor(Math.random() * sides) + 1
}

const STRESS_MAX = 5
const RISCO_MAX = 5

const STRESS_PALETTE = [
  '#b87a98',
  '#b8566f',
  '#a92a3a',
  '#7a1e1e',
  '#4a0e0e',
]

export function Trackers({ stress, riscoDeVida, onStressChange, onRiscoChange }: TrackersProps) {
  const [deathResult, setDeathResult] = useState<number | null>(null)
  const [lastRoll, setLastRoll] = useState('')
  const [localStress, setLocalStress] = useState(stress)
  const [exploding, setExploding] = useState(false)
  const blockingRef = useRef(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => { setLocalStress(stress) }, [stress])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
      timersRef.current = []
    }
  }, [])

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }

  const handleStressClick = (index: number) => {
    if (blockingRef.current) return

    const next = localStress === index + 1 ? index : index + 1
    if (next === STRESS_MAX) {
      clearTimers()
      blockingRef.current = true
      setLocalStress(STRESS_MAX)
      const t1 = window.setTimeout(() => {
        setExploding(true)
      }, 220)
      const t2 = window.setTimeout(() => {
        setLocalStress(0)
        onStressChange(0)
        onRiscoChange(Math.min(RISCO_MAX, riscoDeVida + 1))
        setExploding(false)
        blockingRef.current = false
      }, 900)
      timersRef.current = [t1, t2]
    } else {
      setLocalStress(next)
      onStressChange(next)
    }
  }

  const handleRiscoClick = (index: number) => {
    if (index + 1 === riscoDeVida) {
      onRiscoChange(index)
    } else {
      onRiscoChange(index + 1)
    }
  }

  const rollDeathCheck = () => {
    const result = rollDice(12)
    setDeathResult(result)
    if (result >= 7) {
      setLastRoll(`Sobreviveu (${result} ≥ 7)`)
    } else {
      setLastRoll(`MORTE (${result} < 7)`)
    }
  }

  const displayStress = exploding ? STRESS_MAX : localStress
  const riscoPct = (riscoDeVida / RISCO_MAX) * 100

  return (
    <div className="trackers">
      <header className="trackers-head">
        <span className="trackers-head-label">MARCADORES</span>
        <span className="trackers-head-line" />
        <span className="trackers-head-sub">corpo · integridade</span>
      </header>

      <div className={`tracker stress-tracker ${displayStress >= STRESS_MAX ? 'tracker-full' : ''} ${exploding ? 'tracker-exploding' : ''}`}>
        <div className="tracker-meta">
          <span className="tracker-sigil">𓂀</span>
          <div className="tracker-meta-text">
            <div className="tracker-name">STRESS</div>
            <div className="tracker-help">desgaste imediato · combate, dor, perigo</div>
          </div>
          <div className="tracker-count">
            <span className="tracker-count-num">{displayStress}</span>
            <span className="tracker-count-slash">/</span>
            <span className="tracker-count-max">{STRESS_MAX}</span>
          </div>
        </div>
        <div className="tracker-squares">
          {Array.from({ length: STRESS_MAX }, (_, i) => {
            const isFilled = i < displayStress
            const bgStyle = isFilled ? { background: STRESS_PALETTE[i] } : undefined
            return (
              <button
                key={i}
                className={`tracker-square ${isFilled ? 'filled' : ''}`}
                onClick={() => handleStressClick(i)}
                aria-label={`Stress ${i + 1}`}
                style={{ animationDelay: exploding ? `${i * 60}ms` : undefined, ...bgStyle }}
              >
                {isFilled ? '✕' : ''}
              </button>
            )
          })}
        </div>
      </div>

      <div className={`tracker risco-tracker ${riscoDeVida >= RISCO_MAX ? 'tracker-deadly' : ''}`}>
        <div className="tracker-meta">
          <span className="tracker-sigil">☠</span>
          <div className="tracker-meta-text">
            <div className="tracker-name">RISCO DE VIDA</div>
            <div className="tracker-help">dano duradouro · sequelas, ferimentos</div>
          </div>
          <div className="tracker-count danger">
            <span className="tracker-count-num">{riscoDeVida}</span>
            <span className="tracker-count-slash">/</span>
            <span className="tracker-count-max">{RISCO_MAX}</span>
          </div>
        </div>
        <div className="tracker-skulls">
          {Array.from({ length: RISCO_MAX }, (_, i) => (
            <button
              key={i}
              className={`tracker-skull ${i < riscoDeVida ? 'filled' : ''} ${i === RISCO_MAX - 1 && riscoDeVida >= RISCO_MAX ? 'bleeding' : ''}`}
              onClick={() => handleRiscoClick(i)}
              aria-label={`Risco de Vida ${i + 1}`}
            >
              <svg viewBox="0 0 24 24" className="skull-svg" aria-hidden="true">
                <path d="M12 2 C 7 2, 4 6, 4 11 C 4 14, 5 16, 7 17 L 7 21 L 9 21 L 9 19 L 11 19 L 11 21 L 13 21 L 13 19 L 15 19 L 15 21 L 17 21 L 17 17 C 19 16, 20 14, 20 11 C 20 6, 17 2, 12 2 Z" />
                <circle cx="9" cy="11" r="1.8" fill="currentColor" />
                <circle cx="15" cy="11" r="1.8" fill="currentColor" />
                <path d="M11 14 L 13 14" />
              </svg>
              {i < riscoDeVida && i === RISCO_MAX - 1 && riscoDeVida >= RISCO_MAX && (
                <span className="skull-drip" />
              )}
            </button>
          ))}
        </div>
        <div className="tracker-risco-bar">
          <div className="tracker-risco-fill" style={{ width: `${riscoPct}%` }} />
        </div>
      </div>

      {displayStress >= STRESS_MAX && !exploding && (
        <div className="tracker-banner">
          <span className="banner-pulse">●</span>
          STRESS CHEIO — zera, +1 Risco de Vida
        </div>
      )}

      {riscoDeVida >= 3 && riscoDeVida < RISCO_MAX && (
        <div className="tracker-banner danger">
          <span className="banner-pulse">▲</span>
          Rolar 1d6 na tabela de Ferimentos
        </div>
      )}

      {riscoDeVida >= RISCO_MAX && (
        <div className="tracker-death">
          <div className="tracker-death-header">
            <span className="death-sigil">✖</span>
            <span className="death-title">MORRENDO</span>
            <span className="death-sigil">✖</span>
          </div>
          <p className="tracker-death-text">cada estresse obriga teste contra morte</p>
          <button className="btn-death-roll" onClick={rollDeathCheck}>
            <span className="die-emoji">🎲</span>
            teste de morte (d12)
          </button>
          {deathResult !== null && (
            <div className={`death-result ${deathResult >= 7 ? 'alive' : 'dead'}`}>
              <strong>{deathResult}</strong>
              <span>{lastRoll}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
