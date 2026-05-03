'use client'

import { X, File, FileText, Image, Music, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilePreviewProps {
  file: File
  onRemove: () => void
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="w-4 h-4" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <Image className="w-4 h-4" />
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className="w-4 h-4" />
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
      return <Archive className="w-4 h-4" />
    default:
      return <File className="w-4 h-4" />
  }
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)

  return (
    <div className="flex items-center justify-between p-3 bg-card/50 border border-border rounded-md hover:bg-card/80 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
          {getFileIcon(file.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{sizeInMB} MB</p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="ml-2 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
