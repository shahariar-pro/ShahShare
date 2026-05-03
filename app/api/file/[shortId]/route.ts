import { NextRequest, NextResponse } from 'next/server'
import { getUploadByShortId, incrementDownloadCount } from '@/lib/db'
import {
  verifyPassword,
  isFileExpired,
  getShareLink,
} from '@/lib/utils-file-sharing'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params
    const password = request.nextUrl.searchParams.get('password')

    const upload = await getUploadByShortId(shortId)

    if (!upload) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (isFileExpired(upload.expires_at)) {
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      )
    }

    // Check password if required
    if (upload.password_hash) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password required', requiresPassword: true },
          { status: 403 }
        )
      }

      const isPasswordCorrect = await verifyPassword(
        password,
        upload.password_hash
      )
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: 'Incorrect password' },
          { status: 403 }
        )
      }
    }

    // Return file metadata
    return NextResponse.json({
      success: true,
      file: {
        id: upload.id,
        filename: upload.filename,
        fileSize: upload.file_size,
        mimeType: upload.mime_type,
        blobUrl: upload.blob_url,
        expiresAt: upload.expires_at,
        description: upload.description,
        downloadedCount: upload.downloaded_count,
        requiresPassword: !!upload.password_hash,
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    const { shortId } = await params
    const { password } = await request.json()

    const upload = await getUploadByShortId(shortId)

    if (!upload) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    if (isFileExpired(upload.expires_at)) {
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      )
    }

    if (upload.password_hash) {
      const isPasswordCorrect = await verifyPassword(
        password,
        upload.password_hash
      )
      if (!isPasswordCorrect) {
        return NextResponse.json(
          { error: 'Incorrect password' },
          { status: 403 }
        )
      }
    }

    // Increment download count
    await incrementDownloadCount(upload.id)

    return NextResponse.json({
      success: true,
      file: {
        id: upload.id,
        filename: upload.filename,
        fileSize: upload.file_size,
        mimeType: upload.mime_type,
        blobUrl: upload.blob_url,
        expiresAt: upload.expires_at,
      },
    })
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    )
  }
}
