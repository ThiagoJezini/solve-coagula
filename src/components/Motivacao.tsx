interface MotivacaoProps {
  answers: string[]
  used: boolean[]
  onAnswerChange: (index: number, value: string) => void
  onUsedChange: (index: number, value: boolean) => void
}

const QUESTIONS = [
  'Porquê você está procurando seu mestre se você nem consegue se lembrar do nome dele?',
  'Qual a pessoa que você protege com sua própria vida?',
  'Porquê a sua relação com seu Foco te desperta uma nostalgia profunda?',
  'O que você mais odeia nessa cidade esfumaçada e com pouco sol?',
  'Porquê as pessoas tem que se esconder nesses andares inferiores enquanto os ricos ficam nas mansões na superfície?',
]

export function Motivacao({ answers, used, onAnswerChange, onUsedChange }: MotivacaoProps) {
  const usedCount = used.filter(Boolean).length
  const isEcho = usedCount >= 5

  const handleRiscarTodas = () => {
    if (isEcho) return
    used.forEach((_, i) => {
      if (!used[i]) onUsedChange(i, true)
    })
  }

  return (
    <div className="section-wrap">
      <div className="section-title">
        <span>Motivação</span>
        {!isEcho && (
          <div className="section-title-actions">
            <button
              className="btn-text-action"
              onClick={handleRiscarTodas}
              title="Riscar todas as motivações"
            >
              ✕ Riscar Todas
            </button>
          </div>
        )}
      </div>

      {isEcho && (
        <div className="eco-warning">
          Todas as motivações foram usadas. Você se tornou um ECO.
        </div>
      )}

      <div className="section-content motivacao-content">
        {QUESTIONS.map((q, i) => (
          <div key={i} className={`qa ${used[i] ? 'qa-used' : ''}`}>
            <div className="q-header">
              <div className="q">{q}</div>
              {!used[i] && !isEcho && (
                <button
                  className="btn-riscar-motivacao"
                  onClick={() => onUsedChange(i, true)}
                  title="Riscar esta motivação"
                >
                  ✕
                </button>
              )}
              {used[i] && (
                <span
                  className="btn-riscar-motivacao riscada"
                  onClick={() => onUsedChange(i, false)}
                  title="Restaurar motivação"
                >
                  ✕
                </span>
              )}
            </div>
            <textarea
              className="a"
              value={answers[i] || ''}
              onChange={(e) => onAnswerChange(i, e.target.value)}
            />
            {used[i] && (
              <div className="motivacao-used-label">
                Utilizada — apenas apatia permanece
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
