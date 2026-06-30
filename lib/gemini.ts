import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI  = new GoogleGenerativeAI(apiKey)

/* Stable text model */
export const gemini = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { temperature: 0.75, topP: 0.95, maxOutputTokens: 2048 },
})

/* JSON-mode model — lower temp for reliable parsing */
export const geminiJSON = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.3,
    topP: 0.9,
    maxOutputTokens: 1024,
    responseMimeType: 'application/json',
  },
})

export async function callGemini(prompt: string): Promise<string> {
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in Vercel environment variables.')
  const result = await gemini.generateContent(prompt)
  const text   = result.response.text()
  if (!text?.trim()) throw new Error('Gemini returned empty response.')
  return text
}

export async function callGeminiJSON<T>(prompt: string): Promise<T> {
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in Vercel environment variables.')
  const result = await geminiJSON.generateContent(prompt)
  const text   = result.response.text().replace(/```json|```/g, '').trim()
  if (!text) throw new Error('Gemini returned empty JSON response.')
  try {
    return JSON.parse(text) as T
  } catch {
    /* Last resort: try extracting first { } block */
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as T
    throw new Error('Failed to parse Gemini JSON response.')
  }
}
