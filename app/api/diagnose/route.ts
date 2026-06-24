import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { DiagnosisResult } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { tasks, behaviorHistory } = await req.json()

    const taskSummary = tasks?.length
      ? tasks.map((t: any) =>
          `- "${t.title}" | Type: ${t.type} | Deadline: ${t.deadline} | Status: ${t.status}`
        ).join('\n')
      : 'No tasks yet — new user'

    const prompt = `
You are DeadlineDoctor, an AI that diagnoses procrastination like a doctor diagnoses illness.

PATIENT DATA:
${taskSummary}

Behavior notes: ${behaviorHistory || 'First visit'}

DIAGNOSE the patient's procrastination personality from exactly ONE of these types:
- Perfectionist: Delays because nothing feels "good enough"
- Overwhelmed: Too many tasks, doesn't know where to start  
- Distracted: Gets sidetracked by other things easily
- Avoidant: Subconsciously fears failure or judgment

Return ONLY this exact JSON (no extra text, no markdown):
{
  "type": "Perfectionist" | "Overwhelmed" | "Distracted" | "Avoidant",
  "score": <integer 0-100, severity of procrastination>,
  "description": "<2-sentence diagnosis in doctor's clinical but empathetic tone>",
  "symptoms": ["<symptom 1>", "<symptom 2>", "<symptom 3>"],
  "prescription": ["<action 1>", "<action 2>", "<action 3>"],
  "emoji": "<single emoji representing this type>"
}
`

    const diagnosis = await callGeminiJSON<DiagnosisResult>(prompt)
    return NextResponse.json({ success: true, diagnosis })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
