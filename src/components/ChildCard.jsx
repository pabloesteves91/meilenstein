import { differenceInMonths, differenceInYears, format } from 'date-fns'
import { de } from 'date-fns/locale'

function computeAge(birthDate) {
  const birth = new Date(birthDate)
  const now = new Date()
  const years = differenceInYears(now, birth)
  const months = differenceInMonths(now, birth) % 12
  if (years === 0) return `${months} Monat${months !== 1 ? 'e' : ''} alt`
  if (months === 0) return `${years} Jahr${years !== 1 ? 'e' : ''} alt`
  return `${years} J. ${months} M. alt`
}

const AVATAR_COLORS = [
  'from-violet-400 to-purple-500',
  'from-pink-400 to-rose-500',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
]

export function ChildCard({ child, index, onClick }) {
  const gradient = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const initial = child.name?.[0]?.toUpperCase() || '?'
  const age = child.geburtsdatum ? computeAge(child.geburtsdatum) : ''
  const birthStr = child.geburtsdatum
    ? format(new Date(child.geburtsdatum), 'd. MMMM yyyy', { locale: de })
    : ''

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-card p-5 text-left hover:shadow-card-hover transition-all active:scale-[0.98] flex items-center gap-4"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold shrink-0 overflow-hidden`}>
        {child.foto_url
          ? <img src={child.foto_url} alt={child.name} className="w-full h-full object-cover" />
          : initial
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-base truncate">{child.name}</p>
        {age && <p className="text-brand-600 text-sm font-medium mt-0.5">{age}</p>}
        {birthStr && <p className="text-gray-400 text-xs mt-0.5">geb. {birthStr}</p>}
      </div>
      <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
