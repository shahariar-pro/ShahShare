import { nanoid } from 'nanoid'
import bcryptjs from 'bcryptjs'
import QRCode from 'qrcode'

/**
 * Generate a short, unique ID for file sharing links
 */
export function generateShortId(): string {
  return nanoid(8)
}

/**
 * Hash a password for secure storage
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

/**
 * Generate a QR code as a data URL
 */
export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Check if a file is expired
 */
export function isFileExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

/**
 * Get time remaining until expiry
 */
export function getTimeRemaining(expiresAt: string): {
  expired: boolean
  timeLeft: string
  percentage: number
} {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const createdAt = new Date(expiresAt)
  createdAt.setDate(createdAt.getDate() - 7) // Assume 7 day default

  if (expiry <= now) {
    return { expired: true, timeLeft: 'Expired', percentage: 0 }
  }

  const totalMs = expiry.getTime() - createdAt.getTime()
  const remainingMs = expiry.getTime() - now.getTime()
  const percentage = (remainingMs / totalMs) * 100

  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))

  let timeLeft = ''
  if (days > 0) timeLeft = `${days}d ${hours}h`
  else if (hours > 0) timeLeft = `${hours}h ${minutes}m`
  else timeLeft = `${minutes}m`

  return { expired: false, timeLeft, percentage }
}

/**
 * Generate share link
 */
export function getShareLink(shortId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/file/${shortId}`
  }
  return `/file/${shortId}`
}
