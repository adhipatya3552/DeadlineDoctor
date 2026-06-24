'use client'

import Link from 'next/link'
import { Activity, ArrowRight, Zap, Mail, Clock, Stethoscope } from 'lucide-react'

/* ── Big animated ECG that sweeps across the full hero ── */
function HeroECG() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 1200 160"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0.18 }}
      >
        <polyline
          style={{
            strokeDasharray: 2400,
            animation: 'ecg-flow 4s linear infinite',
          }}
          points="
            0,80 100,80 140,80 158,20 168,140 178,80 220,80
            300,80 340,80 358,20 368,140 378,80 420,80
            500,80 540,80 558,20 568,140 578,80 620,80
            700,80 740,80 758,20 768,140 778,80 820,80
            900,80 940,80 958,20 968,140 978,80 1020,80
            1100,80 1140,80 1158,20 1168,140 1178,80 1200,80
          "
          fill="none"
          stroke="#00E5C4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

const TYPES = [
  { emoji: '🎯', name: 'Perfectionist', desc: 'Nothing feels ready', chip: 'chip-teal' },
  { emoji: '😰', name: 'Overwhelmed',   desc: 'Too much, no start',  chip: 'chip-amber' },
  { emoji: '😵', name: 'Distracted',    desc: 'Pulled every direction', chip: 'chip-purple' },
  { emoji: '😬', name: 'Avoidant',      desc: 'Fear blocks action', chip: 'chip-red' },
]

const FEATURES = [
  {
    icon: <Stethoscope size={18} className="text-teal" />,
    title: 'Procrastination Diagnosis',
    desc: 'Gemini AI reads your tasks and identifies your exact procrastination type — then prescribes a custom treatment protocol.',
    tag: 'Core AI',
    tagClass: 'chip-teal',
  },
  {
    icon: <Zap size={18} className="text-teal" />,
    title: 'Ghost Mode',
    desc: 'Deadline in 30 minutes? AI autonomously drafts your entire submission, email, or report. One click — done.',
    tag: 'Agentic',
    tagClass: 'chip-teal',
  },
  {
    icon: <Mail size={18} className="text-amber" />,
    title: 'Deadline Negotiator',
    desc: 'Missing the deadline? AI writes a professional extension email in seconds. Your professor gets polish, you get time.',
    tag: 'Auto-Draft',
    tagClass: 'chip-amber',
  },
  {
    icon: <Clock size={18} className="text-teal" />,
    title: 'Micro-Plan Generator',
    desc: 'Breaks tasks into 5–25 min sprints tuned to your procrastination type and scheduled at your personal peak hour.',
    tag: 'Scheduler',
    tagClass: 'chip-teal',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-text">

      {/* ── Nav ── */}
      <nav className="border-b border-border bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-teal" />
            <span className="font-display font-bold text-sm">
              Deadline<span className="text-teal">Doctor</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="chip chip-teal text-xs hidden sm:flex">Gemini AI</span>
            <Link href="/dashboard">
              <button className="btn-primary text-sm py-2 px-4">
                Open App <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center overflow-hidden">
        <HeroECG />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 chip chip-teal mb-8 text-xs px-4 py-2 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-teal dot-blink" />
          Built with Google AI Studio · Gemini 2.0 Flash
        </div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-tight tracking-tight mb-6">
          Your deadlines<br />
          <span className="grad-text">have a pulse.</span><br />
          <span className="text-text/60 text-3xl md:text-4xl font-bold">We monitor them.</span>
        </h1>

        <p className="text-text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          DeadlineDoctor diagnoses <em>why</em> you procrastinate, then autonomously
          drafts, schedules, and negotiates — so you never flatline on a deadline again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <button className="btn-primary text-base py-3 px-8">
              Start Treatment — Free <ArrowRight size={15} />
            </button>
          </Link>
          <span className="text-text-muted text-sm">No sign-up needed</span>
        </div>
      </section>

      {/* ── Procrastination types ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <p className="text-center font-mono text-xs text-text-muted mb-6 uppercase tracking-widest">
          Which patient type are you?
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TYPES.map(t => (
            <div key={t.name} className="card p-5 text-center hover:scale-[1.02] transition-transform cursor-default">
              <div className="text-3xl mb-3">{t.emoji}</div>
              <div className={`chip ${t.chip} mb-2 justify-center`}>{t.name}</div>
              <p className="text-text-muted text-xs">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-text-muted text-xs mt-4 font-mono">
          Gemini AI diagnoses your type and prescribes a custom treatment
        </p>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            AI that doesn't just{' '}
            <span className="text-text-muted line-through font-normal">remind</span> you —
            it <span className="grad-text">acts</span> for you
          </h2>
          <p className="text-text-muted text-sm">Four autonomous interventions, zero passive reminders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="card p-5 group hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-black/50 border border-border flex items-center justify-center">
                  {f.icon}
                </div>
                <span className={`chip ${f.tagClass}`}>{f.tag}</span>
              </div>
              <h3 className="font-display font-semibold text-sm text-text mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="card p-8 bg-navy/60">
          <h2 className="font-display font-bold text-xl text-center mb-8">
            The Treatment Flow
          </h2>
          <div className="flex flex-col md:flex-row items-start gap-0">
            {[
              { n: '01', t: 'Admit task', d: 'Add task + deadline in seconds' },
              { n: '02', t: 'Diagnose',   d: 'Gemini identifies your procrastination type' },
              { n: '03', t: 'Prescribe',  d: 'Micro-plan generated at your peak hour' },
              { n: '04', t: 'Ghost',      d: 'AI auto-drafts output at crunch time' },
              { n: '05', t: 'Approved',   d: 'One click — submitted ✓' },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex md:flex-col items-center md:items-center flex-1">
                <div className="flex md:flex-col items-center md:items-center gap-3 md:gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs text-teal font-bold">{step.n}</span>
                  </div>
                  <div className="md:text-center">
                    <p className="font-display font-semibold text-sm text-text">{step.t}</p>
                    <p className="text-text-muted text-xs mt-0.5">{step.d}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block h-px flex-1 bg-border mx-2 mt-5 self-start" style={{ marginTop: '20px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-5">🩺</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">
            Ready to stop missing deadlines?
          </h2>
          <p className="text-text-muted text-sm mb-8">
            Free · No account · Powered by Google Gemini AI
          </p>
          <Link href="/dashboard">
            <button className="btn-primary text-base py-3 px-10">
              Open DeadlineDoctor →
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-text-muted text-xs font-mono">
          <span>DeadlineDoctor · Google AI Studio + Gemini 2.0 Flash</span>
          <span>Vibe2Ship Hackathon · CodingNinjas × Google for Developers</span>
        </div>
      </footer>
    </div>
  )
}
