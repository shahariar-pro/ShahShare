'use client'

import { useState, useRef } from 'react'
import { Upload, Cloud } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void
}

export default function UploadZone({ onFilesSelected }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      const sizeInMB = file.size / (1024 * 1024)
      return sizeInMB <= 60 && selectedFiles.length <= 10
    })

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-card/50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        className="hidden"
        accept="*"
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
          isDragging ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
        }`}>
          {isDragging ? (
            <Cloud className="w-6 h-6" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <div>
          <p className="text-lg font-semibold">
            {isDragging ? 'Drop your files here' : 'Drag & drop your files here'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to select files (max 10 files, 60MB total)
          </p>
        </div>
      </div>
    </Card>
  )
}
