import { useState, useEffect, useRef } from 'react'
import { MALDICOES_POR_PILAR, MALDICOES_DETALHES } from '../lib/maldicoes'
import { useDraggable } from '../hooks/useDraggable'

interface MaldicoesProps {
  descricao: string
  selected: string[]
  onDescricaoChange: (value: string) => void
  onSelectedChange: (value: string[]) => void
}

export function Maldicoes({
  descricao,
  selected,
  onDescricaoChange,
  onSelectedChange,
}: MaldicoesProps) {
  const [showSeletor, setShowSeletor] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const selDrag = useDraggable()

  useEffect(() => {
    if (showSeletor && addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect()
      setPopupPosition({
        top: rect.bottom + 8,
        left: Math.max(10, rect.right - 525),
      })
    }
  }, [showSeletor])

  useEffect(() => {
    if (!showSeletor) return
    const handleResize = () => {
      if (addButtonRef.current) {
        const rect = addButtonRef.current.getBoundingClientRect()
        setPopupPosition({
          top: rect.bottom + 8,
          left: Math.max(10, rect.right - 525),
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showSeletor])

  const total = selected.length
  const totalPenalidade = total

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onSelectedChange(selected.filter((s) => s !== id))
    } else {
      onSelectedChange([...selected, id])
    }
  }

  const removeItem = (id: string) => {
    onSelectedChange(selected.filter((s) => s !== id))
  }

  const itensPorPilar = Object.keys(MALDICOES_POR_PILAR).map((pilar) => ({
    pilar,
    itens: selected.filter((id) =>
      MALDICOES_POR_PILAR[pilar]?.includes(id)
    ),
  })).filter((g) => g.itens.length > 0)

  return (
    <>
      <div className="section-wrap">
        <div className="section-title">
          <span>Maldições</span>
          <div className="section-title-actions">
            {totalPenalidade > 0 && (
              <span className="maldicao-penalidade-total">+{totalPenalidade} DT por maldição</span>
            )}
            <button
              ref={addButtonRef}
              className="btn-add-section"
              onClick={(e) => {
                e.stopPropagation()
                setShowSeletor(!showSeletor)
              }}
              title="Adicionar maldição"
            >
              +
            </button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="vd-selecionados">
            {itensPorPilar.map((g) => (
              <div key={g.pilar} className="vd-grupo">
                <div className="vd-grupo-label desv">{g.pilar} ({g.itens.length})</div>
                {g.itens.map((id) => {
                  const detalhe = MALDICOES_DETALHES[id]
                  if (!detalhe) return null
                  return (
                    <div key={id} className="vd-item desv">
                      <div className="vd-item-info">
                        <strong>{id}</strong>
                        <span className="vd-item-efeito">{detalhe.efeito}</span>
                        <span className="vd-item-mec">⚙ {detalhe.mecanica}</span>
                      </div>
                      <button
                        className="vd-remove"
                        onClick={() => removeItem(id)}
                        title="Remover"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        <textarea
          className="transmut-body"
          value={descricao}
          onChange={(e) => onDescricaoChange(e.target.value)}
          placeholder="Anotações adicionais sobre maldições…"
        />

        <div className="maldicao-remove">
          <strong>Remover todas:</strong> Encontrar e consumir uma anomalia (teste DT 7)
        </div>
      </div>

      {showSeletor && (
        <div
          {...selDrag}
          className="popup-floating vd-popup"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            ...selDrag.style,
          }}
        >
          <div className="popup-header">
            <div className="popup-title">Escolher Maldições</div>
            <button
              className="popup-close"
              onClick={() => setShowSeletor(false)}
            >
              ✕
            </button>
          </div>

          <div className="vd-lista">
            {Object.entries(MALDICOES_POR_PILAR).map(([pilar, lista]) => (
              <div key={pilar} className="vd-grupo-popup">
                <div className="vd-grupo-popup-label">{pilar}</div>
                {lista.map((nome) => {
                  const detalhe = MALDICOES_DETALHES[nome]
                  const isSelected = selected.includes(nome)
                  return (
                    <div
                      key={nome}
                      className={`vd-opcao ${isSelected ? 'selecionada' : ''}`}
                      onClick={() => toggle(nome)}
                    >
                      <div className={`vd-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected ? '✓' : ''}
                      </div>
                      <div className="vd-opcao-info">
                        <div className="vd-opcao-nome">{nome}</div>
                        {detalhe && (
                          <>
                            <div className="vd-opcao-efeito">{detalhe.efeito}</div>
                            <div className="vd-opcao-cat">⚙ {detalhe.mecanica}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="vd-footer">
            Selecionadas: <strong>{selected.length}</strong> (sem limite)
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
