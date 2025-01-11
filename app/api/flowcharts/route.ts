
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('email-marketing-sequence');
    const flowcharts = db.collection('flowcharts');

    const result = await flowcharts.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch flowcharts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('email-marketing-sequence');
    const flowcharts = db.collection('flowcharts');

    const result = await flowcharts.insertOne({
      ...body,
      createdAt: new Date()
    });
    
    return NextResponse.json({ id: result.insertedId, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save flowchart' },
      { status: 500 }
    );
  }
}
