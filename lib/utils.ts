import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, differenceInHours, differenceInMinutes } from 'date-fns'
import { UrgencyLevel } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUrgency(deadline: string): UrgencyLevel {
  const hours = differenceInHours(new Date(deadline), new Date())
  if (hours < 0) return 'critical'
  if (hours < 6) return 'critical'
  if (hours < 24) return 'warning'
  if (hours < 72) return 'stable'
  return 'safe'
}

export function getTimeLeft(deadline: string): string {
  const now = new Date()
  const due = new Date(deadline)
  if (due < now) return 'OVERDUE'
  const hours = differenceInHours(due, now)
  const mins = differenceInMinutes(due, now) % 60
  if (hours < 1) return `${mins}m left`
  if (hours < 24) return `${hours}h ${mins}m left`
  return formatDistanceToNow(due, { addSuffix: true })
}

export function urgencyColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case 'critical': return 'text-red-critical'
    case 'warning': return 'text-amber-alert'
    case 'stable': return 'text-teal'
    case 'safe': return 'text-text-muted'
  }
}

export function urgencyBorder(urgency: UrgencyLevel): string {
  switch (urgency) {
    case 'critical': return 'border-red-critical shadow-red'
    case 'warning': return 'border-amber-alert shadow-amber'
    case 'stable': return 'border-teal'
    case 'safe': return 'border-bg-border'
  }
}

export function urgencyBg(urgency: UrgencyLevel): string {
  switch (urgency) {
    case 'critical': return 'bg-red-glow'
    case 'warning': return 'bg-amber-glow'
    case 'stable': return 'bg-teal-glow'
    case 'safe': return 'bg-bg-card'
  }
}
