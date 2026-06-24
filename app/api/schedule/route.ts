import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { ScheduleResult, MicroTask } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const { task, procrastinationType } = await req.json()

    if (!task?.title) {
      return NextResponse.json({ success: false, error: 'Task required' }, { status: 400 })
    }

    const hoursLeft = Math.max(0.5, Math.floor(
      (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60)
    ))

    const now = new Date()
    const currentHour = now.getHours()

    const prompt = `
You are the DeadlineDoctor Scheduler. Break down tasks into micro-sessions for a ${procrastinationType || 'general'} procrastinator.

TASK: "${task.title}"
DESCRIPTION: ${task.description || 'No details'}
HOURS LEFT: ${hoursLeft}
CURRENT HOUR: ${currentHour}:00

Rules for ${procrastinationType || 'any'} type:
- Perfectionist: Start with easiest parts, build momentum
- Overwhelmed: Max 4 tasks, clear boundaries, start with smallest  
- Distracted: Short 10-15 min sprints with breaks
- Avoidant: First task must take < 5 minutes (remove barrier to starting)

Create 3-6 micro-tasks. Each should be completable in 5-25 minutes.
Peak productivity for someone awake at hour ${currentHour}: typically 2-3 hours after waking.

Return ONLY this JSON:
{
  "microTasks": [
    { "label": "<specific action>", "duration": <minutes as integer> }
  ],
  "peakHour": "<best time to work today, e.g. '10:00 AM'>",
  "estimatedMinutes": <total minutes as integer>
}
`

    const raw = await callGeminiJSON<{ microTasks: { label: string; duration: number }[]; peakHour: string; estimatedMinutes: number }>(prompt)

    const result: ScheduleResult = {
      microTasks: raw.microTasks.map(t => ({
        id: uuidv4(),
        label: t.label,
        duration: t.duration,
        done: false,
      })),
      peakHour: raw.peakHour,
      estimatedMinutes: raw.estimatedMinutes,
    }

    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
