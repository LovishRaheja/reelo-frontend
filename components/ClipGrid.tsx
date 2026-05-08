import ClipCard from './ClipCard'
import type { ClipResponse } from '@/lib/types'

interface Props {
  clips: ClipResponse[]
}

export default function ClipGrid({ clips }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px',
    }}>
      {clips.map(clip => (
        <ClipCard key={clip.id} clip={clip} />
      ))}
    </div>
  )
}
