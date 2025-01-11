import { NextResponse } from 'next/server'
import agenda from '@/lib/agenda'

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Schedule the email to be sent after 1 hour
    await agenda.schedule('in 1 hour', 'send scheduled email', { to, subject, body })

    return NextResponse.json({ message: 'Email scheduled successfully' })
  } catch (error) {
    console.error('Error scheduling email:', error)
    return NextResponse.json({ error: 'Failed to schedule email' }, { status: 500 })
  }
}

