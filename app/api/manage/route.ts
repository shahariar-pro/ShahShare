import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserUploads, deleteUpload } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Fetch all uploads ordered by creation date
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
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { uploadId } = await request.json()

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const uploads = await getUserUploads(user.id)
    const upload = uploads.find((u) => u.id === uploadId)

    if (!upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
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
