import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'
import { FALLBACK_GHOST } from '@/lib/fallbacks'

const TYPE_CONTEXT: Record<string, string> = {
  assignment : 'Write a complete academic submission email to a professor with subject, greeting, body, and sign-off.',
  email      : 'Write a complete professional email — subject line, formal greeting, clear body paragraphs, and polite closing.',
  payment    : 'Write a payment confirmation or follow-up message to a billing/accounts team.',
  meeting    : 'Write a meeting agenda, objectives list, and prep checklist.',
  report     : 'Write an executive summary and structured key-points outline for the report.',
  form       : 'Write pre-filled answers for all likely fields in this form, with placeholder labels.',
  other      : 'Write a complete task-completion summary and handover note.',
}

export async function POST(req: NextRequest) {
  let taskTitle = 'your task'
  try {
    const body = await req.json()
    const { task } = body
    if (!task?.title) return NextResponse.json({ success: false, error: 'Task required' }, { status: 400 })

    taskTitle = task.title
    const hoursLeft  = Math.max(0, (new Date(task.deadline).getTime() - Date.now()) / 3600000)
    const urgencyMsg = hoursLeft < 1 ? '⚠️ UNDER 1 HOUR LEFT — be concise and direct.'
                     : hoursLeft < 6 ? '⚠️ Under 6 hours — prioritise clarity.'
                     : 'Deadline is approaching — be professional and thorough.'
    const instruction = TYPE_CONTEXT[task.type] ?? TYPE_CONTEXT.other

    const prompt = `You are Ghost Mode — an AI that autonomously drafts task outputs so the user only needs to click "Approve & Send."

TASK: "${task.title}"
EXTRA CONTEXT: ${task.description || 'None provided'}
TASK TYPE: ${task.type}
DEADLINE: ${new Date(task.deadline).toLocaleString()} (${hoursLeft.toFixed(1)} hrs away)
URGENCY: ${urgencyMsg}

INSTRUCTION: ${instruction}

RULES:
- Output ONLY the final draft — no preamble, no explanation, no meta-commentary
- Use [YOUR NAME], [DATE], [RECIPIENT NAME] as placeholders where needed
- Use ━━━ dividers between sections
- Keep it ready to copy-paste immediately
- Be specific, not generic`

    const draft = await callGemini(prompt)
    return NextResponse.json({ success: true, draft, confidence: hoursLeft > 0 ? 94 : 79 })
  } catch (err: any) {
    console.error('Ghost mode error:', err.message)
    return NextResponse.json({ success: true, draft: FALLBACK_GHOST(taskTitle), confidence: 70, fallback: true })
  }
}
