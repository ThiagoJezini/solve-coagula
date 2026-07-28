import { useCallback } from 'react'

type PipShape = 'circle' | 'square'

interface PipTrackerProps {
  value: number
  onChange: (value: number) => void
  count?: number
  shape?: PipShape
  extraClass?: string
  direction?: 'row' | 'column'
}

export function PipTracker({ value, onChange, count = 5, shape = 'circle', extraClass, direction = 'row' }: PipTrackerProps) {
  const handleClick = useCallback((index: number) => {
    onChange(value === index + 1 ? index : index + 1)
  }, [value, onChange])

  return (
    <div className={`pip-row ${direction === 'column' ? 'pip-col' : ''}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`pip ${shape} ${i < value ? 'filled' : ''}${extraClass && i === count - 1 ? ' ' + extraClass : ''}`}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  )
}
