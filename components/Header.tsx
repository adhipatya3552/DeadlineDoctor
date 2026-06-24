'use client'

import { Activity } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  criticalCount: number
  totalActive: number
}

/* ECG path changes speed based on how many critical tasks exist */
function LiveECG({ speed }: { speed: 'normal' | 'fast' | 'critical' }) {
  const cls =
    speed === 'critical' ? 'ecg-critical' :
    speed === 'fast'     ? 'ecg-fast' :
    'ecg-normal'
  const color =
    speed === 'critical' ? '#FF3547' :
    speed === 'fast'     ? '#FFAB00' :
    '#00E5C4'

  return (
    <svg viewBox="0 0 500 36" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <polyline
        className={cls}
        points="0,18 40,18 55,18 62,3 67,33 72,18 90,18
                130,18 145,18 152,3 157,33 162,18 180,18
                220,18 235,18 242,3 247,33 252,18 270,18
                310,18 325,18 332,3 337,33 342,18 360,18
                400,18 415,18 422,3 427,33 432,18 500,18"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Header({ criticalCount, totalActive }: HeaderProps) {
  const speed =
    criticalCount >= 3 ? 'critical' :
    criticalCount >= 1 ? 'fast' :
    'normal'

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-black/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-teal/10 border border-teal/30 flex items-center justify-center">
            <Activity size={14} className="text-teal" />
          </div>
          <span className="font-display font-bold text-sm text-text">
            Deadline<span className="text-teal">Doctor</span>
          </span>
        </Link>

        {/* Live ECG — the signature element */}
        <div className="flex-1 h-8 overflow-hidden opacity-60">
          <LiveECG speed={speed} />
        </div>

        {/* Vitals readout */}
        <div className="flex items-center gap-3 shrink-0">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 chip chip-red">
              <span className="w-1.5 h-1.5 rounded-full bg-red dot-blink" />
              {criticalCount} Critical
            </div>
          )}
          <div className="chip chip-muted">{totalActive} Active</div>
        </div>
      </div>
    </header>
  )
}
