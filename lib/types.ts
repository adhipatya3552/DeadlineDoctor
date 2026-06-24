export type ProcrastinationType =
  | 'Perfectionist'
  | 'Overwhelmed'
  | 'Distracted'
  | 'Avoidant'
  | 'Unknown'

export type UrgencyLevel = 'critical' | 'warning' | 'stable' | 'safe'

export type TaskStatus = 'active' | 'ghosted' | 'negotiating' | 'done'

export interface MicroTask {
  id: string
  label: string
  duration: number // minutes
  done: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  deadline: string // ISO string
  type: string // 'assignment' | 'email' | 'payment' | 'meeting' | 'other'
  status: TaskStatus
  urgency: UrgencyLevel
  microTasks: MicroTask[]
  ghostDraft?: string    // AI-generated draft output
  negotiatorEmail?: string // AI-generated extension email
  createdAt: string
}

export interface DiagnosisResult {
  type: ProcrastinationType
  score: number // 0-100 severity
  description: string
  symptoms: string[]
  prescription: string[]
  emoji: string
}

export interface GhostModeResult {
  draft: string
  taskType: string
  confidence: number
}

export interface NegotiatorResult {
  email: string
  subject: string
  tone: string
}

export interface ScheduleResult {
  microTasks: MicroTask[]
  peakHour: string
  estimatedMinutes: number
}
