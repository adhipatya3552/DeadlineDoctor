'use client'

import { Stethoscope, RefreshCw } from 'lucide-react'
import { DiagnosisResult, Task } from '@/lib/types'

interface DiagnosisPanelProps {
  tasks:     Task[]
  diagnosis: DiagnosisResult | null
  loading:   boolean
  onDiagnose: () => void
}

const TYPE_STYLE: Record<string, { chip: string; bar: string; glow: string }> = {
  Perfectionist: { chip: 'chip-teal',   bar: '#00E5C4', glow: 'rgba(0,229,196,0.08)' },
  Overwhelmed:   { chip: 'chip-amber',  bar: '#FFAB00', glow: 'rgba(255,171,0,0.08)' },
  Distracted:    { chip: 'chip-purple', bar: '#A78BFA', glow: 'rgba(167,139,250,0.08)' },
  Avoidant:      { chip: 'chip-red',    bar: '#FF3547', glow: 'rgba(255,53,71,0.08)' },
}

export function DiagnosisPanel({ tasks, diagnosis, loading, onDiagnose }: DiagnosisPanelProps) {
  const style = diagnosis ? TYPE_STYLE[diagnosis.type] : null

  return (
    <div className="card p-4" style={style ? { background: style.glow } : {}}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope size={15} className="text-teal" />
          <span className="font-display font-semibold text-sm text-text">Diagnosis</span>
        </div>
        <button
          onClick={onDiagnose}
          disabled={loading}
          className="btn-ghost text-xs py-1.5 px-3 disabled:opacity-50"
        >
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Scanning...' : diagnosis ? 'Re-run' : 'Diagnose'}
        </button>
      </div>

      {/* Empty */}
      {!diagnosis && !loading && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🩺</p>
          <p className="text-text-muted text-xs leading-relaxed">
            Add tasks then run diagnosis to discover your procrastination type
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-3xl mb-3">🔬</p>
          <p className="font-mono text-xs text-teal">Analyzing<span className="loading-dots" /></p>
        </div>
      )}

      {/* Result */}
      {diagnosis && !loading && style && (
        <div className="animate-slide-up space-y-4">

          {/* Type + score */}
          <div className="flex items-center justify-between">
            <span className={`chip ${style.chip} text-sm px-3 py-1`}>
              {diagnosis.emoji} {diagnosis.type}
            </span>
            <span className="font-mono text-xs text-text-muted">{diagnosis.score}/100</span>
          </div>

          {/* Severity bar */}
          <div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${diagnosis.score}%`, background: style.bar }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-text-muted leading-relaxed italic border-l-2 pl-3"
            style={{ borderColor: style.bar }}>
            {diagnosis.description}
          </p>

          {/* Symptoms / Prescription */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <p className="font-mono text-xs text-text-muted mb-1.5">⚠ Symptoms</p>
              <ul className="space-y-1">
                {diagnosis.symptoms.map((s, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-text-muted">
                    <span className="text-red shrink-0 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs text-text-muted mb-1.5">💊 Rx</p>
              <ul className="space-y-1">
                {diagnosis.prescription.map((p, i) => (
                  <li key={i} className="flex gap-1.5 text-xs text-text-muted">
                    <span className="text-teal shrink-0 mt-0.5">→</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
