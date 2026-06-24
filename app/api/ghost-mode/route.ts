import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

const TASK_TYPE_PROMPTS: Record<string, string> = {
  assignment: 'Draft a complete academic assignment submission email to a professor, including subject line, body, and any required attachments mention.',
  email: 'Draft a professional email response, fully written and ready to send.',
  payment: 'Draft a formal payment confirmation or follow-up message.',
  meeting: 'Draft a meeting agenda and preparation checklist.',
  form: 'Draft all required form fields and responses.',
  report: 'Draft an executive summary and key points for the report.',
  other: 'Draft a comprehensive completion summary and next steps document.',
}

export async function POST(req: NextRequest) {
  try {
    const { task } = await req.json()

    if (!task?.title) {
      return NextResponse.json({ success: false, error: 'Task required' }, { status: 400 })
    }

    const taskInstruction = TASK_TYPE_PROMPTS[task.type] || TASK_TYPE_PROMPTS.other
    const hoursLeft = Math.max(0, Math.floor(
      (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60)
    ))

    const prompt = `
You are Ghost Mode — an AI that autonomously drafts task outputs so the user only needs to click "Approve."

TASK: "${task.title}"
DESCRIPTION: ${task.description || 'No additional details'}
DEADLINE: ${task.deadline} (${hoursLeft} hours remaining)
TYPE: ${task.type}

MISSION: ${taskInstruction}

Write a COMPLETE, READY-TO-USE draft. Be specific and professional.
Include "[YOUR NAME]", "[DATE]" etc. as placeholders where needed.
Start the draft immediately — no preamble or explanation.

Format with clear sections using --- dividers.
`

    const draft = await callGemini(prompt)
    return NextResponse.json({
      success: true,
      draft,
      taskType: task.type,
      confidence: hoursLeft > 0 ? 94 : 78,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
