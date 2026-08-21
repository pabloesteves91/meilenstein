import { differenceInMonths, differenceInYears } from 'date-fns'

function computeAge(birthDate) {
  const birth = new Date(birthDate)
  const now = new Date()
  const years = differenceInYears(now, birth)
  const months = differenceInMonths(now, birth) % 12
  if (years === 0) return `${months} Monat${months !== 1 ? 'e' : ''} alt`
  if (months === 0) return `${years} Jahr${years !== 1 ? 'e' : ''} alt`
  return `${years} J. ${months} M. alt`
}

export function ChildCard({ child, onClick }) {
  const age = child.geburtsdatum ? computeAge(child.geburtsdatum) : ''
  const birthDate = child.geburtsdatum
    ? new Date(child.geburtsdatum).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <button
      onClick={onClick}
      className="w-full bg-surface-container-lowest rounded-xl p-md text-left hover:bg-surface-container-low transition-colors active:scale-[0.98] flex items-center gap-md"
      style={{ boxShadow: '0 8px 20px rgba(116,89,63,0.06)' }}
    >
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary-container"
        style={{ boxShadow: '0 4px 12px rgba(116,89,63,0.15)' }}
      >
        {child.foto_url ? (
          <img src={child.foto_url} alt={child.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container ms-fill text-2xl">child_care</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-headline-sm font-headline-sm text-primary truncate">{child.name}</p>
        {age && <p className="text-body-md font-body-md text-on-surface-variant mt-0.5">{age}</p>}
        {birthDate && <p className="text-caption font-caption text-outline mt-0.5">geb. {birthDate}</p>}
      </div>

      <span className="material-symbols-outlined text-outline shrink-0">chevron_right</span>
    </button>
  )
}
