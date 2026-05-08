import { createClient } from '@/lib/supabase/server'

export interface Upload {
  id: string
  user_id: string | null
  filename: string
  file_size: number
  mime_type: string | null
  blob_url: string
  short_id: string
  password_hash: string | null
  expires_at: string
  description: string | null
  downloaded_count: number
  created_at: string
  updated_at: string
}

export async function createUpload(data: {
  filename: string
  file_size: number
  mime_type: string | null
  blob_url: string
  short_id: string
  password_hash: string | null
  expires_at: string
  description: string | null
  user_id?: string
}) {
  const supabase = await createClient()

  const { data: upload, error } = await supabase
    .from('uploads')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return upload as Upload
}

export async function getUploadByShortId(short_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('short_id', short_id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as Upload | null
}

export async function getUserUploads(user_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Upload[]
}

export async function deleteUpload(id: string) {
  const supabase = await createClient()
  console.log('deleteUpload called for:', id)

  // Get upload info first to delete from storage
  const { data: upload, error: fetchError } = await supabase
    .from('uploads')
    .select('blob_url, short_id, filename')
    .eq('id', id)
    .single()

  console.log('deleteUpload: fetch result:', upload, 'error:', fetchError)

  if (!fetchError && upload) {
    // Extract file name from URL or use our naming convention
    // Our convention: ${shortId}-${file.name}
    const fileName = upload.short_id + '-' + upload.filename
    console.log('deleteUpload: removing file from storage:', fileName)
    const { error: storageError } = await supabase.storage.from('files').remove([fileName])
    console.log('deleteUpload: storage remove result:', storageError)
  }

  console.log('deleteUpload: deleting from database')
  const { error } = await supabase
    .from('uploads')
    .delete()
    .eq('id', id)

  console.log('deleteUpload: delete result:', error)
  if (error) throw error
}

export async function incrementDownloadCount(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_download_count', {
    upload_id: id,
  })

  if (error && error.code !== 'PGRST100') {
    // Use direct update if RPC doesn't exist
    const { error: updateError } = await supabase
      .from('uploads')
      .update({ downloaded_count: supabase.rpc('downloaded_count + 1') })
      .eq('id', id)

    if (updateError) throw updateError
  }
}

export async function cleanupExpiredUploads() {
  const supabase = await createClient()

  const { data: expired, error: selectError } = await supabase
    .from('uploads')
    .select('id, short_id, filename')
    .lte('expires_at', new Date().toISOString())

  if (selectError) throw selectError

  if (expired && expired.length > 0) {
    // Delete files from storage first
    for (const upload of expired) {
      const fileName = `${upload.short_id}-${upload.filename}`
      await supabase.storage.from('files').remove([fileName])
    }

    const { error: deleteError } = await supabase
      .from('uploads')
      .delete()
      .in(
        'id',
        expired.map((u) => u.id)
      )

    if (deleteError) throw deleteError
  }

  return expired?.length || 0
}
