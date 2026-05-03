import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateShortId, hashPassword } from '@/lib/utils-file-sharing'
import { createUpload } from '@/lib/db'
import { addDays } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string
    const expiryDays = parseInt(formData.get('expiryDays') as string) || 7
    const description = formData.get('description') as string
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > 60 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 60MB limit' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const shortId = generateShortId()
    
    // Upload to Supabase Storage
    const fileName = `${shortId}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase storage error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload to storage' },
        { status: 500 }
      )
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('files')
      .getPublicUrl(fileName)

    // Hash password if provided
    let passwordHash = null
    if (password) {
      passwordHash = await hashPassword(password)
    }

    // Calculate expiry date
    const expiresAt = addDays(new Date(), expiryDays)

    // Create database entry
    const upload = await createUpload({
      filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      blob_url: publicUrl,
      short_id: shortId,
      password_hash: passwordHash,
      expires_at: expiresAt.toISOString(),
      description: description || null,
      user_id: userId || undefined,
    })

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        shortId: upload.short_id,
        filename: upload.filename,
        fileSize: upload.file_size,
        expiresAt: upload.expires_at,
        downloadLink: `/file/${upload.short_id}`,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
