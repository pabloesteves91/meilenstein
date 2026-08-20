import { format, differenceInMonths, differenceInYears } from 'date-fns'
import { de } from 'date-fns/locale'
import { CategoryBadge } from './CategoryBadge'
import { SyncBadge } from './SyncBadge'

function formatAge(birthDate, eventDate) {
  const birth = new Date(birthDate)
  const event = new Date(eventDate)
  const years = differenceInYears(event, birth)
  const months = differenceInMonths(event, birth) % 12
  if (years === 0 && months === 0) return 'Neugeboren'
  if (years === 0) return `${months} Monat${months !== 1 ? 'e' : ''}`
  if (months === 0) return `${years} Jahr${years !== 1 ? 'e' : ''}`
  return `${years} Jahr${years !== 1 ? 'e' : ''} ${months} Monat${months !== 1 ? 'e' : ''}`
}

export function EntryCard({ entry, childBirthDate, onDelete, isOwner }) {
  const age = childBirthDate ? formatAge(childBirthDate, entry.datum) : null
  const dateStr = format(new Date(entry.datum), 'd. MMMM yyyy', { locale: de })

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{entry.titel}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <CategoryBadge id={entry.kategorie} />
            <SyncBadge status={entry.sync_status} />
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(entry.id)}
            className="text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
            aria-label="Löschen"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {entry.foto_url && (
        <img
          src={entry.foto_url}
          alt={entry.titel}
          className="w-full h-40 object-cover rounded-xl"
        />
      )}

      {entry.notiz && (
        <p className="text-gray-500 text-sm leading-relaxed">{entry.notiz}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
        <span>{dateStr}</span>
        {age && <span className="font-medium text-brand-500">{age}</span>}
      </div>
    </div>
  )
}
