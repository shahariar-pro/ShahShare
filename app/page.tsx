'use client'

import { useState } from 'react'
import Link from 'next/link'
import UploadZone from '@/components/upload-zone'
import FilePreview from '@/components/file-preview'
import ShareOptions from '@/components/share-options'
import TextUpload from '@/components/text-upload'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Lock, Clock, Link2, QrCode, ArrowRight, Check, FileText } from 'lucide-react'

interface UploadedFile {
  file: File
  preview?: string
}

interface ShareResult {
  id: string
  shortId: string
  filename: string
  fileSize: number
  expiresAt: string
  downloadLink: string
  password?: string
}

export default function Home() {
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file')
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])
  const [textContent, setTextContent] = useState('')
  const [shareOptions, setShareOptions] = useState({
    password: '',
    expiryDays: 7,
    description: '',
  })
  const [isUploading, setIsUploading] = useState(false)
  const [shareResult, setShareResult] = useState<ShareResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFilesSelected = (files: File[]) => {
    const newFiles = files.map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }))
    setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 10))
    setUploadError(null)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev]
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview!)
      }
      updated.splice(index, 1)
      return updated
    })
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select at least one file')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadedFile = selectedFiles[0]
      const formData = new FormData()
      formData.append('file', uploadedFile.file)
      formData.append('password', shareOptions.password)
      formData.append('expiryDays', shareOptions.expiryDays.toString())
      formData.append('description', shareOptions.description)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setShareResult({
        ...data.upload,
        password: shareOptions.password,
      })

      setSelectedFiles([])
      setShareOptions({ password: '', expiryDays: 7, description: '' })
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Upload failed. Please try again.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  if (shareResult) {
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
            <Link href="/dashboard">
              <Button variant="outline">My Files</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
          <Card className="w-full max-w-md p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">File Ready to Share</h2>
              <p className="text-muted-foreground">
                Your file is securely stored and ready to be shared
              </p>
            </div>

            <div className="space-y-4 bg-card/50 p-4 rounded-lg">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  File Name
                </label>
                <p className="text-foreground font-medium truncate">{shareResult.filename}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Share Link
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}${shareResult.downloadLink}`}
                    readOnly
                    className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono truncate"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const link = `${typeof window !== 'undefined' ? window.location.origin : ''}${shareResult.downloadLink}`
                      navigator.clipboard.writeText(link)
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              {shareResult.password && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Password
                  </label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={shareResult.password}
                      readOnly
                      className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(shareResult.password!)
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Expires
                </label>
                <p className="text-foreground text-sm">
                  {new Date(shareResult.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShareResult(null)}
              >
                Share Another
              </Button>
              <Button className="flex-1" asChild>
                <Link href={shareResult.downloadLink}>View Link</Link>
              </Button>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ShahShare</h1>
            </div>
            <span className="text-xs text-muted-foreground ml-2">by Shahariar</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">My Files</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={uploadMode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setUploadMode('file')
                  setSelectedFiles([])
                  setTextContent('')
                  setUploadError(null)
                }}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                File Upload
              </Button>
              <Button
                variant={uploadMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setUploadMode('text')
                  setSelectedFiles([])
                  setUploadError(null)
                }}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Text Upload
              </Button>
            </div>

            {uploadMode === 'file' && (
              <UploadZone onFilesSelected={handleFilesSelected} />
            )}

            {uploadMode === 'text' && (
              <TextUpload text={textContent} onTextChange={setTextContent} />
            )}

            {uploadMode === 'file' && selectedFiles.length > 0 && (
              <Card className="p-6 border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Files ({selectedFiles.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((item, index) => (
                    <FilePreview
                      key={index}
                      file={item.file}
                      preview={item.preview}
                      onRemove={() => handleRemoveFile(index)}
                    />
                  ))}
                </div>
              </Card>
            )}

            {(uploadMode === 'file' && selectedFiles.length > 0) || (uploadMode === 'text' && textContent.length > 0) ? (
              <ShareOptions
                options={shareOptions}
                onChange={setShareOptions}
              />
            ) : null}

            {uploadError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                {uploadError}
              </div>
            )}

            {(uploadMode === 'file' && selectedFiles.length > 0) || (uploadMode === 'text' && textContent.length > 0) ? (
              <div className="flex gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleUpload(false)}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : 'Just Upload'}
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleUpload(true)}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? 'Uploading...' : 'Upload & Share'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <Card className="p-6 border border-border">
              <h3 className="text-sm font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <Upload className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Up to 10 files, 60MB total</span>
                </li>
                <li className="flex gap-3">
                  <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Optional password protection</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Auto-delete after 7 days</span>
                </li>
                <li className="flex gap-3">
                  <Link2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Custom short links</span>
                </li>
                <li className="flex gap-3">
                  <QrCode className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>QR codes for sharing</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border border-border bg-card/50">
              <h3 className="text-sm font-semibold mb-2">Privacy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Files are securely stored and automatically deleted after expiry. No sign-up required.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
text-muted-foreground leading-relaxed">
                Files are securely stored and automatically deleted after expiry. No sign-up required.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
