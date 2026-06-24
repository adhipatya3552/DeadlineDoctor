import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn('GEMINI_API_KEY not set. AI features will not work.')
}

export const genAI = new GoogleGenerativeAI(apiKey || '')

export const gemini = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.8,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
})

export const geminiJSON = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.4,
    topP: 0.9,
    maxOutputTokens: 1024,
    responseMimeType: 'application/json',
  },
})

export async function callGemini(prompt: string): Promise<string> {
  try {
    const result = await gemini.generateContent(prompt)
    return result.response.text()
  } catch (err) {
    console.error('Gemini error:', err)
    throw new Error('AI service unavailable. Check your GEMINI_API_KEY.')
  }
}

export async function callGeminiJSON<T>(prompt: string): Promise<T> {
  try {
    const result = await geminiJSON.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean) as T
  } catch (err) {
    console.error('Gemini JSON error:', err)
    throw new Error('AI response parse failed.')
  }
}
