import { useState, useEffect, useRef } from 'react'
import type { Heist } from '../types'
import { updateHeist } from '../lib/api'

interface HeistSheetProps {
  heist: Heist
  onBack: () => void
}

function PipTracker({ value, onChange, count = 5 }: { value: number; onChange: (v: number) => void; count?: number }) {
  return (
    <div className="pip-row" style={{ gap: 4 }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`pip circle ${i < value ? 'filled' : ''}`}
          onClick={() => onChange(i + 1 === value ? i : i + 1)}
          style={{ width: 22, height: 22, cursor: 'pointer' }}
        />
      ))}
    </div>
  )
}

function Relogio({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const segmentos = 4
  return (
    <svg viewBox="0 0 100 100" width={120} height={120} style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="46" fill="var(--paper)" stroke="#000" strokeWidth="2" />
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
    </svg>
  )
}

function PhaseCheck({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="heist-phase-item" onClick={onToggle}>
      <span className={`heist-checkbox ${checked ? 'checked' : ''}`}>
        {checked ? '✓' : ''}
      </span>
      <span className="heist-phase-label">{label}</span>
    </div>
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

  return (
    <div className="app">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Voltar</button>
        <button className="btn-pdf" onClick={() => window.print()}>🖨️ PDF</button>
        <span className="status">{status}</span>
      </div>

      <div className="page heist-page">
        <h1 className="heist-title">Ficha de planejamento</h1>

        <div className="heist-grid">
          <div className="heist-col-left">
            <Field label="Nome Real">
              <input
                className="heist-input"
                value={data.nome_real}
                onChange={(e) => handle('nome_real')(e.target.value)}
                placeholder="Como a base é conhecida"
              />
            </Field>

            <Field label="Nome de Disfarce">
              <input
                className="heist-input"
                value={data.nome_disfarce}
                onChange={(e) => handle('nome_disfarce')(e.target.value)}
                placeholder="Como a base é chamada por fora"
              />
            </Field>

            <Field label="Local da Base">
              <input
                className="heist-input"
                value={data.local_base}
                onChange={(e) => handle('local_base')(e.target.value)}
                placeholder="Endereço, fachada, aparência externa"
              />
            </Field>

            <Field label="Defesas">
              <textarea
                className="heist-textarea"
                value={data.defesas_texto}
                onChange={(e) => handle('defesas_texto')(e.target.value)}
                placeholder="Liste as defesas da base (muros, portões, câmeras, alarmes…). Uma por linha."
              />
              <p className="heist-help">
                Se descoberta durante a Fase 2, personagens ganham <strong>+1</strong> nos testes contra a defesa.
              </p>
            </Field>

            <Field label="Falha de Segurança">
              <div className="heist-checkbox-row">
                <span
                  className={`heist-checkbox ${data.falha_descoberta ? 'checked' : ''}`}
                  onClick={() => handle('falha_descoberta')(!data.falha_descoberta)}
                />
                <span className="heist-help-inline">marcada = descoberta na Fase 2</span>
              </div>
              <textarea
                className="heist-textarea"
                value={data.falha_texto}
                onChange={(e) => handle('falha_texto')(e.target.value)}
                placeholder="Descreva a falha específica dessa base…"
              />
            </Field>

            <Field label="Salas da Base" big>
              <p className="heist-help">Se descoberta, durante a Fase 2 os testes na sala têm +1.</p>
              <div className="heist-rooms">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="heist-room">
                    <div className="heist-room-head">
                      <span className="heist-room-title">Sala {i + 1}</span>
                    </div>
                    <textarea
                      className="heist-room-desc"
                      value={data.anotacoes.split('|SALA|')[i + 1] ?? ''}
                      onChange={(e) => {
                        const parts = (data.anotacoes.split('|SALA|').length === 5
                          ? data.anotacoes.split('|SALA|')
                          : ['', '', '', '', '']).slice()
                        parts[i + 1] = e.target.value
                        handle('anotacoes')(parts.join('|SALA|'))
                      }}
                      placeholder="Descrição da sala…"
                    />
                  </div>
                ))}
              </div>
              <div className="heist-room-dots">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="heist-room-dot" />
                ))}
              </div>
            </Field>
          </div>

          <div className="heist-col-right">
            <Field label="Fase do Assalto" big>
              <div className="heist-phases">
                <PhaseCheck
                  label="Fase 1 — Levantamento de informações: descobrir detalhes da base sem levantar suspeitas"
                  checked={data.fase_atual >= 1}
                  onToggle={() => handle('fase_atual')(1)}
                />
                <PhaseCheck
                  label="Fase 2 — Execução: a própria invasão"
                  checked={data.fase_atual >= 2}
                  onToggle={() => handle('fase_atual')(2)}
                />
                <PhaseCheck
                  label="Fase 3 — Desfecho: consequências, fuga ou confronto com a Mão"
                  checked={data.fase_atual >= 3}
                  onToggle={() => handle('fase_atual')(3)}
                />
              </div>
            </Field>

            <Field label="Nível de Suspeita">
              <div className="heist-suspeita">
                <PipTracker
                  value={data.suspeita}
                  onChange={handle('suspeita')}
                  count={5}
                />
              </div>
              <p className="heist-help">
                Marca um x para cada nível ganho. Teste de info na Fase 1: +1 sucesso / +2 falha. Jogador pode despistar (-1).
              </p>
            </Field>

            <Field label="Relógio de Execução">
              <div className="heist-relogio-wrap">
                <Relogio value={data.relogio} onChange={handle('relogio')} />
                <div className="heist-relogio-help">
                  <p>O relógio é uma abstração de tensão. Marca 1 segmento por teste falho em sala ou por chamar atenção demais.</p>
                  <p>Se <strong>4 segmentos</strong> forem marcados → <strong>lockdown</strong>: perdem o objetivo, fase 3 sem benefício.</p>
                  <p>Ao <strong>avançar pra fase 3</strong>: adicione <strong>reforços</strong> à cena.</p>
                </div>
              </div>
            </Field>

            <Field label="Reforço">
              <input
                className="heist-input"
                value={data.reforco}
                onChange={(e) => handle('reforco')(e.target.value)}
                placeholder="Qual tropa de reforço chamar"
              />
            </Field>

            <Field label="Objetivo">
              <input
                className="heist-input"
                value={data.objetivo}
                onChange={(e) => handle('objetivo')(e.target.value)}
                placeholder="O que está preso na base"
              />
            </Field>
          </div>
        </div>

        <Field label="Anotações" big>
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
        </Field>
      </div>
    </div>
  )
}

function Field({ label, children, big = false }: { label: string; children: React.ReactNode; big?: boolean }) {
  return (
    <div className={`heist-field ${big ? 'heist-field-big' : ''}`}>
      <label className="heist-field-label">{label}</label>
      {children}
    </div>
  )
}
