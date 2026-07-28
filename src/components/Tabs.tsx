import { useState, type ReactNode } from 'react'

interface TabsProps {
  tabs: { id: string; label: string; content: ReactNode }[]
  initial?: string
}

export function Tabs({ tabs, initial }: TabsProps) {
  const [active, setActive] = useState(initial || tabs[0]?.id)

  return (
    <div className="tabs-wrap">
      <nav className="tabs-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-btn ${t.id === active ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="tabs-panels">
        {tabs.map((t) => {
          const isActive = t.id === active
          return (
            <div
              key={t.id}
              className={`tabs-panel ${isActive ? 'active' : ''}`}
              hidden={!isActive}
              aria-hidden={!isActive}
            >
              <h2 className="tabs-title">{t.label}</h2>
              <div className="tabs-body">{t.content}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
