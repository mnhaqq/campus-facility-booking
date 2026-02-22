import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFetch } from '../hooks/useFetch'
import facilityService from '../services/facilityService'
import FacilityCard from '../components/FacilityCard'
import { FacilityGridSkeleton } from '../components/Loader'

const page = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:    { opacity: 0,       transition: { duration: 0.2 } },
}

const inp = {
  fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.875rem',
  color: 'var(--text)', background: 'rgba(168,85,247,0.06)',
  border: '1px solid rgba(168,85,247,0.22)', outline: 'none',
  borderRadius: '0.75rem', padding: '0.75rem 1rem', width: '100%',
  transition: 'border-color .2s ease, box-shadow .2s ease',
  appearance: 'none', WebkitAppearance: 'none',
}

export default function Facilities() {
  const { data, loading, error, refetch } = useFetch(() => facilityService.getAll())
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('name')

  const list = (data ?? [])
    .filter(f =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.location?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'capacity' ? b.capacity - a.capacity
      : sort === 'id'     ? a.id - b.id
      : a.name.localeCompare(b.name)
    )

  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" className="pt-24 pb-20">
      <div className="uv-section">

        {/* Header */}
        <div className="mb-12">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: 'var(--c-section-lbl)' }}>
            Campus Resources
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl font-bold mb-4">
            All <span className="uv-gradient-text">Facilities</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Browse every available campus space. Click any card to check availability and make a reservation.
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-dim)' }}>
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search name or location…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inp, paddingLeft: '2.5rem' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.22)'; e.target.style.boxShadow = 'none' }}
            />
          </div>
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ ...inp, width: 'auto', minWidth: '11rem', paddingRight: '2.5rem', cursor: 'pointer' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.6)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.22)' }}
          >
            <option value="name"     style={{ background: 'var(--c-dropdown-bg)' }}>Sort: Name A–Z</option>
            <option value="capacity" style={{ background: 'var(--c-dropdown-bg)' }}>Sort: Capacity ↓</option>
            <option value="id"       style={{ background: 'var(--c-dropdown-bg)' }}>Sort: ID ↑</option>
          </select>
          {/* Refresh */}
          <button onClick={refetch} className="uv-btn-ghost py-3 px-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </motion.div>

        {/* Count */}
        {!loading && !error && (
          <p className="text-xs mb-6" style={{ color: 'var(--text-faint)' }}>
            {list.length} {list.length === 1 ? 'facility' : 'facilities'}
            {search ? ` matching "${search}"` : ' available'}
          </p>
        )}

        {loading && <FacilityGridSkeleton count={6} />}

        {!loading && error && (
          <div className="uv-glass p-8 text-center"
            style={{ borderColor: 'rgba(248,113,113,0.25)', boxShadow: '0 0 24px rgba(248,113,113,0.08)' }}>
            <div className="text-3xl mb-3">⚠️</div>
            <p className="font-semibold mb-1 text-sm" style={{ color: '#F87171' }}>Unable to load facilities</p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
              Please check your connection or try again later.
            </p>
            <button onClick={refetch} className="uv-btn-ghost text-sm">Try Again</button>
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4 opacity-25">🏗️</div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>No facilities found</p>
            <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
              {search ? 'Try a different search term.' : 'Run your Laravel seeders to add facilities.'}
            </p>
          </motion.div>
        )}

        {!loading && !error && list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((f, i) => <FacilityCard key={f.id} facility={f} index={i} />)}
          </div>
        )}
      </div>
    </motion.div>
  )
}
