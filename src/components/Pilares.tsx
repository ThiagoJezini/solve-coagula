import { PipTracker } from './PipTracker'
import conIcon from '../assets/pilar-con.png'
import espIcon from '../assets/pilar-esp.png'
import corIcon from '../assets/pilar-cor.png'
import natIcon from '../assets/pilar-nat.png'
import leiIcon from '../assets/pilar-lei.png'

interface PilarData {
  key: string
  label: string
  pilarValue: number
  maldicoes: number
  ferimentos: number
  onPilarChange: (value: number) => void
}

interface PilaresProps {
  pilares: PilarData[]
}

const ICONS: Record<string, string> = {
  consciencia: conIcon,
  espirito: espIcon,
  corpo: corIcon,
  natureza: natIcon,
  leis: leiIcon,
}

export function Pilares({ pilares }: PilaresProps) {
  return (
    <div className="section-wrap">
      <div className="section-title">
        <span>Pilares</span>
      </div>
      <div className="section-content">
        <div className="pilares-row">
          {pilares.map((p) => {
            const dt = Math.max(1, 7 - p.pilarValue + p.maldicoes + p.ferimentos)
            const tipos: string[] = []
            if (p.maldicoes > 0) tipos.push(`${p.maldicoes} maldição`)
            if (p.ferimentos > 0) tipos.push(`${p.ferimentos} ferimento`)
            const icon = ICONS[p.key]
            return (
              <div key={p.key} className="pilar">
                <div className="pilar-title">{p.label}</div>
                {icon && <img src={icon} alt="" className="pilar-icon" />}
                <div className="pilar-body">
                  <PipTracker value={p.pilarValue} onChange={p.onPilarChange} direction="column" />
                  <div className="pilar-dt-big">{dt}</div>
                </div>
                {tipos.length > 0 && (
                  <div className="pilar-penalidade">+{tipos.join(' + ')}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
