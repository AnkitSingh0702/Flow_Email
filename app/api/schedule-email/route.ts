import { NextResponse } from 'next/server'
import agenda from '@/lib/agenda'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, body: emailBody, templateId } = body

    if (!to || !subject || !emailBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Schedule the email
    await (await agenda).schedule('in 1 hour', 'send email', {
      to,
      subject,
      body: emailBody,
      templateId
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Email scheduled successfully' 
    })
  } catch (error) {
    console.error('Error scheduling email:', error)
    return NextResponse.json(
      { 
        error: 'Failed to schedule email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 