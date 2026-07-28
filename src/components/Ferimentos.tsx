import { useState, useEffect, useRef } from 'react'
import { FERIMENTOS } from '../lib/ferimentos'
import { useDraggable } from '../hooks/useDraggable'

interface FerimentosProps {
  ferimentos: string
  selected: string[]
  onFerimentosChange: (value: string) => void
  onSelectedChange: (value: string[]) => void
}



export function Ferimentos({
  ferimentos,
  selected,
  onFerimentosChange,
  onSelectedChange,
}: FerimentosProps) {
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

  const toggle = (efeito: string) => {
    if (selected.includes(efeito)) {
      onSelectedChange(selected.filter((s) => s !== efeito))
    } else {
      onSelectedChange([...selected, efeito])
    }
  }

  const removeItem = (efeito: string) => {
    onSelectedChange(selected.filter((s) => s !== efeito))
  }

  

  return (
    <>
      <div className="section-wrap">
        <div className="section-title">
          <span>Ferimentos</span>
          <div className="section-title-actions">
            <button
              ref={addButtonRef}
              className="btn-add-section"
              onClick={(e) => {
                e.stopPropagation()
                setShowSeletor(!showSeletor)
              }}
              title="Adicionar ferimento"
            >
              +
            </button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="vd-selecionados">
            <div className="vd-grupo">
              <div className="vd-grupo-label fer">Ferimentos ({selected.length})</div>
              {selected.map((efeito, idx) => (
                <div key={idx} className="vd-item fer">
                  <div className="vd-item-info">
                    <span className="vd-item-efeito">{efeito}</span>
                  </div>
                  <button
                    className="vd-remove"
                    onClick={() => removeItem(efeito)}
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          className="transmut-body"
          value={ferimentos}
          onChange={(e) => onFerimentosChange(e.target.value)}
          placeholder="Anotações adicionais sobre ferimentos…"
          style={{ minHeight: '80px' }}
        />
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
            <div className="popup-title">Tabela de Ferimentos (1d6)</div>
            <button
              className="popup-close"
              onClick={() => setShowSeletor(false)}
            >
              ✕
            </button>
          </div>

          <div className="vd-lista">
            <div className="vd-grupo-popup">
              {FERIMENTOS.map((efeito) => {
                const isSelected = selected.includes(efeito)
                return (
                  <div
                    key={efeito}
                    className={`vd-opcao ${isSelected ? 'selecionada' : ''}`}
                    onClick={() => toggle(efeito)}
                  >
                    <div className={`vd-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected ? '✓' : ''}
                    </div>
                    <div className="vd-opcao-info">
                      <div className="vd-opcao-nome">{efeito}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="vd-footer">
            Selecionados: <strong>{selected.length}</strong> (sem limite)
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
