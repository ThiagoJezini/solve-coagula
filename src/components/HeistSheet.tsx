import { useState, useEffect, useRef } from 'react'
import type { Heist } from '../types'
import { updateHeist } from '../lib/api'

interface HeistSheetProps {
  heist: Heist
  onBack: () => void
}

function MagnifierTracker({ value, onChange, count = 5 }: { value: number; onChange: (v: number) => void; count?: number }) {
  return (
    <div className="magnifier-row">
      {Array.from({ length: count }, (_, i) => {
        const filled = i < value
        return (
          <button
            key={i}
            type="button"
            className={`magnifier ${filled ? 'filled' : ''}`}
            onClick={() => onChange(i + 1 === value ? i : i + 1)}
            aria-label={`Suspeita nível ${i + 1}`}
          >
            <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
              <circle cx="13" cy="13" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <line x1="19" y1="19" x2="26" y2="26" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              {filled && (
                <circle cx="13" cy="13" r="4.5" fill="currentColor" />
              )}
            </svg>
          </button>
        )
      })}
    </div>
  )
}

function Relogio({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const segmentos = 4
  return (
    <svg viewBox="0 0 100 100" width={140} height={140} style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="46" fill="var(--paper)" stroke="#000" strokeWidth="3" />
      {Array.from({ length: segmentos }, (_, i) => {
        const angle1 = (i * 360 / segmentos) - 90
        const angle2 = ((i + 1) * 360 / segmentos) - 90
        const rad1 = (angle1 * Math.PI) / 180
        const rad2 = (angle2 * Math.PI) / 180
        const x1 = 50 + 46 * Math.cos(rad1)
        const y1 = 50 + 46 * Math.sin(rad1)
        const x2 = 50 + 46 * Math.cos(rad2)
        const y2 = 50 + 46 * Math.sin(rad2)
        const filled = i < value
        return (
          <path
            key={i}
            d={`M 50 50 L ${x1} ${y1} A 46 46 0 0 1 ${x2} ${y2} Z`}
            fill={filled ? '#7a1e1e' : 'transparent'}
            stroke="#000"
            strokeWidth="2"
            onClick={() => onChange(i + 1 === value ? i : i + 1)}
            style={{ cursor: 'pointer' }}
          />
        )
      })}
      <circle cx="50" cy="50" r="6" fill="#000" />
    </svg>
  )
}

function PhaseCheck({ num, label, checked, active, onToggle }: { num: number; label: string; checked: boolean; active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`heist-phase-item ${active ? 'active' : ''} ${checked ? 'checked' : ''}`}
      onClick={onToggle}
    >
      <span className="heist-phase-num">{num}</span>
      <span className="heist-phase-text">{label}</span>
      <span className={`heist-checkbox ${checked ? 'checked' : ''}`}>
        {checked ? '✓' : ''}
      </span>
    </button>
  )
}

export function HeistSheet({ heist, onBack }: HeistSheetProps) {
  const [data, setData] = useState<Heist>(heist)
  const [status, setStatus] = useState('carregando…')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      setStatus('ficha carregada')
    }
  }, [])

  const save = async (updates: Partial<Heist>) => {
    try {
      setStatus('salvando…')
      await updateHeist(data.id, updates)
      setStatus('salvo ✓')
    } catch {
      setStatus('erro ao salvar')
    }
  }

  const handle = <K extends keyof Heist>(key: K) => (value: Heist[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setStatus('editando…')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save({ [key]: value } as Partial<Heist>), 700)
  }

  const faseAlerta = data.fase_atual >= 3
  const lockdown = data.relogio >= 4

  return (
    <div className="app">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Voltar</button>
        <button className="btn-pdf" onClick={() => window.print()}>🖨️ PDF</button>
        <span className="status">{status}</span>
      </div>

      <div className={`page heist-page ${faseAlerta ? 'fase-3' : ''} ${lockdown ? 'lockdown' : ''}`}>
        <header className="heist-header">
          <div className="heist-stamp">
            <span className="heist-stamp-label">ASSALTO</span>
            <span className="heist-stamp-num">Fase {data.fase_atual}/3</span>
          </div>
          <div className="heist-title-block">
            <h1 className="heist-title">Ficha de planejamento</h1>
            <span className="heist-subtitle">operação de invasão · fase {data.fase_atual} de 3</span>
          </div>
          <div className="heist-stamp heist-stamp-end">
            <span className="heist-stamp-label">STATUS</span>
            <span className="heist-stamp-num">{lockdown ? 'LOCKDOWN' : faseAlerta ? 'DESFECHO' : 'PLANEJANDO'}</span>
          </div>
        </header>

        {lockdown && (
          <div className="heist-alert">
            <span className="heist-alert-sigil">�</span>
            <span><strong>LOCKDOWN</strong> · 4 segmentos marcados · perdem o objetivo e o benefício da invasão. Avancem direto pra Fase 3.</span>
          </div>
        )}

        <div className="heist-body">
          <div className="heist-corner heist-corner-tl" />
          <div className="heist-corner heist-corner-tr" />
          <div className="heist-corner heist-corner-bl" />
          <div className="heist-corner heist-corner-br" />

          <section className="heist-section">
            <div className="heist-section-title">
              <span className="heist-section-sigil">🗝</span>
              <span>Identidade da Base</span>
            </div>
            <div className="heist-row-2col">
              <div className="heist-field-block">
                <label className="heist-label">Nome Real</label>
                <input
                  className="heist-input"
                  value={data.nome_real}
                  onChange={(e) => handle('nome_real')(e.target.value)}
                  placeholder="Como a base é conhecida"
                />
              </div>
              <div className="heist-field-block">
                <label className="heist-label">Nome de Disfarce</label>
                <input
                  className="heist-input"
                  value={data.nome_disfarce}
                  onChange={(e) => handle('nome_disfarce')(e.target.value)}
                  placeholder="Como é chamada por fora"
                />
              </div>
            </div>
            <div className="heist-field-block">
              <label className="heist-label">Local da Base</label>
              <input
                className="heist-input"
                value={data.local_base}
                onChange={(e) => handle('local_base')(e.target.value)}
                placeholder="Endereço, fachada, aparência externa"
              />
            </div>
          </section>

          <section className="heist-section">
            <div className="heist-section-title">
              <span className="heist-section-sigil">⚔</span>
              <span>Defesas da Base</span>
            </div>
            <div className="heist-field-block">
              <textarea
                className="heist-textarea"
                value={data.defesas_texto}
                onChange={(e) => handle('defesas_texto')(e.target.value)}
                placeholder="Liste as defesas da base (muros, portões, câmeras, alarmes…). Uma por linha."
              />
              <p className="heist-help-inline">
                Se descoberta durante a Fase 2, personagens ganham <strong>+1</strong> nos testes contra a defesa.
              </p>
            </div>
          </section>

          <section className="heist-section">
            <div className="heist-section-title">
              <span className="heist-section-sigil">🔓</span>
              <span>Falha de Segurança</span>
              <span
                className={`heist-mini-checkbox ${data.falha_descoberta ? 'checked' : ''}`}
                onClick={() => handle('falha_descoberta')(!data.falha_descoberta)}
                title="marcar como descoberta"
              >
                {data.falha_descoberta ? '✓' : ''}
              </span>
            </div>
            <div className="heist-field-block">
              <textarea
                className="heist-textarea"
                value={data.falha_texto}
                onChange={(e) => handle('falha_texto')(e.target.value)}
                placeholder="Descreva a falha específica dessa base…"
              />
              <p className="heist-help-inline">
                Marcada = descoberta na Fase 2 → <strong>+1 num teste</strong>.
              </p>
            </div>
          </section>

          <section className="heist-section heist-section-rooms">
            <div className="heist-section-title">
              <span className="heist-section-sigil">▤</span>
              <span>Salas da Base</span>
              <span className="heist-section-help-inline">+1 nos testes da sala se descoberta</span>
            </div>
            <div className="heist-rooms">
              {[0, 1, 2, 3].map((i) => {
                const salaPart = data.anotacoes.split('|SALA|')[i + 1] ?? ''
                const isDesc = salaPart.trim().length > 0
                return (
                  <div key={i} className={`heist-room ${isDesc ? 'descoberta' : ''}`}>
                    <div className="heist-room-head">
                      <span className="heist-room-num">SALA {i + 1}</span>
                      <span className="heist-room-tag">
                        {isDesc ? 'descoberta' : 'oculta'}
                      </span>
                    </div>
                    <textarea
                      className="heist-room-desc"
                      value={salaPart}
                      onChange={(e) => {
                        const parts = (data.anotacoes.split('|SALA|').length === 5
                          ? data.anotacoes.split('|SALA|')
                          : ['', '', '', '', '']).slice()
                        parts[i + 1] = e.target.value
                        handle('anotacoes')(parts.join('|SALA|'))
                      }}
                      placeholder="Descreva a sala, desafio, tipo…"
                    />
                  </div>
                )
              })}
            </div>
          </section>

          <div className="heist-row-2col heist-bottom-row">
            <div className="heist-field-block">
              <label className="heist-label">Reforço</label>
              <input
                className="heist-input"
                value={data.reforco}
                onChange={(e) => handle('reforco')(e.target.value)}
                placeholder="Qual tropa de reforço chamar"
              />
            </div>
            <div className="heist-field-block">
              <label className="heist-label">Objetivo</label>
              <input
                className="heist-input"
                value={data.objetivo}
                onChange={(e) => handle('objetivo')(e.target.value)}
                placeholder="O que está preso na base"
              />
            </div>
          </div>
        </div>

        <aside className="heist-side">
          <section className="heist-section heist-phases-section">
            <div className="heist-section-title">
              <span className="heist-section-sigil">⌬</span>
              <span>Fases do Assalto</span>
            </div>
            <div className="heist-phases">
              <PhaseCheck
                num={1}
                label="Levantamento de informações — descobrir detalhes da base sem levantar muitas suspeitas"
                checked={data.fase_atual >= 1}
                active={data.fase_atual === 1}
                onToggle={() => handle('fase_atual')(Math.max(1, data.fase_atual === 1 ? 0 : 1))}
              />
              <PhaseCheck
                num={2}
                label="Execução — a própria invasão, atravessando as 4 salas"
                checked={data.fase_atual >= 2}
                active={data.fase_atual === 2}
                onToggle={() => handle('fase_atual')(data.fase_atual >= 2 ? 1 : 2)}
              />
              <PhaseCheck
                num={3}
                label="Desfecho — consequências, fuga ou confronto com a Mão"
                checked={data.fase_atual >= 3}
                active={data.fase_atual === 3}
                onToggle={() => handle('fase_atual')(data.fase_atual >= 3 ? 2 : 3)}
              />
            </div>
          </section>

          <section className="heist-section">
            <div className="heist-section-title">
              <span className="heist-section-sigil">👁</span>
              <span>Nível de Suspeita</span>
            </div>
            <div className="heist-magnifier-row">
              <MagnifierTracker
                value={data.suspeita}
                onChange={handle('suspeita')}
                count={5}
              />
              <span className={`heist-pip-value ${data.suspeita >= 5 ? 'critical' : ''}`}>
                {data.suspeita}/5
              </span>
            </div>
            {data.suspeita >= 5 && (
              <div className="heist-warning-inline">
                ⚠ Suspeita no máximo — cena de caçada inicia imediatamente.
              </div>
            )}
            <p className="heist-help-block">
              Teste de info na Fase 1: +1 sucesso / +2 falha. Jogador pode despistar (−1).
            </p>
          </section>

          <section className="heist-section">
            <div className="heist-section-title">
              <span className="heist-section-sigil">⏱</span>
              <span>Relógio de Execução</span>
            </div>
            <div className="heist-relogio-wrap">
              <Relogio value={data.relogio} onChange={handle('relogio')} />
              <div className="heist-relogio-help">
                <p>Marca 1 segmento por teste falho em sala ou atenção demais.</p>
                <p>
                  Se <strong>4 segmentos</strong> → <strong>lockdown</strong>: perdem objetivo e o benefício da invasão.
                </p>
                <p>Avançando pra <strong>fase 3</strong>: adicione <strong>reforços</strong> à cena.</p>
              </div>
            </div>
          </section>
        </aside>

        <section className="heist-section heist-section-anotacoes">
          <div className="heist-section-title">
            <span className="heist-section-sigil">✎</span>
            <span>Anotações</span>
          </div>
          <textarea
            className="heist-anotacoes"
            value={data.anotacoes.split('|SALA|')[0] ?? ''}
            onChange={(e) => {
              const parts = (data.anotacoes.split('|SALA|').length === 5
                ? data.anotacoes.split('|SALA|')
                : ['', '', '', '', '']).slice()
              parts[0] = e.target.value
              handle('anotacoes')(parts.join('|SALA|'))
            }}
            placeholder="Anotações livres, estratégia, decisões, cenas…"
          />
        </section>
      </div>
    </div>
  )
}
