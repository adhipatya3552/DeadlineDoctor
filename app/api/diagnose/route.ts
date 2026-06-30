import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJSON } from '@/lib/gemini'
import { DiagnosisResult } from '@/lib/types'
import { FALLBACK_DIAGNOSIS } from '@/lib/fallbacks'

export async function POST(req: NextRequest) {
  try {
    const { tasks } = await req.json()

    const taskList = tasks?.length
      ? tasks.map((t: any, i: number) =>
          `${i + 1}. "${t.title}" | type:${t.type} | urgency:${t.urgency} | status:${t.status}`
        ).join('\n')
      : 'No tasks yet (new user, first visit)'

    const prompt = `You are DeadlineDoctor, an AI that diagnoses procrastination like a medical professional.

PATIENT TASK LIST:
${taskList}

TASK: Diagnose this patient's primary procrastination type.

TYPES (pick EXACTLY ONE):
- Perfectionist: delays because nothing feels "good enough" or "ready"  
- Overwhelmed: too many tasks, cannot decide where to start, paralysed
- Distracted: easily pulled to other activities, loses focus mid-task
- Avoidant: subconsciously fears failure, judgment, or confrontation

RESPOND WITH VALID JSON ONLY. No markdown. No explanation. No extra keys.

{
  "type": "Perfectionist",
  "score": 68,
  "description": "Two-sentence clinical diagnosis in an empathetic but direct doctor tone.",
  "symptoms": ["symptom one", "symptom two", "symptom three"],
  "prescription": ["action one", "action two", "action three"],
  "emoji": "🎯"
}`

    const diagnosis = await callGeminiJSON<DiagnosisResult>(prompt)

    /* Validate required fields */
    const valid = ['Perfectionist','Overwhelmed','Distracted','Avoidant'].includes(diagnosis.type)
    if (!valid) throw new Error('Invalid type returned')

    return NextResponse.json({ success: true, diagnosis })
  } catch (err: any) {
    console.error('Diagnose error:', err.message)
    /* Return realistic fallback so demo never breaks */
    return NextResponse.json({ success: true, diagnosis: FALLBACK_DIAGNOSIS, fallback: true })
  }
}
