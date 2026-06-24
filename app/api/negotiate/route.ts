import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { NegotiatorResult } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { task, reason, recipientName, recipientRole, requestedExtension } = await req.json()

    if (!task?.title) {
      return NextResponse.json({ success: false, error: 'Task required' }, { status: 400 })
    }

    const prompt = `
You are the DeadlineDoctor Negotiator — an AI that crafts perfect, professional deadline extension requests.

TASK: "${task.title}"
ORIGINAL DEADLINE: ${task.deadline}
RECIPIENT: ${recipientName || 'The recipient'} (${recipientRole || 'supervisor/professor'})
REASON FOR EXTENSION: ${reason || 'Unexpected workload and time constraints'}
REQUESTED EXTENSION: ${requestedExtension || '48 hours'}

Write a professional, persuasive, yet humble extension request email.
Rules:
- Never sound desperate or unprofessional
- Acknowledge the impact on the recipient
- Offer a specific new deadline
- Show that you've already started work
- Keep it under 200 words

Return ONLY this JSON:
{
  "subject": "<email subject line>",
  "email": "<complete email body, ready to send>",
  "tone": "professional" | "warm" | "formal"
}
`

    const result = await callGeminiJSON<NegotiatorResult>(prompt)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
