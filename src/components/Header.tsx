interface HeaderProps {
  jogador: string
  bruxo: string
  xp: number
  onJogadorChange: (value: string) => void
  onBruxoChange: (value: string) => void
  onXpChange: (value: number) => void
}

export function Header({ jogador, bruxo, xp, onJogadorChange, onBruxoChange, onXpChange }: HeaderProps) {
  return (
    <header className="sheet-header">
      <h1 className="sheet-title">Solve Coagula</h1>
      <div className="id-fields">
        <div className="id-row">
          <label>Jogador</label>
          <input
            type="text"
            value={jogador}
            onChange={(e) => onJogadorChange(e.target.value)}
            placeholder="nome do jogador"
          />
        </div>
        <div className="id-row">
          <label>Bruxo</label>
          <input
            type="text"
            value={bruxo}
            onChange={(e) => onBruxoChange(e.target.value)}
            placeholder="nome do bruxo"
          />
        </div>
      </div>
      <div className="xp-block">
        <div className="xp-label">XP</div>
        <input
          className="xp-circle"
          type="number"
          value={xp || ''}
          onChange={(e) => onXpChange(parseInt(e.target.value) || 0)}
          placeholder="0"
        />
      </div>
    </header>
  )
}
