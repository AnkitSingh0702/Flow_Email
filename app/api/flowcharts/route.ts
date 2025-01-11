import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
    console.error('Error fetching flowcharts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch flowcharts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
    console.error('Error saving flowchart:', error);
    return NextResponse.json({ error: 'Failed to save flowchart' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('email-marketing-sequence');
    const flowcharts = db.collection('flowcharts');

    const result = await flowcharts.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Flowchart not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting flowchart:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete flowchart',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
