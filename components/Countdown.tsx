'use client'

import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

interface CountdownProps {
  deadline: string
  urgency: string
}

export function Countdown({ deadline, urgency }: CountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(
    differenceInSeconds(new Date(deadline), new Date())
  )

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(differenceInSeconds(new Date(deadline), new Date()))
    }, 1000)
    return () => clearInterval(id)
  }, [deadline])

  if (secondsLeft <= 0) {
    return <span className="countdown text-red text-base font-bold">OVERDUE</span>
  }

  const d = Math.floor(secondsLeft / 86400)
  const h = Math.floor((secondsLeft % 86400) / 3600)
  const m = Math.floor((secondsLeft % 3600) / 60)
  const s = secondsLeft % 60

  const color =
    urgency === 'critical' ? 'text-red' :
    urgency === 'warning'  ? 'text-amber' :
    'text-teal'

  const fmt = (n: number) => String(n).padStart(2, '0')

  return (
    <span className={`countdown text-base font-bold ${color}`}>
      {d > 0
        ? `${d}d ${fmt(h)}h ${fmt(m)}m`
        : h > 0
        ? `${fmt(h)}:${fmt(m)}:${fmt(s)}`
        : `${fmt(m)}:${fmt(s)}`}
    </span>
  )
}
