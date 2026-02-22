import { motion } from 'framer-motion'

const page = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:    { opacity: 0,       transition: { duration: 0.2 } },
}

const CONTACTS = [
  { icon: '🏛️', title: 'Facilities Office', lines: ['Main Block, Room 101', 'Mon–Fri: 8am – 5pm'],              color: '#A855F7' },
  { icon: '📧', title: 'Email Support',     lines: ['facilities@campus.edu.gh', 'Reply within 24 hrs'],         color: '#E879F9' },
  { icon: '📞', title: 'Phone',             lines: ['+233 30 290 1234', 'Emergency: +233 30 290 9999'],          color: '#818CF8' },
  { icon: '📍', title: 'Location',          lines: ['University of Ghana, Legon', 'Accra, Ghana'],              color: '#34D399' },
]

const FAQ = [
  { q: 'How far in advance can I book?',          a: 'Up to 30 days from today. The date picker enforces this automatically.' },
  { q: 'What is the minimum booking duration?',   a: 'All bookings are exactly 30 minutes. You cannot book a partial slot.' },
  { q: 'Why does a slot show as booked?',         a: 'The backend detects time-overlap conflicts in real time. Choose a different slot or date.' },
  { q: 'How do I cancel a booking?',              a: 'Go to Booking History and click the Cancel button next to your reservation.' },
  { q: 'Can I book on behalf of another student?', a: 'No. Each booking must be made under your own student account.' },
]

export default function Contact() {
  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit" className="pt-24 pb-20">
      <div className="uv-section">

        {/* Header */}
        <div className="mb-14">
          <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: 'var(--c-section-lbl)' }}>Support</span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get in <span className="uv-gradient-text">Touch</span>
          </h1>
          <p className="max-w-lg text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Need help? Reach the Facilities Office or browse the FAQ below.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {CONTACTS.map((c, i) => (
            <motion.div key={c.title}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
              className="uv-glass p-6"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: `${c.color}15`, border: `1px solid ${c.color}35`, boxShadow: `0 0 14px ${c.color}18` }}>
                {c.icon}
              </div>
              <h3 className="font-bold mb-2 text-sm" style={{ color: 'var(--text)' }}>{c.title}</h3>
              {c.lines.map(l => (
                <p key={l} className="text-sm" style={{ color: 'var(--text-dim)' }}>{l}</p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="uv-glass p-5"
              >
                <h4 className="font-bold mb-2 text-sm flex items-start gap-3" style={{ color: 'var(--text)' }}>
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: 'rgba(168,85,247,0.2)', color: '#C084FC' }}>Q</span>
                  {item.q}
                </h4>
                <p className="text-sm leading-relaxed pl-8" style={{ color: 'var(--text-muted)' }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  )
}
