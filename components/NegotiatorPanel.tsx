'use client'

import { useState } from 'react'
import { Mail, Copy, CheckCheck } from 'lucide-react'
import { Task } from '@/lib/types'

export function NegotiatorPanel({ task, onUpdate }: { task: Task; onUpdate: (id: string, u: Partial<Task>) => void }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [copied,  setCopied]  = useState(false)
  const [form, setForm] = useState({ name: '', role: 'professor', reason: '', ext: '48 hours' })

  const result = task.negotiatorEmail ? JSON.parse(task.negotiatorEmail) : null
  const [showForm, setShowForm] = useState(!result)

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/negotiate', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, recipientName: form.name, recipientRole: form.role, reason: form.reason, requestedExtension: form.ext }) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      onUpdate(task.id, { negotiatorEmail: JSON.stringify({ subject: data.subject, email: data.email }), status: 'negotiating' })
      setShowForm(false)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const copy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.email}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="mt-3 pt-3 border-t border-border animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Mail size={13} className="text-amber" />
        <span className="font-mono text-xs text-amber font-semibold">Deadline Negotiator</span>
        <span className="text-text-muted text-xs">— AI requests extension</span>
      </div>

      {showForm && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input className="dd-input text-xs" placeholder="Recipient name" value={form.name} onChange={e => f('name', e.target.value)} />
            <select className="dd-input text-xs" value={form.role} onChange={e => f('role', e.target.value)}>
              {['professor','manager','client','supervisor','employer'].map(r =>
                <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>
              )}
            </select>
          </div>
          <input className="dd-input text-xs" placeholder="Reason (e.g. medical, exam overlap)" value={form.reason} onChange={e => f('reason', e.target.value)} />
          <select className="dd-input text-xs" value={form.ext} onChange={e => f('ext', e.target.value)}>
            {['24 hours','48 hours','3 days','1 week'].map(x => <option key={x} value={x}>{x}</option>)}
          </select>
          <button onClick={generate} disabled={loading}
            className="w-full py-2 text-xs rounded-lg font-semibold font-display bg-amber/10 border border-amber/30 text-amber hover:bg-amber/15 transition-all disabled:opacity-50">
            {loading ? 'Drafting...' : '✍️ Draft Extension Request'}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red bg-red/10 border border-red/20 rounded-lg p-3 mt-2">{error}</p>}

      {result && !showForm && (
        <div className="space-y-2">
          <div className="draft-box border-amber/20">
            <p className="font-semibold text-amber mb-2">Subject: {result.subject}</p>
            {result.email}
          </div>
          <div className="flex gap-2">
            <button onClick={copy}
              className="flex-1 py-2 text-xs rounded-lg font-semibold font-display bg-amber/10 border border-amber/30 text-amber hover:bg-amber/15 transition-all flex items-center justify-center gap-1.5">
              {copied ? <><CheckCheck size={12} />Copied!</> : <><Copy size={12} />Copy Email</>}
            </button>
            <button onClick={() => setShowForm(true)} className="btn-ghost text-xs py-2 px-3">Edit</button>
          </div>
        </div>
      )}
    </div>
  )
}
