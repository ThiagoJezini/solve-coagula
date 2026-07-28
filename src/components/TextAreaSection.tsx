interface TextAreaSectionProps {
  title: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  variant?: 'default' | 'dark'
}

export function TextAreaSection({ title, value, onChange, placeholder, variant = 'default' }: TextAreaSectionProps) {
  if (variant === 'dark') {
    return (
      <div className="section-wrap">
        <div className="section-title">
          <span>{title}</span>
        </div>
        <div className="vant-outer">
          <textarea
            className="vant-inner"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Liste ${title.toLowerCase()} do personagem…`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="section-wrap">
      <div className="section-title">
        <span>{title}</span>
      </div>
      <textarea
        className="transmut-body"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `${title} conhecidas pelo personagem…`}
      />
    </div>
  )
}
