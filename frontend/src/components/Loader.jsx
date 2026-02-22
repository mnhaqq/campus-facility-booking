import { motion } from 'framer-motion'

/* ── Spinning ring ── */
export function SpinnerLoader({ size = 'md', className = '' }) {
  const sz = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' }[size]
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sz} rounded-full`}
        style={{ borderColor: 'rgba(168,85,247,0.2)', borderTopColor: '#A855F7' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

/* ── Full-page loader ── */
export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-[3px]"
          style={{ borderColor: 'rgba(168,85,247,0.15)', borderTopColor: '#A855F7' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2"
          style={{ borderColor: 'transparent', borderBottomColor: '#E879F9' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg">🔮</span>
        </div>
      </div>
      <p className="text-sm font-medium animate-pulse-uv" style={{ color: '#9580C1' }}>{message}</p>
    </div>
  )
}

/* ── Skeleton card ── */
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="uv-glass p-6 space-y-4">
      <div className="uv-skeleton h-6 w-2/3 rounded-lg" style={{ minHeight: '1.5rem' }} />
      <div className="uv-skeleton h-3 w-1/3 rounded-md" style={{ minHeight: '0.75rem' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`uv-skeleton h-4 rounded-md ${i === lines - 1 ? 'w-1/2' : 'w-full'}`}
          style={{ minHeight: '1rem' }} />
      ))}
      <div className="uv-skeleton h-10 w-36 rounded-xl mt-2" style={{ minHeight: '2.5rem' }} />
    </div>
  )
}

/* ── Skeleton table row ── */
export function SkeletonRow() {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-2xl"
      style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.1)' }}
    >
      <div className="uv-skeleton h-10 w-10 rounded-xl flex-shrink-0" style={{ minWidth: '2.5rem' }} />
      <div className="flex-1 space-y-2">
        <div className="uv-skeleton h-4 w-3/4 rounded-md" style={{ minHeight: '1rem' }} />
        <div className="uv-skeleton h-3 w-1/2 rounded-md" style={{ minHeight: '0.75rem' }} />
      </div>
      <div className="uv-skeleton h-6 w-20 rounded-full flex-shrink-0" style={{ minHeight: '1.5rem' }} />
      <div className="uv-skeleton h-8 w-16 rounded-xl flex-shrink-0" style={{ minHeight: '2rem' }} />
    </div>
  )
}

/* ── Facilities grid skeleton ── */
export function FacilityGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  )
}

/* ── Slot grid skeleton ── */
export function SlotGridSkeleton() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-2">
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="uv-skeleton rounded-xl" style={{ minHeight: '3.5rem' }} />
      ))}
    </div>
  )
}
