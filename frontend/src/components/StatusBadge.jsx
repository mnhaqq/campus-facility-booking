import { motion } from 'framer-motion'

/**
 * StatusBadge — UV Nebula palette.
 * Statuses: confirmed | pending | rejected | cancelled
 */

const CFG = {
  confirmed: {
    label:  'Confirmed',
    dot:    '#34D399',
    bg:     'rgba(52, 211, 153, 0.1)',
    border: 'rgba(52, 211, 153, 0.3)',
    color:  '#34D399',
    glow:   'rgba(52, 211, 153, 0.2)',
    ping:   true,
  },
  pending: {
    label:  'Pending',
    dot:    '#FCD34D',
    bg:     'rgba(252, 211, 77, 0.1)',
    border: 'rgba(252, 211, 77, 0.3)',
    color:  '#FCD34D',
    glow:   'rgba(252, 211, 77, 0.2)',
    ping:   true,
  },
  rejected: {
    label:  'Rejected',
    dot:    '#F87171',
    bg:     'rgba(248, 113, 113, 0.1)',
    border: 'rgba(248, 113, 113, 0.3)',
    color:  '#F87171',
    glow:   null,
    ping:   false,
  },
  cancelled: {
    label:  'Cancelled',
    dot:    '#818CF8',
    bg:     'rgba(129, 140, 248, 0.1)',
    border: 'rgba(129, 140, 248, 0.25)',
    color:  '#818CF8',
    glow:   null,
    ping:   false,
  },
}

const normalize = (status = '') => {
  const s = status.toLowerCase().trim()
  if (s === 'approved') return 'confirmed'
  return CFG[s] ? s : 'confirmed'
}

export default function StatusBadge({ status, size = 'sm' }) {
  const key = normalize(status)
  const cfg = CFG[key]
  const pad = size === 'lg' ? 'text-sm px-4 py-1.5' : 'text-xs px-3 py-1'

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap ${pad}`}
      style={{
        background:  cfg.bg,
        border:      `1px solid ${cfg.border}`,
        color:       cfg.color,
        boxShadow:   cfg.glow ? `0 0 10px ${cfg.glow}` : 'none',
        fontFamily:  "'Space Grotesk', sans-serif",
      }}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {cfg.ping && (
          <span
            className="absolute inset-0 rounded-full opacity-80 animate-ping-uv"
            style={{ backgroundColor: cfg.dot }}
          />
        )}
        <span
          className="relative rounded-full w-2 h-2 flex-shrink-0"
          style={{ backgroundColor: cfg.dot }}
        />
      </span>
      {cfg.label}
    </motion.span>
  )
}
