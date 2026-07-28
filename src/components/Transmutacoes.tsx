import { useState, useEffect, useRef } from 'react'
import { TRANSMUTACOES } from '../lib/transmutacoes'
import { useDraggable } from '../hooks/useDraggable'

interface TransmutacoesProps {
  transmutacoes: string
  selected: string[]
  pilares: {
    key: string
    label: string
    value: number
  }[]
  onTransmutacoesChange: (value: string) => void
  onSelectedChange: (value: string[]) => void
}

const TRANSMUTACOES_POR_PILAR = TRANSMUTACOES

const TABELA_CATEGORIAS = [
  { pts: 1, dist: 'Apenas você', qtd: '1 unidade', tam: 'seu tamanho' },
  { pts: 2, dist: 'Ao seu toque', qtd: '2 unidades', tam: '1.5 metros' },
  { pts: 3, dist: 'Distância próxima', qtd: '6 unidades', tam: '3 metros' },
  { pts: 4, dist: 'Do outro lado da rua', qtd: '10 unidades', tam: '7 metros' },
  { pts: 5, dist: 'No fim da outra esquina', qtd: '20 unidades', tam: '10 metros' },
]

export function Transmutacoes({
  transmutacoes,
  selected,
  pilares,
  onTransmutacoesChange,
  onSelectedChange,
}: TransmutacoesProps) {
  const [showCategorias, setShowCategorias] = useState(false)
  const [pilaresAbertos, setPilaresAbertos] = useState<Record<string, boolean>>({})
  const [showSeletor, setShowSeletor] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
  const [categoriaPopupPosition, setCategoriaPopupPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const catDrag = useDraggable()
  const selDrag = useDraggable()

  useEffect(() => {
    if (showCategorias && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCategoriaPopupPosition({
        top: rect.bottom + 8,
        left: rect.left + window.scrollX,
      })
    }
  }, [showCategorias])

  useEffect(() => {
    if (!showCategorias) return
    const handleResize = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCategoriaPopupPosition({
          top: rect.bottom + 8,
          left: rect.left + window.scrollX,
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showCategorias])

  useEffect(() => {
    if (showSeletor && addButtonRef.current) {
      const rect = addButtonRef.current.getBoundingClientRect()
      setPopupPosition({
        top: rect.bottom + 8,
        left: Math.max(10, rect.right - 600),
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
          left: Math.max(10, rect.right - 600),
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showSeletor])

  const pilaresComTransmutacoes = Object.keys(TRANSMUTACOES_POR_PILAR).map((label) => {
  const found = pilares.find((p) => p.label === label)
  return { key: label, label, value: found?.value || 0 }
})

  const toggle = (nome: string) => {
    if (selected.includes(nome)) {
      onSelectedChange(selected.filter((s) => s !== nome))
    } else {
      onSelectedChange([...selected, nome])
    }
  }

  const removeItem = (nome: string) => {
    onSelectedChange(selected.filter((s) => s !== nome))
  }

  const getItemInfo = (nome: string) => {
    for (const [pilar, lista] of Object.entries(TRANSMUTACOES_POR_PILAR)) {
      const item = lista.find((t) => t.nome === nome)
      if (item) return { ...item, pilar }
    }
    return null
  }

  const itensPorPilar = pilaresComTransmutacoes.map((p) => ({
    pilar: p.label,
    itens: selected.filter((nome) =>
      TRANSMUTACOES_POR_PILAR[p.label]?.some((t) => t.nome === nome)
    ),
  })).filter((g) => g.itens.length > 0)

  const togglePilarAberto = (pilar: string) => {
    setPilaresAbertos((prev) => ({ ...prev, [pilar]: prev[pilar] === undefined ? false : !prev[pilar] }))
  }

  return (
    <>
      <div className="section-wrap">
        <div className="section-title">
          <span>Transmutações</span>
          <div className="section-title-actions">
            <button
              ref={triggerRef}
              className={`btn-text-action ${showCategorias ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setShowCategorias(!showCategorias)
              }}
            >
              Tabela de Categorias
            </button>
            <button
              ref={addButtonRef}
              className="btn-add-section"
              onClick={(e) => {
                e.stopPropagation()
                setShowSeletor(!showSeletor)
              }}
              title="Adicionar transmutação"
            >
              +
            </button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="vd-selecionados">
            {itensPorPilar.map((g) => (
              <div key={g.pilar} className="vd-grupo">
                <div className="vd-grupo-label">{g.pilar} ({g.itens.length})</div>
                {g.itens.map((nome) => {
                  const info = getItemInfo(nome)
                  if (!info) return null
                  return (
                    <div
                      key={nome}
                      className="vd-item"
                    >
                      <div className="vd-item-info">
                        <strong>{info.nome}</strong>
                        <span className="vd-item-efeito vd-texto-longo">{info.efeito}</span>
                        {info.categoria && (
                          <span className="vd-item-cat">📐 {info.categoria}</span>
                        )}
                      </div>
                      <button
                        className="vd-remove"
                        onClick={() => removeItem(nome)}
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
          value={transmutacoes}
          onChange={(e) => onTransmutacoesChange(e.target.value)}
          placeholder="Anotações adicionais sobre transmutações…"
        />
      </div>

      {showCategorias && (
        <div
          {...catDrag}
          className="popup-floating"
          style={{
            top: `${categoriaPopupPosition.top}px`,
            left: `${categoriaPopupPosition.left}px`,
            ...catDrag.style,
          }}
        >
          <div className="popup-header">
            <div className="popup-title">Tabela de Categorias</div>
            <button
              className="popup-close"
              onClick={() => setShowCategorias(false)}
            >
              ✕
            </button>
          </div>
          <table className="tooltip-tabela">
            <thead>
              <tr>
                <th>Pts</th>
                <th>Distância</th>
                <th>Quantidade</th>
                <th>Tamanho</th>
              </tr>
            </thead>
            <tbody>
              {TABELA_CATEGORIAS.map((row) => (
                <tr key={row.pts}>
                  <td><strong>{row.pts}</strong></td>
                  <td>{row.dist}</td>
                  <td>{row.qtd}</td>
                  <td>{row.tam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            <div className="popup-title">Escolher Transmutações</div>
            <button
              className="popup-close"
              onClick={() => setShowSeletor(false)}
            >
              ✕
            </button>
          </div>

          <div className="vd-lista">
            {Object.entries(TRANSMUTACOES_POR_PILAR).map(([pilar, lista]) => {
              const isOpen = pilaresAbertos[pilar] !== false
              return (
                <div key={pilar} className="vd-grupo-popup">
                  <button
                    className="vd-grupo-popup-label vd-grupo-toggle"
                    onClick={() => togglePilarAberto(pilar)}
                  >
                    <span className="vd-grupo-seta">{isOpen ? '▼' : '▶'}</span>
                    <span>{pilar}</span>
                  </button>
                  {isOpen && lista.map((t) => {
                    const isSelected = selected.includes(t.nome)
                    return (
                      <div
                        key={t.nome}
                        className={`vd-opcao ${isSelected ? 'selecionada' : ''}`}
                        onClick={() => toggle(t.nome)}
                      >
                        <div className={`vd-checkbox ${isSelected ? 'checked' : ''}`}>
                          {isSelected ? '✓' : ''}
                        </div>
                        <div className="vd-opcao-info">
                          <div className="vd-opcao-nome">{t.nome}</div>
                          <div className="vd-opcao-efeito vd-texto-longo-popup">{t.efeito}</div>
                          {t.categoria && <div className="vd-opcao-cat">📐 {t.categoria}</div>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
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
