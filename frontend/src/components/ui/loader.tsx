import { cn } from '@/lib/utils'

interface LoaderProps {
  size?: number
  className?: string
  dotColor?: string
}

const DOT_INDICES = [0, 1, 2]
const DEFAULT_SIZE = 8

export const Loader = ({
  size = DEFAULT_SIZE,
  className = '',
  dotColor = 'rgba(0, 0, 0, 0.6)',
}: LoaderProps) => {
  const dotDimension = Math.max(2, size)
  const gap = dotDimension * 0.4
  const paddingY = dotDimension * 0.3
  const paddingX = dotDimension * 0.6

  return (
    <div
      className={cn('flex items-center bg-transparent', className)}
      style={{ gap, padding: `${paddingY}px ${paddingX}px` }}
    >
      {DOT_INDICES.map((index) => (
        <span
          key={index}
          className="rounded-full animate-bounce"
          style={{
            width: dotDimension,
            height: dotDimension,
            backgroundColor: dotColor,
            animationDelay: `${index * 150}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
    </div>
  )
}

export default Loader