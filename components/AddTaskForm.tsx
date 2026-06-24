'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const TASK_TYPES = [
  { v: 'assignment', l: '📚 Assignment' },
  { v: 'email',      l: '📧 Email' },
  { v: 'payment',    l: '💳 Payment' },
  { v: 'meeting',    l: '📅 Meeting' },
  { v: 'report',     l: '📊 Report' },
  { v: 'form',       l: '📋 Form' },
  { v: 'other',      l: '🔖 Other' },
]

interface AddTaskFormProps {
  onAdd: (data: { title: string; description?: string; deadline: string; type: string }) => void
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [desc,  setDesc]  = useState('')
  const [deadline, setDeadline] = useState('')
  const [type, setType] = useState('assignment')

  const defaultDeadline = () => {
    const d = new Date(); d.setHours(d.getHours() + 24)
    return d.toISOString().slice(0, 16)
  }

  const open_ = () => { setDeadline(defaultDeadline()); setOpen(true) }
  const close  = () => setOpen(false)

  const submit = () => {
    if (!title.trim() || !deadline) return
    onAdd({ title: title.trim(), description: desc.trim() || undefined, deadline, type })
    setTitle(''); setDesc(''); setOpen(false)
  }

  if (!open) return (
    <button onClick={open_} className="btn-primary w-full justify-center py-2.5">
      <Plus size={15} /> Admit New Patient
    </button>
  )

  return (
    <div className="card p-4 glow-teal animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <span className="font-display font-semibold text-sm text-text">New Patient</span>
        <button onClick={close} className="text-text-muted hover:text-text transition-colors"><X size={14} /></button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="font-mono text-xs text-text-muted block mb-1">Task *</label>
          <input className="dd-input" placeholder="e.g. Submit AI assignment to professor" value={title}
            onChange={e => setTitle(e.target.value)} autoFocus />
        </div>

        <div>
          <label className="font-mono text-xs text-text-muted block mb-1">Details (optional)</label>
          <textarea className="dd-input resize-none" rows={2}
            placeholder="Extra context for the AI..." value={desc}
            onChange={e => setDesc(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-mono text-xs text-text-muted block mb-1">Type *</label>
            <select className="dd-input" value={type} onChange={e => setType(e.target.value)}>
              {TASK_TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs text-text-muted block mb-1">Deadline *</label>
            <input type="datetime-local" className="dd-input" value={deadline}
              onChange={e => setDeadline(e.target.value)} />
          </div>
        </div>

        <button onClick={submit} disabled={!title.trim() || !deadline} className="btn-primary w-full">
          Admit Patient →
        </button>
      </div>
    </div>
  )
}
