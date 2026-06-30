import { NextResponse } from 'next/server'

export async function GET() {
  const hasKey = !!process.env.GEMINI_API_KEY
  return NextResponse.json({
    status: hasKey ? 'ok' : 'missing_key',
    gemini: hasKey ? 'connected' : 'GEMINI_API_KEY not set',
    model: 'gemini-2.0-flash',
    timestamp: new Date().toISOString(),
  }, { status: hasKey ? 200 : 500 })
}
