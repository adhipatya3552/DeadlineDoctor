'use client'

import { useState } from 'react'
import { Clock, Check } from 'lucide-react'
import { Task, MicroTask } from '@/lib/types'

export function SchedulePanel({ task, procrastinationType, onUpdate }:
  { task: Task; procrastinationType?: string; onUpdate: (id: string, u: Partial<Task>) => void }) {

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [meta,    setMeta]    = useState({ peakHour: '', totalMins: 0 })
  const mts = task.microTasks ?? []

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, procrastinationType }) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      onUpdate(task.id, { microTasks: data.microTasks })
      setMeta({ peakHour: data.peakHour, totalMins: data.estimatedMinutes })
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const toggle = (id: string) => {
    onUpdate(task.id, { microTasks: mts.map((m: MicroTask) => m.id === id ? { ...m, done: !m.done } : m) })
  }

  const done = mts.filter((m: MicroTask) => m.done).length
  const pct  = mts.length ? Math.round((done / mts.length) * 100) : 0

  return (
    <div className="mt-3 pt-3 border-t border-border animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-teal" />
          <span className="font-mono text-xs text-teal font-semibold">Micro Plan</span>
          {mts.length > 0 && <span className="text-text-muted text-xs">({done}/{mts.length})</span>}
        </div>
        {meta.peakHour && <span className="font-mono text-xs text-text-muted">⚡ {meta.peakHour}</span>}
      </div>

      {mts.length === 0 && !loading && (
        <button onClick={generate} className="btn-primary w-full text-xs py-2">🧠 Generate Plan</button>
      )}

      {loading && (
        <div className="text-center py-3">
          <span className="font-mono text-xs text-teal">Building plan<span className="loading-dots" /></span>
        </div>
      )}

      {error && <p className="text-xs text-red bg-red/10 border border-red/20 rounded-lg p-3">{error}</p>}

      {mts.length > 0 && !loading && (
        <div className="space-y-2">
          {mts.length > 1 && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-text-muted">Progress</span>
                <span className="font-mono text-xs text-teal">{pct}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-teal" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {mts.map((mt: MicroTask) => (
              <button key={mt.id} onClick={() => toggle(mt.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors text-left">
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all
                  ${mt.done ? 'bg-teal border-teal' : 'border-border'}`}>
                  {mt.done && <Check size={9} className="text-black" strokeWidth={3} />}
                </div>
                <span className={`text-xs flex-1 ${mt.done ? 'line-through text-text-muted' : 'text-text'}`}>
                  {mt.label}
                </span>
                <span className="font-mono text-xs text-text-muted shrink-0">{mt.duration}m</span>
              </button>
            ))}
          </div>

          {meta.totalMins > 0 && (
            <p className="text-xs text-text-muted text-center pt-1">
              Total: <span className="font-mono text-teal">{meta.totalMins} min</span>
            </p>
          )}
          <button onClick={generate} className="btn-ghost w-full text-xs py-1.5">Regenerate</button>
        </div>
      )}
    </div>
  )
}
