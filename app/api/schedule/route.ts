import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { MicroTask } from '@/lib/types'
import { FALLBACK_SCHEDULE } from '@/lib/fallbacks'
import { v4 as uuidv4 } from 'uuid'

const TYPE_RULES: Record<string, string> = {
  Perfectionist : 'Start with the easiest sub-task to build momentum. The first task MUST take < 5 min. Avoid open-ended tasks.',
  Overwhelmed   : 'Max 4 tasks. Each must be crystal-clear and specific. First task under 5 min. No task over 25 min.',
  Distracted    : 'Short sprints: 10-15 min max each. Build in a 5-min break task between sessions.',
  Avoidant      : 'First task must be so small it feels embarrassing NOT to do it (< 3 min). Build confidence fast.',
}

export async function POST(req: NextRequest) {
  try {
    const { task, procrastinationType } = await req.json()
    if (!task?.title) return NextResponse.json({ success: false, error: 'Task required' }, { status: 400 })

    const hoursLeft  = Math.max(0.25, (new Date(task.deadline).getTime() - Date.now()) / 3600000)
    const taskCount  = hoursLeft < 2 ? 3 : hoursLeft < 6 ? 4 : 5
    const maxPerTask = Math.min(25, Math.floor((hoursLeft * 60 * 0.8) / taskCount))
    const typeRule   = TYPE_RULES[procrastinationType ?? ''] ?? 'Balance clarity and completeness.'
    const peakHints  = `Current hour is ${new Date().getHours()}. Peak productivity is typically 2-3h after waking.`

    const prompt = `You are the DeadlineDoctor Scheduler. Build a micro-task plan for a ${procrastinationType ?? 'general'} procrastinator.

TASK: "${task.title}"
DESCRIPTION: ${task.description || 'Not provided'}
HOURS UNTIL DEADLINE: ${hoursLeft.toFixed(1)}
MAX TASKS TO GENERATE: ${taskCount}
MAX MINUTES PER TASK: ${maxPerTask}
${peakHints}

PATIENT TYPE RULES: ${typeRule}

Generate ${taskCount} micro-tasks. Each must be:
- A concrete, specific action (not vague like "work on it")
- Completable in ${maxPerTask} minutes or less
- Sequenced so each one builds on the previous

RESPOND WITH VALID JSON ONLY. No markdown. No extra keys.

{
  "microTasks": [
    { "label": "Specific action verb + what exactly to do", "duration": 15 }
  ],
  "peakHour": "e.g. 10:00 AM",
  "estimatedMinutes": 75
}`

    const raw = await callGeminiJSON<{ microTasks: { label: string; duration: number }[]; peakHour: string; estimatedMinutes: number }>(prompt)

    const microTasks: MicroTask[] = raw.microTasks.map(t => ({
      id: uuidv4(), label: t.label, duration: t.duration, done: false,
    }))

    return NextResponse.json({ success: true, microTasks, peakHour: raw.peakHour, estimatedMinutes: raw.estimatedMinutes })
  } catch (err: any) {
    console.error('Schedule error:', err.message)
    return NextResponse.json({
      success: true,
      microTasks: FALLBACK_SCHEDULE.map(t => ({ ...t, id: uuidv4() })),
      peakHour: '10:00 AM',
      estimatedMinutes: 80,
      fallback: true,
    })
  }
}
