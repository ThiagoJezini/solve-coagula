import { PipTracker } from './PipTracker'

interface FocoProps {
  cargas: number
  descricao: string
  onCargasChange: (value: number) => void
  onDescricaoChange: (value: string) => void
}

export function Foco({ cargas, descricao, onCargasChange, onDescricaoChange }: FocoProps) {
  const ativo = cargas > 0
  return (
    <div className={`foco ${ativo ? 'foco-ativo' : ''}`}>
      <div className="foco-header">
        <div className="foco-stamp">
          <span className="foco-stamp-label">ESPÉCIME</span>
          <span className="foco-stamp-num">Nº {String(cargas).padStart(2, '0')}/05</span>
        </div>
        <div className="foco-title-block">
          <h3 className="foco-title">FOCO</h3>
          <span className="foco-subtitle">item canalizador · transmutação</span>
        </div>
        <div className="foco-stamp foco-stamp-end">
          <span className="foco-stamp-label">STATUS</span>
          <span className="foco-stamp-num">{ativo ? 'CARREGADO' : 'VAZIO'}</span>
        </div>
      </div>

      <div className="foco-body">
        <div className="foco-corner foco-corner-tl" />
        <div className="foco-corner foco-corner-tr" />
        <div className="foco-corner foco-corner-bl" />
        <div className="foco-corner foco-corner-br" />

        {ativo && (
          <div className="foco-seal">
            <span className="foco-seal-ring" />
            <span className="foco-seal-text">CARREGADO</span>
          </div>
        )}

        <div className="foco-field">
          <label className="foco-field-label">DESCRIÇÃO VISUAL</label>
          <textarea
            className={`foco-desc ${ativo ? 'foco-desc-with-seal' : ''}`}
            value={descricao}
            onChange={(e) => onDescricaoChange(e.target.value)}
            placeholder="Aspecto do item observado. aparências enganam. anote cada detalhe que considerar relevante…"
          />
        </div>
      </div>

      <div className="foco-footer">
        <div className="foco-footer-label">
          <span className="foco-footer-name">CARGAS</span>
          <span className="foco-footer-help">1 por dia · canaliza transmutação</span>
        </div>
        <PipTracker value={cargas} onChange={onCargasChange} shape="circle" />
      </div>
    </div>
  )
}
