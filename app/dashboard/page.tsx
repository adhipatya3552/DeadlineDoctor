'use client'

import { useState, useCallback } from 'react'
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react'
import { Header } from '@/components/Header'
import { DiagnosisPanel } from '@/components/DiagnosisPanel'
import { TaskCard } from '@/components/TaskCard'
import { AddTaskForm } from '@/components/AddTaskForm'
import { useTasks } from '@/lib/useTasks'
import { DiagnosisResult, Task } from '@/lib/types'

const URGENCY_ORDER = { critical: 0, warning: 1, stable: 2, safe: 3 }

export default function Dashboard() {
  const { tasks, activeTasks, doneTasks, criticalTasks, loaded, addTask, updateTask, deleteTask, markDone } = useTasks()
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [diagnosing, setDiagnosing] = useState(false)
  const [showDone, setShowDone] = useState(false)

  const runDiagnosis = useCallback(async () => {
    setDiagnosing(true)
    try {
      const res  = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: activeTasks }),
      })
      const data = await res.json()
      if (data.success) setDiagnosis(data.diagnosis)
    } catch {}
    finally { setDiagnosing(false) }
  }, [activeTasks])

  if (!loaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="font-mono text-sm text-teal">Loading<span className="loading-dots" /></span>
      </div>
    )
  }

  const sorted = [...activeTasks].sort(
    (a, b) => (URGENCY_ORDER[a.urgency] ?? 3) - (URGENCY_ORDER[b.urgency] ?? 3)
  )

  return (
    <div className="min-h-screen bg-black">
      <Header criticalCount={criticalTasks.length} totalActive={activeTasks.length} />

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* Empty hero */}
        {tasks.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-5xl mb-4">🩺</p>
            <h1 className="font-display font-bold text-2xl grad-text mb-2">DeadlineDoctor</h1>
            <p className="text-text-muted text-sm max-w-sm mx-auto mb-8 leading-relaxed">
              Admit your first task and let the AI diagnose your procrastination type.
            </p>
          </div>
        )}

        {/* Critical alert banner */}
        {criticalTasks.length > 0 && (
          <div className="flex items-center gap-3 bg-red/10 border border-red/30 rounded-xl px-4 py-3 mb-5 animate-slide-up">
            <AlertTriangle size={16} className="text-red shrink-0" />
            <p className="text-sm text-red font-display font-semibold">
              {criticalTasks.length} task{criticalTasks.length > 1 ? 's' : ''} critically overdue —
              use <span className="font-mono">Ghost Mode</span> or <span className="font-mono">Negotiate</span> immediately.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left column ── */}
          <div className="lg:col-span-1 space-y-4">

            <DiagnosisPanel
              tasks={activeTasks}
              diagnosis={diagnosis}
              loading={diagnosing}
              onDiagnose={runDiagnosis}
            />

            {/* Stats row */}
            {tasks.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className="card p-3 text-center">
                  <p className="font-display font-bold text-xl text-text">{activeTasks.length}</p>
                  <p className="font-mono text-xs text-text-muted mt-0.5">Active</p>
                </div>
                <div className="card p-3 text-center border-red/20">
                  <p className="font-display font-bold text-xl text-red">{criticalTasks.length}</p>
                  <p className="font-mono text-xs text-red mt-0.5">Critical</p>
                </div>
                <div className="card p-3 text-center">
                  <p className="font-display font-bold text-xl text-teal">{doneTasks.length}</p>
                  <p className="font-mono text-xs text-text-muted mt-0.5">Saved</p>
                </div>
              </div>
            )}

            <AddTaskForm onAdd={addTask} />

            <p className="text-center font-mono text-xs text-text-muted/50">
              Powered by{' '}
              <a href="https://ai.google.dev" target="_blank" rel="noreferrer"
                className="hover:text-teal transition-colors">Google AI Studio</a>
            </p>
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-4">

            {activeTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-teal" />
                <span className="font-display font-semibold text-sm text-text">Active Patients</span>
                <span className="chip chip-muted">{activeTasks.length}</span>
              </div>
            )}

            {/* All done state */}
            {activeTasks.length === 0 && doneTasks.length > 0 && (
              <div className="card p-10 text-center border-teal/20">
                <p className="text-3xl mb-3">🎉</p>
                <p className="font-display font-semibold text-teal text-base mb-1">All patients recovered!</p>
                <p className="text-text-muted text-sm">Add new tasks to stay on top of your schedule.</p>
              </div>
            )}

            {/* Task list */}
            <div className="space-y-3">
              {sorted.map(task => (
                <div key={task.id} className="animate-slide-up">
                  <TaskCard
                    task={task}
                    procrastinationType={diagnosis?.type}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onDone={markDone}
                  />
                </div>
              ))}
            </div>

            {/* Completed tasks */}
            {doneTasks.length > 0 && (
              <div>
                <button
                  onClick={() => setShowDone(p => !p)}
                  className="flex items-center gap-2 text-xs text-text-muted hover:text-teal transition-colors py-1"
                >
                  <CheckCircle size={13} className="text-teal" />
                  {showDone ? 'Hide' : 'Show'} completed ({doneTasks.length})
                </button>
                {showDone && (
                  <div className="space-y-2 mt-2">
                    {doneTasks.map(t => (
                      <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} onDone={markDone} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
