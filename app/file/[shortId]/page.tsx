'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import { Download, Lock, AlertCircle, Loader2, Upload } from 'lucide-react'
import { formatFileSize } from '@/lib/utils-file-sharing'

interface FileData {
  id: string
  filename: string
  fileSize: number
  mimeType: string
  blobUrl: string
  expiresAt: string
  description?: string
  downloadedCount: number
  requiresPassword: boolean
}

export default function FileDownloadPage() {
  const params = useParams()
  const shortId = params.shortId as string
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await fetch(`/api/file/${shortId}`)
        const data = await response.json()

        if (!response.ok) {
          if (data.requiresPassword) {
            setShowPasswordInput(true)
          } else {
            setError(data.error || 'File not found')
          }
        } else {
          setFileData(data.file)
          setShowPasswordInput(data.file.requiresPassword)
        }
      } catch (err) {
        setError('Failed to fetch file information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFileData()
  }, [shortId])

  const handleDownload = async () => {
    if (!fileData && !password) return

    setIsDownloading(true)
    setError(null)

    try {
      if (showPasswordInput && !fileData) {
        // Verify password first
        const response = await fetch(`/api/file/${shortId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid password')
          setIsDownloading(false)
          return
        }

        setFileData(data.file)
      }

      // Download the file
      if (fileData) {
        const link = document.createElement('a')
        link.href = fileData.blobUrl
        link.download = fileData.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      setError('Failed to download file')
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !showPasswordInput) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">File Not Available</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button className="w-full" asChild>
            <a href="/">Back to Home</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">ShahShare</h1>
            <span className="text-xs text-muted-foreground ml-2">by Shahariar</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 space-y-6">
        {!fileData ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Password Protected</h1>
              <p className="text-muted-foreground">
                This file is password protected. Enter the password to continue.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-input"
                onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
              />
            </div>

            <Button
              size="lg"
              onClick={handleDownload}
              disabled={isDownloading || !password}
              className="w-full"
            >
              {isDownloading ? 'Verifying...' : 'Unlock & Download'}
            </Button>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Download File</h1>
            </div>

            <div className="space-y-3 bg-card/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  File Name
                </label>
                <p className="text-foreground font-medium truncate">
                  {fileData.filename}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  File Size
                </label>
                <p className="text-foreground">
                  {formatFileSize(fileData.fileSize)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Downloads
                </label>
                <p className="text-foreground">{fileData.downloadedCount}</p>
              </div>
              {fileData.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-foreground text-sm">{fileData.description}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Expires
                </label>
                <p className="text-foreground text-sm">
                  {new Date(fileData.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full"
            >
              {isDownloading ? 'Downloading...' : 'Download File'}{' '}
              <Download className="ml-2 w-4 h-4" />
            </Button>
          </>
        )}
        </Card>
      </main>

      <Footer />
    </div>
  )
}
