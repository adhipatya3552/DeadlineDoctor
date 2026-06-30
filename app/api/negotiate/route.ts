import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { NegotiatorResult } from '@/lib/types'
import { FALLBACK_NEGOTIATE } from '@/lib/fallbacks'

export async function POST(req: NextRequest) {
  let taskTitle = 'your task'
  try {
    const body = await req.json()
    const { task, recipientName, recipientRole, reason, requestedExtension } = body
    if (!task?.title) return NextResponse.json({ success: false, error: 'Task required' }, { status: 400 })

    taskTitle = task.title
    const recipient   = recipientName  || 'the recipient'
    const role        = recipientRole  || 'supervisor'
    const why         = reason         || 'an unexpected increase in workload and competing priorities'
    const extension   = requestedExtension || '48 hours'
    const originalDue = new Date(task.deadline).toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

    const prompt = `You are the DeadlineDoctor Negotiator. Write a professional deadline extension request email.

TASK: "${task.title}"
ORIGINAL DEADLINE: ${originalDue}
RECIPIENT: ${recipient} (${role})
REASON: ${why}
EXTENSION REQUESTED: ${extension}

EMAIL RULES:
1. Under 180 words — busy people read short emails
2. Acknowledge the inconvenience directly
3. Mention you have already started / made progress
4. State a SPECIFIC new deadline (calculate from original)
5. Never sound desperate — calm, professional, confident
6. No grovelling, no over-apologising

RESPOND WITH VALID JSON ONLY. No markdown. No explanation.

{
  "subject": "Request for Brief Extension – ${task.title}",
  "email": "Full email body here, no subject line repeated",
  "tone": "professional"
}`

    const result = await callGeminiJSON<NegotiatorResult>(prompt)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    console.error('Negotiate error:', err.message)
    const fb = FALLBACK_NEGOTIATE(taskTitle)
    return NextResponse.json({ success: true, ...fb, fallback: true })
  }
}
