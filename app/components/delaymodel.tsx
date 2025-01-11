"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DelayModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { delayTime: number }) => void
}

export function DelayModal({ isOpen, onClose, onSave }: DelayModalProps) {
  const [delayTime, setDelayTime] = useState("")

  const handleSave = () => {
    const delay = parseInt(delayTime, 10)
    if (delay > 0) {
      onSave({ delayTime: delay })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Delay</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Delay Time (hours)</label>
            <Input
              type="number"
              value={delayTime}
              onChange={(e) => setDelayTime(e.target.value)}
              placeholder="Enter delay time in hours"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!delayTime || parseInt(delayTime, 10) <= 0}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

