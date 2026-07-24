import type { SignUploadResponse, JobResponse } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-25f29.up.railway.app'

export async function signUpload(
  fileName: string,
  fileSize: number,
  contentType: string,
  sessionToken: string
): Promise<SignUploadResponse> {
  const res = await fetch(`${API_BASE}/api/v1/uploads/sign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, fileSize, contentType, sessionToken }),
  })
  if (!res.ok) throw new Error('Failed to get upload URL')
  return res.json()
}

export async function uploadToR2(
  uploadUrl: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error('Upload failed')))
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(file)
  })
}

export async function createJob(
  fileKey: string,
  originalFilename: string,
  sessionToken: string,
  clipCount = 6
): Promise<JobResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileKey, originalFilename, sessionToken, clipCount }),
  })
  if (!res.ok) throw new Error('Failed to create job')
  return res.json()
}

export async function pollJob(jobId: string, sessionToken: string): Promise<JobResponse> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}?session=${sessionToken}`)
  if (!res.ok) throw new Error('Failed to poll job')
  return res.json()
}

export interface VideoMetadata {
  topics: string[]
  contentType: string
  tone: string
  audience: string
  language: string
}

export async function confirmJob(
  jobId: string,
  extraContext: string | null
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extraContext }),
  })
  if (!res.ok) throw new Error('Failed to confirm job')
}

export async function getJobMetadata(jobId: string, sessionToken: string): Promise<{
  topics: string[]
  contentType: string
  tone: string
  audience: string
}> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/${jobId}/metadata?session=${sessionToken}`)
  if (!res.ok) throw new Error('Failed to get metadata')
  return res.json()
}

export async function getJobHistory(accessToken: string): Promise<JobResponse[]> {
  const res = await fetch(`${API_BASE}/api/v1/jobs/history`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function createJobFromUrl(
  url: string,
  sessionToken: string,
  clipCount = 6
): Promise<JobResponse> {
  const filename = url.includes('youtu') ? 'YouTube video' :
                   url.includes('vimeo') ? 'Vimeo video' : 'Video'
  const res = await fetch(`${API_BASE}/api/v1/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      youtubeUrl: url,
      originalFilename: filename,
      sessionToken,
      clipCount,
    }),
  })
  if (!res.ok) throw new Error('Failed to create job')
  return res.json()
}