import { format, differenceInMonths, differenceInYears } from 'date-fns'
import { de } from 'date-fns/locale'
import { getCategoryInfo } from '../lib/milestones'
import { SyncDot } from './SyncBadge'

function formatAge(birthDate, eventDate) {
  const birth = new Date(birthDate)
  const event = new Date(eventDate)
  const years = differenceInYears(event, birth)
  const months = differenceInMonths(event, birth) % 12
  if (years === 0 && months === 0) return 'Neugeboren'
  if (years === 0) return `${months} Monat${months !== 1 ? 'e' : ''}`
  if (months === 0) return `${years} Jahr${years !== 1 ? 'e' : ''}`
  return `${years} J. ${months} M.`
}

export function EntryCard({ entry, childBirthDate, onDelete, canDelete, isLast }) {
  const cat = getCategoryInfo(entry.kategorie)
  const age = childBirthDate ? formatAge(childBirthDate, entry.datum) : null
  const dateStr = format(new Date(entry.datum), 'd. MMM yyyy', { locale: de })

  return (
    <article className={`timeline-card relative pl-16 ${isLast ? 'last' : ''}`}>
      {/* Timeline node */}
      <div
        className={`absolute left-0 top-0 w-12 h-12 rounded-full ${cat.nodeBg} flex items-center justify-center z-10 border-4 border-background`}
        style={{ boxShadow: '0 4px 12px rgba(116,89,63,0.10)' }}
      >
        <span className="material-symbols-outlined text-[20px] ms-fill" style={{ color: 'inherit' }}>
          {cat.icon}
        </span>
      </div>

      {/* Card */}
      <div className="bg-surface-container-lowest rounded-DEFAULT p-md shadow-soft relative overflow-hidden ml-2">
        <SyncDot status={entry.sync_status} />

        <h2 className={`text-headline-sm font-headline-sm ${cat.titleColor} mb-xs pr-6`}>
          {entry.titel}
        </h2>

        <div className="flex items-center gap-2 mb-sm text-on-surface-variant">
          <span className="text-label-sm font-label-sm bg-surface-variant px-2 py-1 rounded-sm">
            {dateStr}
          </span>
          {age && (
            <span className="text-caption font-caption">• {age} alt</span>
          )}
        </div>

        {entry.foto_url && (
          <div className="mt-sm flex gap-sm">
            <div className="w-24 h-24 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
              <img src={entry.foto_url} alt={entry.titel} className="w-full h-full object-cover" />
            </div>
            {entry.notiz && (
              <p className="text-body-md font-body-md text-on-surface flex-1 line-clamp-3">{entry.notiz}</p>
            )}
          </div>
        )}

        {!entry.foto_url && entry.notiz && (
          <p className="text-body-md font-body-md text-on-surface mb-sm">{entry.notiz}</p>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete(entry.id)}
            className="absolute top-md right-md w-6 h-6 flex items-center justify-center text-outline hover:text-error transition-colors rounded-full hover:bg-error-container"
            aria-label="Löschen"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        )}
      </div>
    </article>
  )
}
