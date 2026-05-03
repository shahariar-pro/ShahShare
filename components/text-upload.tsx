'use client'

import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TextUploadProps {
  onTextChange: (text: string) => void
  text: string
}

export default function TextUpload({ onTextChange, text }: TextUploadProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        <h3 className="text-sm font-semibold">Share Text</h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste or type your text here... (up to 10MB)"
        className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
        rows={10}
      />

      <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
        <span>{text.length} characters</span>
        {text.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="ml-auto"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
