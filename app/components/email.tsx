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
      <DialogContent className="sm:max-w-[425px] max-w-full px-4 sm:px-6 py-6 sm:py-8">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Add Cold Email</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
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
              className="w-full"
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
              className="w-full"
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
              className="w-full h-32 sm:h-48"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-auto sm:w-1/3">
              Cancel
            </Button>
            <Button type="submit" className="w-auto sm:w-1/3">
              Add Email
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
