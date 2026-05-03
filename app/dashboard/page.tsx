'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Upload, Plus, Clock, Lock, Download, Share2, Trash2, QrCode as QrCodeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import UploadsList from '@/components/uploads-list'

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

export default function Dashboard() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch uploads from API
    setIsLoading(false)
  }, [])

  const filteredUploads = uploads.filter(upload =>
    upload.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
              <Link href="/">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Upload
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Search Bar */}
          <div>
            <Input
              placeholder="Search uploads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input max-w-md"
            />
          </div>

          {/* Uploads List */}
          {isLoading ? (
            <Card className="p-12 text-center border border-border">
              <div className="text-muted-foreground">Loading...</div>
            </Card>
          ) : filteredUploads.length === 0 ? (
            <Card className="p-12 text-center border border-border">
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-muted-foreground/30" />
                <div>
                  <p className="text-muted-foreground">No uploads yet</p>
                  <Link href="/">
                    <Button variant="link" className="mt-2">
                      Create your first upload
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <UploadsList uploads={filteredUploads} onDelete={async (id) => {
              try {
                const response = await fetch('/api/manage', {
                  method: 'DELETE',
                  body: JSON.stringify({ uploadId: id }),
                  headers: { 'Content-Type': 'application/json' }
                })
                if (response.ok) {
                  setUploads(uploads.filter(u => u.id !== id))
                }
              } catch (error) {
                console.error('Failed to delete:', error)
              }
            }} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
loads={filteredUploads} onDelete={(id) => {
              setUploads(uploads.filter(u => u.id !== id))
            }} />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
