"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { templateId: string; templateName: string; emailData: EmailData }) => void
}

interface EmailData {
  subject: string
  body: string
  to: string
}

export function EmailModal({ isOpen, onClose, onSave }: EmailModalProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    subject: '',
    body: '',
    to: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a unique template ID
    const templateId = `template-${Date.now()}`
    const templateName = `Email Template ${new Date().toLocaleDateString()}`
    
    onSave({
      templateId,
      templateName,
      emailData,
    })
    
    // Reset form
    setEmailData({
      subject: '',
      body: '',
      to: '',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Cold Email</DialogTitle>
          <DialogDescription>
            Configure your cold email settings here. The email will be sent based on the sequence flow.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Email</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Email Content</Label>
            <Textarea
              id="body"
              placeholder="Write your email content here..."
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              required
              className="h-32"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Email</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

