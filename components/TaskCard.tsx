'use client'

import { useState } from 'react'
import { Zap, Mail, Clock, CheckCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Task } from '@/lib/types'
import { Countdown } from './Countdown'
import { GhostModePanel } from './GhostModePanel'
import { NegotiatorPanel } from './NegotiatorPanel'
import { SchedulePanel } from './SchedulePanel'

const URGENCY_META = {
  critical: {
    label: '🔴 CRITICAL',
    cardClass: 'card glow-red animate-critical border-red/40',
    chipClass: 'chip chip-red',
    barColor: '#FF3547',
  },
  warning: {
    label: '🟡 WARNING',
    cardClass: 'card glow-amber border-amber/40',
    chipClass: 'chip chip-amber',
    barColor: '#FFAB00',
  },
  stable: {
    label: '🟢 STABLE',
    cardClass: 'card glow-teal border-teal/30',
    chipClass: 'chip chip-teal',
    barColor: '#00E5C4',
  },
  safe: {
    label: '⚪ SAFE',
    cardClass: 'card border-border',
    chipClass: 'chip chip-muted',
    barColor: '#2A3A5A',
  },
}

type Panel = 'schedule' | 'ghost' | 'negotiate' | null

interface TaskCardProps {
  task: Task
  procrastinationType?: string
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onDone:   (id: string) => void
}

export function TaskCard({ task, procrastinationType, onUpdate, onDelete, onDone }: TaskCardProps) {
  const [panel, setPanel] = useState<Panel>(null)
  const isDone = task.status === 'done'
  const meta = URGENCY_META[task.urgency] ?? URGENCY_META.safe

  const toggle = (p: Panel) => setPanel(prev => prev === p ? null : p)

  /* Urgency bar width — how close is deadline? */
  const totalMs   = new Date(task.deadline).getTime() - new Date(task.createdAt).getTime()
  const remainMs  = new Date(task.deadline).getTime() - Date.now()
  const pct       = Math.max(0, Math.min(100, (remainMs / totalMs) * 100))

  return (
    <div className={`${isDone ? 'card border-border opacity-50' : meta.cardClass} p-0 overflow-hidden`}>

      {/* Top urgency bar */}
      {!isDone && (
        <div className="progress-track rounded-none" style={{ height: '3px' }}>
          <div
            className="progress-fill"
            style={{ width: `${pct}%`, background: meta.barColor }}
          />
        </div>
      )}

      <div className="p-4">
        {/* Row 1: status chip + type + actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {!isDone && <span className={meta.chipClass}>{meta.label}</span>}
            {isDone  && <span className="chip chip-teal">✓ TREATED</span>}
            <span className="chip chip-muted">{task.type}</span>
          </div>
          <div className="flex items-center gap-1">
            {!isDone && (
              <button
                onClick={() => onDone(task.id)}
                title="Mark done"
                className="p-1.5 rounded-lg text-text-muted hover:text-teal hover:bg-teal/10 transition-all"
              >
                <CheckCircle size={15} />
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              title="Delete"
              className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Row 2: Task title */}
        <h3 className={`font-display font-semibold text-sm leading-snug mb-3 ${isDone ? 'line-through text-text-muted' : 'text-text'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-text-muted mb-3 line-clamp-1">{task.description}</p>
        )}

        {/* Row 3: Live countdown + deadline date */}
        {!isDone && (
          <div className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2 mb-3">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-text-muted" />
              <span className="text-xs text-text-muted">Remaining</span>
            </div>
            <Countdown deadline={task.deadline} urgency={task.urgency} />
          </div>
        )}

        {/* Row 4: AI actions */}
        {!isDone && (
          <div className="flex gap-2 pt-2 border-t border-border flex-wrap">
            <button
              onClick={() => toggle('schedule')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium
                ${panel === 'schedule'
                  ? 'bg-teal/10 border-teal/40 text-teal'
                  : 'border-border text-text-muted hover:border-teal/30 hover:text-teal'}`}
            >
              <Clock size={11} />
              Micro Plan
              {panel === 'schedule' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>

            <button
              onClick={() => toggle('ghost')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium
                ${panel === 'ghost'
                  ? 'bg-teal/10 border-teal/40 text-teal'
                  : 'border-border text-text-muted hover:border-teal/30 hover:text-teal'}`}
            >
              <Zap size={11} />
              Ghost Mode
              {panel === 'ghost' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>

            <button
              onClick={() => toggle('negotiate')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium
                ${panel === 'negotiate'
                  ? 'bg-amber/10 border-amber/40 text-amber'
                  : 'border-border text-text-muted hover:border-amber/30 hover:text-amber'}`}
            >
              <Mail size={11} />
              Negotiate
              {panel === 'negotiate' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          </div>
        )}

        {/* Panels */}
        {!isDone && panel === 'schedule' && (
          <SchedulePanel task={task} procrastinationType={procrastinationType} onUpdate={onUpdate} />
        )}
        {!isDone && panel === 'ghost' && (
          <GhostModePanel task={task} onUpdate={onUpdate} />
        )}
        {!isDone && panel === 'negotiate' && (
          <NegotiatorPanel task={task} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  )
}
