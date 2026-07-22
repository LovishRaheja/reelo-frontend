export interface SignUploadResponse {
  uploadUrl: string
  fileKey: string
}

export interface JobResponse {
  id: string
  sessionToken: string
  status: string
  currentStep: string | null
  progress: number
  estimatedSeconds: number | null
  errorCode: string | null
  clipCount: number 
  episode: EpisodeResponse | null
}

export interface EpisodeResponse {
  id: string
  title: string | null
  originalFilename: string
  durationMs: number | null
  clips: ClipResponse[]
  createdAt: string
  reelUrl: string | null
}

export interface ClipResponse {
  id: string
  clipNumber: number
  clipUrl: string
  thumbnailUrl: string | null
  title: string | null
  transcript: string | null
  energyScore: number
  durationMs: number
  emotion: string | null
  emotionScore: number | null
  platform: string | null
}
