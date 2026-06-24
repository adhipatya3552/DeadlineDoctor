'use client'

import { useState } from 'react'
import { Zap, Copy, CheckCheck } from 'lucide-react'
import { Task } from '@/lib/types'

export function GhostModePanel({ task, onUpdate }: { task: Task; onUpdate: (id: string, u: Partial<Task>) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const draft = task.ghostDraft

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/ghost-mode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task }) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      onUpdate(task.id, { ghostDraft: data.draft, status: 'ghosted' })
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const copy = async () => {
    if (!draft) return
    await navigator.clipboard.writeText(draft)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3 pt-3 border-t border-border animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={13} className="text-teal" />
        <span className="font-mono text-xs text-teal font-semibold">Ghost Mode</span>
        <span className="text-text-muted text-xs">— AI writes it for you</span>
      </div>

      {!draft && !loading && (
        <button onClick={generate} className="btn-primary w-full text-xs py-2">⚡ Generate Draft</button>
      )}

      {loading && (
        <div className="bg-black/40 rounded-lg p-4 text-center">
          <span className="font-mono text-xs text-teal">Ghost writing<span className="loading-dots" /></span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red bg-red/10 border border-red/20 rounded-lg p-3">{error}</p>
      )}

      {draft && !loading && (
        <div className="space-y-2">
          <div className="draft-box">{draft}</div>
          <div className="flex gap-2">
            <button onClick={copy} className="btn-primary flex-1 text-xs py-2">
              {copied ? <><CheckCheck size={12} /> Copied!</> : <><Copy size={12} /> Copy & Use</>}
            </button>
            <button onClick={generate} className="btn-ghost text-xs py-2 px-3">Redo</button>
          </div>
          <p className="text-xs text-text-muted text-center">
            Fill in <span className="font-mono text-teal">[YOUR NAME]</span> placeholders then send.
          </p>
        </div>
      )}
    </div>
  )
}
