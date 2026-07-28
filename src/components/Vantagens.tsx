import { useState, useRef, useEffect } from 'react'
import { VANTAGENS, VANTAGEM_BY_ID, type Vantagem } from '../lib/vantagens'
import { useDraggable } from '../hooks/useDraggable'

interface VantagensProps {
  selected: string[]
  onSelectedChange: (value: string[]) => void
}

const TIPO_LABEL = {
  vantagem: 'Vantagens',
  desvantagem: 'Desvantagens',
}

export function Vantagens({ selected, onSelectedChange }: VantagensProps) {
  const [showSeletor, setShowSeletor] = useState(false)
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
  const [activeTab, setActiveTab] = useState<'vantagem' | 'desvantagem'>('vantagem')
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const popupDrag = useDraggable()

  useEffect(() => {
    if (showSeletor && addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect()
      setPopupPos({
        top: rect.bottom + 8,
        left: Math.max(10, rect.right - 620),
      })
    }
  }, [showSeletor])

  const toggle = (id: string) => {
    const v = VANTAGEM_BY_ID(id)
    if (!v) return
    if (selected.includes(id)) {
      const dependent = VANTAGENS.find((vd) => vd.requires === id)
      if (dependent && selected.includes(dependent.id)) {
        onSelectedChange(selected.filter((s) => s !== id && s !== dependent.id))
      } else {
        onSelectedChange(selected.filter((s) => s !== id))
      }
    } else {
      if (v.requires && !selected.includes(v.requires)) return
      onSelectedChange([...selected, id])
    }
  }

  const removeItem = (id: string) => {
    const dependent = VANTAGENS.find((vd) => vd.requires === id)
    if (dependent && selected.includes(dependent.id)) {
      onSelectedChange(selected.filter((s) => s !== id && s !== dependent.id))
    } else {
      onSelectedChange(selected.filter((s) => s !== id))
    }
  }

  const vantagens = VANTAGENS.filter((v) => v.tipo === 'vantagem')
  const desvantagens = VANTAGENS.filter((v) => v.tipo === 'desvantagem')

  const itemsPorTipo: Record<Vantagem['tipo'], Vantagem[]> = {
    vantagem: selected.filter((id) => VANTAGEM_BY_ID(id)?.tipo === 'vantagem').map((id) => VANTAGEM_BY_ID(id)!).filter(Boolean),
    desvantagem: selected.filter((id) => VANTAGEM_BY_ID(id)?.tipo === 'desvantagem').map((id) => VANTAGEM_BY_ID(id)!).filter(Boolean),
  }

  const renderItem = (v: Vantagem) => {
    const isSelected = selected.includes(v.id)
    const locked = !!(v.requires && !selected.includes(v.requires))
    return (
      <div
        key={v.id}
        className={`vd-opcao ${isSelected ? 'selecionada' : ''} ${locked ? 'desabilitado' : ''}`}
        onClick={() => !locked && toggle(v.id)}
      >
        <div className={`vd-checkbox ${isSelected ? 'checked' : ''}`}>
          {isSelected ? '✓' : ''}
        </div>
        <div className="vd-opcao-info">
          <div className="vd-opcao-nome">
            {v.nome}
            {locked && <span className="vd-lock"> 🔒 requer {VANTAGEM_BY_ID(v.requires!)?.nome}</span>}
          </div>
          <div className="vd-opcao-efeito">{v.descricao}</div>
          <div className="vd-item-mec">⚙ {v.mecanica}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="section-wrap">
        <div className="section-title">
          <span>Vantagens e Desvantagens</span>
          <div className="section-title-actions">
            <button
              ref={addButtonRef}
              className="btn-add-section"
              onClick={(e) => {
                e.stopPropagation()
                setShowSeletor(!showSeletor)
              }}
              title="Adicionar vantagem ou desvantagem"
            >
              +
            </button>
          </div>
        </div>

        <div className="vd-selecionados">
          {(['vantagem', 'desvantagem'] as const).map((tipo) => (
            itemsPorTipo[tipo].length > 0 && (
              <div key={tipo} className="vd-grupo">
                <div className={`vd-grupo-label ${tipo === 'desvantagem' ? 'desv' : ''}`}>
                  {TIPO_LABEL[tipo]} ({itemsPorTipo[tipo].length})
                </div>
                {itemsPorTipo[tipo].map((v) => (
                  <div key={v.id} className={`vd-item ${tipo === 'desvantagem' ? 'desv' : ''}`}>
                    <div className="vd-item-info">
                      <strong>{v.nome}</strong>
                      <span className="vd-item-efeito">{v.descricao}</span>
                      <span className="vd-item-mec">⚙ {v.mecanica}</span>
                    </div>
                    <button
                      className="vd-remove"
                      onClick={() => removeItem(v.id)}
                      title="Remover"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )
          ))}
          {selected.length === 0 && (
            <div className="vd-empty">nenhuma vantagem ou desvantagem marcada · use o + acima</div>
          )}
        </div>
      </div>

      {showSeletor && (
        <div
          {...popupDrag}
          className="popup-floating vd-popup"
          style={{
            top: `${popupPos.top}px`,
            left: `${popupPos.left}px`,
            ...popupDrag.style,
          }}
        >
          <div className="popup-header">
            <div className="popup-title">Vantagens e Desvantagens</div>
            <button
              className="popup-close"
              onClick={() => setShowSeletor(false)}
            >
              ✕
            </button>
          </div>

          <div className="vd-tabs">
            <button
              className={`vd-tab ${activeTab === 'vantagem' ? 'active' : ''}`}
              onClick={() => setActiveTab('vantagem')}
            >
              Vantagens ({vantagens.length})
            </button>
            <button
              className={`vd-tab ${activeTab === 'desvantagem' ? 'active' : ''}`}
              onClick={() => setActiveTab('desvantagem')}
            >
              Desvantagens ({desvantagens.length})
            </button>
          </div>

          <div className="vd-lista">
            {activeTab === 'vantagem' && vantagens.map(renderItem)}
            {activeTab === 'desvantagem' && desvantagens.map(renderItem)}
          </div>

          <div className="vd-footer">
            Marcadas: <strong>{selected.length}</strong>
            <button
              className="vd-pronto"
              onClick={() => setShowSeletor(false)}
            >
              Pronto
            </button>
          </div>
        </div>
      )}
    </>
  )
}
