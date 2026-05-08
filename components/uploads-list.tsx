'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Copy, QrCode as QrCodeIcon, Trash2, Clock, Lock, Download, Eye, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Upload {
  id: string
  name: string
  size: number
  createdAt: string
  expiresAt: string
  password: boolean
  shortId: string
  downloads: number
  blobUrl?: string
}

interface UploadsListProps {
  uploads: Upload[]
  onDelete: (id: string, password?: string) => void
}

export default function UploadsList({ uploads, onDelete }: UploadsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [currentUpload, setCurrentUpload] = useState<Upload | null>(null)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update time every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const handleCopyLink = (shortId: string) => {
    const link = `${window.location.origin}/file/${shortId}`
    navigator.clipboard.writeText(link)
    setCopied(shortId)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = () => {
    if (!deleteId) return

    const upload = uploads.find(u => u.id === deleteId)

    if (upload?.password) {
      if (!deletePassword) {
        setDeleteError('Please enter the password')
        return
      }
    }

    onDelete(deleteId, deletePassword)
    setDeleteId(null)
    setDeletePassword('')
    setDeleteError('')
  }

  const generateQRCode = async (shortId: string) => {
    const link = `${window.location.origin}/file/${shortId}`
    try {
      const QRCode = await import('qrcode')
      const url = await QRCode.toDataURL(link, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      setQrCodeUrl(url)
      setCurrentUpload(uploads.find(u => u.shortId === shortId) || null)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  }

  const handleDownload = async (upload: Upload) => {
    try {
      const response = await fetch(`/api/file/${upload.shortId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.file?.blobUrl) {
          const link = document.createElement('a')
          link.href = data.file.blobUrl
          link.download = upload.name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    } catch (error) {
      console.error('Failed to download:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    const mb = (bytes / (1024 * 1024)).toFixed(2)
    return `${mb} MB`
  }

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const days = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getTimeRemaining = (expiresAt: string) => {
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - currentTime

    if (diff <= 0) return { text: 'Expired', urgent: true }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    const urgent = days <= 1

    if (days > 0) return { text: days + 'd ' + hours + 'h', urgent }
    if (hours > 0) return { text: hours + 'h ' + minutes + 'm', urgent }
    return { text: minutes + 'm', urgent: true }
  }

  return (
    <>
      <div className="space-y-3">
        {uploads.map((upload) => {
          const daysLeft = getDaysUntilExpiry(upload.expiresAt)
          const isExpired = daysLeft <= 0

          return (
            <Card
              key={upload.id}
              className="p-4 border border-border hover:bg-card/50 transition-colors"
              style={isExpired ? { opacity: 0.6 } : undefined}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{upload.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(upload.size)}</span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${getTimeRemaining(upload.expiresAt).urgent ? (isExpired ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400') : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      <Timer className="w-3 h-3" />
                      {getTimeRemaining(upload.expiresAt).text}
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

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    title="View file"
                    disabled={isExpired}
                  >
                    <Link href={`/file/${upload.shortId}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(upload)}
                    title="Download"
                    disabled={isExpired}
                  >
                    <Download className="w-4 h-4" />
                  </Button>

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
                    onClick={() => generateQRCode(upload.shortId)}
                    title="Download QR code"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDeleteId(upload.id)
                      setDeletePassword('')
                      setDeleteError('')
                    }}
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this upload? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {uploads.find(u => u.id === deleteId)?.password && (
            <div className="py-3">
              <label className="text-sm font-medium block mb-2">
                This file is password protected. Enter password to delete:
              </label>
              <Input
                type="password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value)
                  setDeleteError('')
                }}
                placeholder="Enter password"
                className="bg-input"
              />
              {deleteError && (
                <p className="text-sm text-destructive mt-2">{deleteError}</p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!qrCodeUrl} onOpenChange={(open) => !open && setQrCodeUrl(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              {currentUpload && `Scan to download "${currentUpload.name}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
            )}
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                if (qrCodeUrl) {
                  const link = document.createElement('a')
                  link.href = qrCodeUrl
                  link.download = `qr-code-${currentUpload?.shortId}.png`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}