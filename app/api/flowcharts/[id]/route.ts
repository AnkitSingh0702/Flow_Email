import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await client.connect()
    const database = client.db('email_sequence_builder')
    const flows = database.collection('flows')
    
    const result = await flows.deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Flow not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting flow:', error)
    return NextResponse.json({ error: 'Failed to delete flow' }, { status: 500 })
  } finally {
    await client.close()
  }
}

