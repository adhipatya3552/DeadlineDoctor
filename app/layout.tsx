import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DeadlineDoctor — AI Procrastination Diagnosis & Treatment',
  description: 'The only AI that diagnoses WHY you miss deadlines and autonomously acts to prevent it. Powered by Gemini AI.',
  keywords: 'productivity, AI, deadlines, procrastination, Google AI Studio, Gemini',
  openGraph: {
    title: 'DeadlineDoctor',
    description: 'AI that treats procrastination like a doctor treats disease.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
