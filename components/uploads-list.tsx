'use client'

import { useState } from 'react'
import { Copy, QrCode as QrCodeIcon, Trash2, Clock, Lock, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Upload {
  id: string
  name: string
  size: number
  createdAt: string
  expiresAt: string
  password: boolean
  shortId: string
  downloads: number
}

interface UploadsListProps {
  uploads: Upload[]
  onDelete: (id: string) => void
}

export default function UploadsList({ uploads, onDelete }: UploadsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopyLink = (shortId: string) => {
    const link = `${window.location.origin}/download/${shortId}`
    navigator.clipboard.writeText(link)
    setCopied(shortId)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = (id: string) => {
    // TODO: Call delete API
    onDelete(id)
    setDeleteId(null)
  }

  const formatFileSize = (bytes: number) => {
    const mb = (bytes / (1024 * 1024)).toFixed(2)
    return `${mb} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const days = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <>
      <div className="space-y-3">
        {uploads.map((upload) => {
          const daysLeft = getDaysUntilExpiry(upload.expiresAt)
          const isExpiringSoon = daysLeft <= 2

          return (
            <Card
              key={upload.id}
              className="p-4 border border-border hover:bg-card/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{upload.name}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(upload.size)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                    </span>
                    {upload.password && (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Protected
                      </span>
                    )}
                    <span>{upload.downloads} downloads</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyLink(upload.shortId)}
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {copied === upload.shortId && (
                    <span className="text-xs text-primary">Copied!</span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Download QR code"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(upload.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this upload? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
