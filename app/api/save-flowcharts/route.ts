// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import agenda from '@/lib/agenda'

interface EmailNode {
  id: string
  type: string
  data: {
    emailData?: {
      to: string
      subject: string
      body: string
    }
    delayTime?: number
    templateId?: string
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nodes, edges } = body

    if (!nodes || !edges) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("email-marketing-sequence")
    const flowcharts = db.collection("flowcharts")

    // Build a graph of node connections
    const graph = new Map<string, string[]>()
    edges.forEach((edge: any) => {
      if (!graph.has(edge.source)) {
        graph.set(edge.source, [])
      }
      graph.get(edge.source)?.push(edge.target)
    })

    // Function to calculate delay for a path
    const calculatePathDelay = (nodeId: string, visited = new Set<string>()): number => {
      if (visited.has(nodeId)) return 0
      visited.add(nodeId)

      const node = nodes.find((n: EmailNode) => n.id === nodeId)
      let delay = node?.data?.delayTime || 0

      const nextNodes = graph.get(nodeId) || []
      for (const nextId of nextNodes) {
        delay += calculatePathDelay(nextId, visited)
      }

      return delay
    }

    // Schedule emails based on path delays
    for (const node of nodes) {
      if (node.type === 'email' && node.data?.emailData) {
        const pathDelay = calculatePathDelay(node.id)
        const { to, subject, body } = node.data.emailData

        // Schedule with more detailed job data
        await agenda.schedule(`in ${pathDelay} hours`, 'send email', {
          to,
          subject,
          body,
          templateId: node.data.templateId,
          flowchartId: node.id,
          metadata: {
            scheduledAt: new Date(),
            totalDelay: pathDelay,
            flowchartId: node.id,
            nodeType: 'email'
          }
        })

        console.log(`Scheduled email "${subject}" to ${to} with ${pathDelay}h delay`)
      }
    }

    // Save flowchart with additional metadata
    const result = await flowcharts.insertOne({
      nodes,
      edges,
      createdAt: new Date(),
      metadata: {
        totalNodes: nodes.length,
        emailNodes: nodes.filter((n: EmailNode) => n.type === 'email').length,
        delayNodes: nodes.filter((n: EmailNode) => n.type === 'delay').length,
        lastModified: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Sequence saved and emails scheduled',
      id: result.insertedId.toString(),
      stats: {
        emailsScheduled: nodes.filter((n: EmailNode) => n.type === 'email').length,
        totalNodes: nodes.length
      }
    })
  } catch (error) {
    console.error('Server error while saving flowchart:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save sequence',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

