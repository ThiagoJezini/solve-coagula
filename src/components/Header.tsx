interface HeaderProps {
  jogador: string
  alquimista: string
  xp: number
  onJogadorChange: (value: string) => void
  onAlquimistaChange: (value: string) => void
  onXpChange: (value: number) => void
}

export function Header({ jogador, alquimista, xp, onJogadorChange, onAlquimistaChange, onXpChange }: HeaderProps) {
  return (
    <header className="sheet-header">
      <div className="sheet-title-wrap">
        <h1 className="sheet-title">Solve Coagula</h1>
      </div>
      <div className="id-fields">
        <div className="id-row">
          <label>Jogador</label>
          <input value={jogador} onChange={(e) => onJogadorChange(e.target.value)} placeholder="seu nome de jogador" />
        </div>
        <div className="id-row">
          <label>Alquimista</label>
          <input
            value={alquimista}
            onChange={(e) => onAlquimistaChange(e.target.value)}
            placeholder="nome do alquimista"
          />
        </div>
        <div className="xp-block">
          <div className="xp-label">XP</div>
          <input
            type="number"
            className="xp-circle"
            value={xp}
            onChange={(e) => onXpChange(parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </div>
    </header>
  )
}
