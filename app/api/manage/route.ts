import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserUploads, deleteUpload, getUploadById } from '@/lib/db'
import { verifyPassword } from '@/lib/utils-file-sharing'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: uploads, error } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      uploads,
    })
  } catch (error) {
    console.error('Get uploads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { uploadId, password } = await request.json()

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID required' },
        { status: 400 }
      )
    }

    // Get the upload to check if it exists and has password
    const supabase = await createClient()
    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('id, password_hash, short_id, filename')
      .eq('id', uploadId)
      .single()

    if (fetchError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
    }

    // Verify password if the file is password protected
    if (upload.password_hash) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password required' },
          { status: 403 }
        )
      }

      const isPasswordCorrect = await verifyPassword(password, upload.password_hash)
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: 'Incorrect password' },
          { status: 403 }
        )
      }
    }

    // Delete from database and storage
    await deleteUpload(uploadId)

    return NextResponse.json({
      success: true,
      message: 'Upload deleted successfully',
    })
  } catch (error) {
    console.error('Delete upload error:', error)
    return NextResponse.json(
      { error: 'Failed to delete upload' },
      { status: 500 }
    )
  }
}
