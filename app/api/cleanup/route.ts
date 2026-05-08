import { NextRequest, NextResponse } from 'next/server'
import { cleanupExpiredUploads } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.CLEANUP_SECRET_KEY

    if (secretKey && authHeader !== 'Bearer ' + secretKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const deletedCount = await cleanupExpiredUploads()

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      message: 'Cleaned up ' + deletedCount + ' expired uploads'
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup expired uploads' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST(new NextRequest('http://localhost'))
}