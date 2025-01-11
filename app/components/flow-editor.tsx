"use client"

import { useCallback, useState, useEffect, useMemo } from "react"
import { 
  ReactFlow, 
  addEdge, 
  Background, 
  Controls,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  NodeProps,
  Node,
  Connection
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from "@/components/ui/button"
import { EmailModal } from "./email"
import { DelayModal } from "./delaymodel"
import { Card } from "@/components/ui/card"
import { Clock, Mail, Users, Plus, Save, Trash2, Send, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

type NodeData = {
  label: string;
  type?: string;
  templateId?: string;
  templateName?: string;
  delayTime?: number;
  emailData?: {
    to: string;
    subject: string;
    body: string;
  };
}

type CustomNode = Node<NodeData>;

const initialNodes = [
  {
    id: "source",
    type: "source",
    position: { x: 250, y: 5 },
    data: { label: "Leads from Test List", type: "source" },
  },
  {
    id: "start",
    type: "start",
    position: { x: 250, y: 100 },
    data: { label: "Sequence Start Point" },
  },
]

export function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes as CustomNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { 
      id: 'e1', 
      source: 'source', 
      target: 'start', 
      type: 'smoothstep' 
    }
  ])
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false)
  const [currentFlowchartId, setCurrentFlowchartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddOptions, setShowAddOptions] = useState(false)

  useEffect(() => {
    // Load the most recent flowchart when the component mounts
    fetchMostRecentFlowchart()
  }, [])

  const fetchMostRecentFlowchart = async () => {
    try {
      const response = await fetch('/api/flowcharts')
      if (response.ok) {
        const flowcharts = await response.json()
        if (flowcharts.length > 0) {
          const mostRecent = flowcharts[flowcharts.length - 1]
          setNodes(mostRecent.nodes)
          setEdges(mostRecent.edges)
          setCurrentFlowchartId(mostRecent._id)
        }
      } else {
        console.error('Failed to fetch flowcharts')
      }
    } catch (error) {
      console.error('Error fetching flowcharts:', error)
    }
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )
  const addEmailNode = useCallback(
    (data: { templateId: string; templateName: string; emailData: { to: string; subject: string; body: string } }) => {
      const newNode: CustomNode = {
        id: `email-${Date.now()}`,
        type: "email",
        position: { x: 250, y: (nodes.length + 1) * 100 },
        data: { 
          label: "Send Email",
          type: "email",
          templateId: data.templateId,
          templateName: data.templateName,
          emailData: data.emailData,
        },
      };
      
      fetch('/api/schedule-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.emailData.to,
          subject: data.emailData.subject,
          body: data.emailData.body,
          templateId: data.templateId,
        }),
      }).catch(console.error);

      const addNode = {
        id: `add-${Date.now()}`,
        type: "add",
        position: { x: 250, y: (nodes.length + 2) * 100 },
        data: { label: "Add Block" },
      };
      
      setNodes((nds) => [...nds, newNode, addNode]);
      setEdges((eds) => {
        const newEdges = [...eds];
        if (nodes.length > 0) {
          newEdges.push({
            id: `e-${Date.now()}`,
            source: nodes[nodes.length - 1].id,
            target: newNode.id,
            type: 'smoothstep'
          });
        }
        newEdges.push({
          id: `e-${Date.now()}-1`,
          source: newNode.id,
          target: addNode.id,
          type: 'smoothstep'
        });
        return newEdges;
      });
    },
    [nodes, setNodes, setEdges]
  );

  const addDelayNode = useCallback((data: { delayTime: number }) => {
    const newNode = {
      id: `delay-${Date.now()}`,
      type: "delay",
      position: { x: 250, y: (nodes.length + 1) * 100 },
      data: { label: `Wait ${data.delayTime} hours`, type: "delay", delayTime: data.delayTime },
    }
    const addNode = {
      id: `add-${Date.now()}`,
      type: "add",
      position: { x: 250, y: (nodes.length + 2) * 100 },
      data: { label: "Add Block" },
    }
    setNodes((nds) => [...nds, newNode, addNode])
    setEdges((eds) => {
      const newEdges = [...eds]
      if (nodes.length > 0) {
        newEdges.push({ 
          id: `e-${Date.now()}`, 
          source: nodes[nodes.length - 1].id, 
          target: newNode.id,
          type: 'smoothstep'
        })
      }
      newEdges.push({ 
        id: `e-${Date.now()}-1`, 
        source: newNode.id, 
        target: addNode.id,
        type: 'smoothstep'
      })
      return newEdges
    })
    setIsDelayModalOpen(false)
  }, [nodes, setNodes, setEdges])

  const addLeadSourceNode = useCallback(() => {
    const newNode = {
      id: `lead-source-${Date.now()}`,
      type: "source",
      position: { x: 250, y: (nodes.length + 1) * 100 },
      data: { label: "New Lead Source", type: "source" },
    }
    const addNode = {
      id: `add-${Date.now()}`,
      type: "add",
      position: { x: 250, y: (nodes.length + 2) * 100 },
      data: { label: "Add Block" },
    }
    setNodes((nds) => [...nds, newNode, addNode])
    setEdges((eds) => {
      const newEdges = [...eds]
      if (nodes.length > 0) {
        newEdges.push({ 
          id: `e-${Date.now()}`, 
          source: nodes[nodes.length - 1].id, 
          target: newNode.id,
          type: 'smoothstep'
        })
      }
      newEdges.push({ 
        id: `e-${Date.now()}-1`, 
        source: newNode.id, 
        target: addNode.id,
        type: 'smoothstep'
      })
      return newEdges
    })
  }, [nodes, setNodes, setEdges])

  const saveFlowchart = useCallback(async () => {
    setIsLoading(true);
    const flowData = {
      nodes,
      edges,
    };
    try {
      const response = await fetch('/api/save-flowcharts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Save response:', data);

      if (data.id) {
        setCurrentFlowchartId(data.id);
      }
      
      console.log(data.message || 'Flowchart saved successfully');
    } catch (error) {
      console.error('Error saving flowchart:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [nodes, edges]);

  const deleteFlowchart = useCallback(async () => {
    if (!currentFlowchartId) {
      console.error('No flowchart selected to delete');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/flowcharts?id=${currentFlowchartId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete flowchart');
      }

      // Reset the flow editor state
      setNodes(initialNodes as CustomNode[]);
      setEdges([{ 
        id: 'e1', 
        source: 'source', 
        target: 'start', 
        type: 'smoothstep' 
      }]);
      setCurrentFlowchartId(null);
    } catch (error) {
      console.error('Error deleting flowchart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentFlowchartId, setNodes, setEdges]);

  const testScheduleEmail = useCallback(async () => {
    try {
      const response = await fetch('/api/schedule-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'test@example.com',
          subject: 'Test Scheduled Email',
          body: '<h1>This is a test email</h1><p>Scheduled to be sent after 1 hour.</p>',
        }),
      })

      if (response.ok) {
        console.log('Email scheduled successfully')
      } else {
        throw new Error('Failed to schedule email')
      }
    } catch (error) {
      console.error('Error scheduling email:', error)
    }
  }, [])

  const defaultEdgeOptions = {
    style: { strokeWidth: 2, stroke: '#b1b1b7' },
    type: 'smoothstep',
  }

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  }, [setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({
    source: ({ data, id }: NodeProps) => (
      <Card className="relative bg-white border-2 rounded-lg p-4 min-w-[250px] group">
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          <span className="font-medium">{data.label}</span>
          {id !== "source" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(id);
              }}
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </Card>
    ),
    start: ({ data }: NodeProps) => (
      <Card className="relative bg-white border-2 rounded-lg p-4 min-w-[250px]">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        <div className="text-center text-gray-600 font-medium">
          {data.label}
        </div>
      </Card>
    ),
    email: ({ data, id }: NodeProps) => (
      <Card className="relative bg-white border-2 rounded-lg p-4 min-w-[250px] group">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Email</span>
            <span className="text-sm text-purple-500">Template: {data.templateName}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(id);
            }}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </Card>
    ),
    delay: ({ data }: NodeProps) => (
      <Card className="relative bg-white border-2 rounded-lg p-4 min-w-[250px]">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <span className="font-medium">{data.label}</span>
        </div>
      </Card>
    ),
    add: ({ data }: NodeProps) => (
      <div className="relative flex justify-center cursor-pointer" onClick={() => setShowAddOptions(true)}>
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        <Button variant="outline" size="icon" className="rounded-full w-8 h-8 bg-blue-500 text-white hover:bg-blue-600">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    ),
  }), [setShowAddOptions, deleteNode]);

  return (
    <div className="w-full h-[800px] bg-gray-50">
      <div className="p-4 border-b bg-white">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEmailModalOpen(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Add Email
          </Button>
          <Button variant="outline" onClick={() => setIsDelayModalOpen(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Add Delay
          </Button>
          <Button variant="outline" onClick={addLeadSourceNode}>
            <Users className="w-4 h-4 mr-2" />
            Add Lead Source
          </Button>
          <Button 
            variant="outline" 
            onClick={saveFlowchart}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Flowchart'}
          </Button>
          <Button 
            variant="outline" 
            onClick={deleteFlowchart}
            disabled={isLoading || !currentFlowchartId}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Flowchart
          </Button>
          <Button variant="outline" onClick={testScheduleEmail}>
            <Send className="w-4 h-4 mr-2" />
            Test Schedule Email
          </Button>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSave={addEmailNode}
      />
      <DelayModal
        isOpen={isDelayModalOpen}
        onClose={() => setIsDelayModalOpen(false)}
        onSave={addDelayNode}
      />
      <Dialog open={showAddOptions} onOpenChange={setShowAddOptions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Block</DialogTitle>
            <DialogDescription>
              Choose the type of block to add to your sequence.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => {
              setShowAddOptions(false)
              setIsEmailModalOpen(true)
            }}>
              <Mail className="w-4 h-4 mr-2" />
              Add Email
            </Button>
            <Button onClick={() => {
              setShowAddOptions(false)
              setIsDelayModalOpen(true)
            }}>
              <Clock className="w-4 h-4 mr-2" />
              Add Delay
            </Button>
            <Button onClick={() => {
              setShowAddOptions(false)
              addLeadSourceNode()
            }}>
              <Users className="w-4 h-4 mr-2" />
              Add Lead Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

