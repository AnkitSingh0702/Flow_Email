export interface Node {
    id: string
    type: string
    position: { x: number; y: number }
    data: {
      label: string
      type?: "email" | "delay" | "source"
      templateId?: string
      delayTime?: number
      sourceId?: string
    }
  }
  
  export interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
  }
  
  export interface Edge {
    id: string
    source: string
    target: string
  }
  
  