// 📁 services/employer-service.ts
import { supabase } from '@/lib/client/supabase'
import { EmployerProfilePayload } from '@/types/employer'

export async function uploadEmployerImages(photos: File[]): Promise<string[]> {
  const urls: string[] = []

  for (const photo of photos) {
    const fileExt = photo.name.split('.').pop()
    const filePath = `employer-photos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { error: uploadError } = await supabase
      .storage
      .from('employer-photos')
      .upload(filePath, photo)

    if (uploadError) throw uploadError

    const { data } = supabase
      .storage
      .from('employer-photos')
      .getPublicUrl(filePath)

    urls.push(data.publicUrl)
  }

  return urls
}

export async function deleteEmployerImages(imageUrls: string[]) {
  const filePaths = imageUrls.map((url) => {
    const parts = url.split('/employer-photos/')
    return parts[1] ? `employer-photos/${parts[1]}` : ''
  }).filter(Boolean)

  if (filePaths.length === 0) return

  const { error } = await supabase.storage
    .from('employer-photos')
    .remove(filePaths)

  if (error) throw error
}

export async function saveEmployerProfile(payload: EmployerProfilePayload) {
  const safePayload = {
    ...payload,
    description: payload.description ?? "",
    user_id : Number(payload.user_id?? 1),
  };
  console.log(safePayload);
  const { data, error } = await supabase
    .from('business_loc')
    .insert([safePayload]);

  if (error) throw error
  return data
}

export async function updateEmployerProfile(id: number, payload: EmployerProfilePayload) {
  const { data, error } = await supabase
    .from('business_loc')
    .update(payload)
    .eq('id', id)

  if (error) throw error
  return data
}

export async function deleteSingleEmployerImage(url: string) {
  const parts = url.split('/employer-photos/')
  const path = parts[1] ? `employer-photos/${parts[1]}` : ''
  if (!path) return

  const { error } = await supabase.storage
    .from('employer-photos')
    .remove([path])

  if (error) throw error
}