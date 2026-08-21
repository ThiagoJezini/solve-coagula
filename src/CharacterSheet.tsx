import { useState, useEffect, useCallback, useRef } from 'react'
import type { Character } from './types'
import { updateCharacter } from './lib/api'
import { countMaldicoesPorPilar } from './lib/maldicoes'
import { calcularPenalidadePorFerimentos, type Pilar } from './lib/ferimentos'
import { Header } from './components/Header'
import { Pilares } from './components/Pilares'
import { Foco } from './components/Foco'
import { Trackers } from './components/Trackers'
import { Ferimentos } from './components/Ferimentos'
import { Maldicoes } from './components/Maldicoes'
import { Motivacao } from './components/Motivacao'
import { Transmutacoes } from './components/Transmutacoes'
import { Tabs } from './components/Tabs'
import { Vantagens } from './components/Vantagens'

interface CharacterSheetProps {
  character: Character
  onBack: () => void
}

export function CharacterSheet({ character, onBack }: CharacterSheetProps) {
  const [data, setData] = useState<Character>(character)
  const [status, setStatus] = useState('carregando…')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      setStatus('ficha carregada')
    }
  }, [])

  const save = useCallback(async (updates: Partial<Character>) => {
    try {
      setStatus('salvando…')
      await updateCharacter(data.id, updates)
      setStatus('salvo ✓')
    } catch {
      setStatus('erro ao salvar')
    }
  }, [data.id])

  const scheduleSave = useCallback((updates: Partial<Character>) => {
    setData((prev) => ({ ...prev, ...updates }))
    setStatus('editando…')

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(updates), 700)
  }, [save])

  const handle = (key: keyof Character) => (value: string | number | boolean) => {
    scheduleSave({ [key]: value } as Partial<Character>)
  }

  const handleArray = (key: keyof Character) => (value: string[]) => {
    scheduleSave({ [key]: value } as Partial<Character>)
  }

  const pilares = [
    { key: 'consciencia', label: 'Consciência', numKey: 'num_consciencia' as const, pilarKey: 'pilar_consciencia' as const },
    { key: 'espirito', label: 'Espírito', numKey: 'num_espirito' as const, pilarKey: 'pilar_espirito' as const },
    { key: 'corpo', label: 'Corpo', numKey: 'num_corpo' as const, pilarKey: 'pilar_corpo' as const },
    { key: 'natureza', label: 'Natureza', numKey: 'num_natureza' as const, pilarKey: 'pilar_natureza' as const },
    { key: 'leis', label: 'Leis', numKey: 'num_leis' as const, pilarKey: 'pilar_leis' as const },
  ]

  const maldicoesSelecionadas = data.maldicoes_selected || []
  const maldicoesCount = countMaldicoesPorPilar(maldicoesSelecionadas)

  const ferimentosSelecionados = data.ferimentos_selected || []

  const handleStressChange = (value: number) => {
    const max = 5
    let newStress = Math.min(max, value)
    let newRisco = data.risco_de_vida || 0

    if (value > max) {
      const excess = value - max
      newStress = excess
      newRisco = Math.min(5, newRisco + 1)
    } else if (value === max && (data.stress || 0) < max) {
      newStress = 0
      newRisco = Math.min(5, newRisco + 1)
    }

    const newMorrendo = newRisco >= max
    scheduleSave({ stress: newStress, risco_de_vida: newRisco, morrendo: newMorrendo })
  }

  const handleRiscoChange = (value: number) => {
    const max = 5
    const newRisco = Math.min(max, value)
    const newMorrendo = newRisco >= max

    scheduleSave({ risco_de_vida: newRisco, morrendo: newMorrendo })
  }

  const handleDescansar = () => {
    scheduleSave({
      stress: 0,
      risco_de_vida: Math.max(0, (data.risco_de_vida || 0) - 1),
    })
    setStatus('descansou ✓')
  }

  

  return (
    <div className="app">
      <div className="toolbar">
        <button className="btn-back" onClick={onBack}>← Voltar</button>
        <button className="btn-descansar" onClick={handleDescansar}>
          🛏️ Descansar
        </button>
        <span className="status">{status}</span>
      </div>

      <div className="page">
        <Header
          jogador={data.jogador || ''}
          bruxo={data.bruxo || ''}
          xp={data.xp || 0}
          onJogadorChange={handle('jogador')}
          onBruxoChange={handle('bruxo')}
          onXpChange={handle('xp')}
        />

        <Pilares
          pilares={pilares.map((p) => ({
            key: p.key,
            label: p.label,
            pilarValue: data[p.pilarKey] || 0,
            maldicoes: maldicoesCount[p.label] || 0,
            ferimentos: calcularPenalidadePorFerimentos(ferimentosSelecionados, p.label as Pilar),
            onPilarChange: handle(p.pilarKey),
          }))}
        />

        <div className="row2">
          <Foco
            cargas={data.cargas_foco || 0}
            descricao={data.foco_descricao || ''}
            onCargasChange={handle('cargas_foco')}
            onDescricaoChange={handle('foco_descricao')}
          />
          <Trackers
            stress={data.stress || 0}
            riscoDeVida={data.risco_de_vida || 0}
            onStressChange={handleStressChange}
            onRiscoChange={handleRiscoChange}
          />
        </div>

        <Ferimentos
          ferimentos={data.ferimentos || ''}
          selected={data.ferimentos_selected || []}
          onFerimentosChange={handle('ferimentos')}
          onSelectedChange={handleArray('ferimentos_selected')}
        />

        <Tabs
          tabs={[
            {
              id: 'transmutacoes',
              label: 'Transmutações',
              content: (
                <Transmutacoes
                  transmutacoes={data.transmutacoes || ''}
                  selected={data.transmutacoes_selected || []}
                  pilares={pilares.map((p) => ({
                    key: p.key,
                    label: p.label,
                    value: data[p.numKey] || 0,
                  }))}
                  onTransmutacoesChange={handle('transmutacoes')}
                  onSelectedChange={handleArray('transmutacoes_selected')}
                />
              ),
            },
            {
              id: 'vantagens',
              label: 'Vantagens e Desvantagens',
              content: (
                <Vantagens
                  selected={data.vantagens_selected || []}
                  onSelectedChange={handleArray('vantagens_selected')}
                />
              ),
            },
            {
              id: 'motivacao',
              label: 'Motivação',
              content: (
                <Motivacao
                  answers={[data.q1, data.q2, data.q3, data.q4, data.q5].map((v) => v || '')}
                  used={[data.q1_used, data.q2_used, data.q3_used, data.q4_used, data.q5_used].map((v) => !!v)}
                  onAnswerChange={(i, value) => handle(`q${i + 1}` as keyof Character)(value)}
                  onUsedChange={(i, value) => handle(`q${i + 1}_used` as keyof Character)(value)}
                />
              ),
            },
            {
              id: 'maldicoes',
              label: 'Maldições',
              content: (
                <Maldicoes
                  descricao={data.maldicoes || ''}
                  selected={data.maldicoes_selected || []}
                  onDescricaoChange={handle('maldicoes')}
                  onSelectedChange={handleArray('maldicoes_selected')}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}