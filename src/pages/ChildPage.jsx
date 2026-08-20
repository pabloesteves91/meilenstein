import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useChildren } from '../hooks/useChildren'
import { useEntries } from '../hooks/useEntries'
import { EntryCard } from '../components/EntryCard'
import { CATEGORIES } from '../lib/milestones'

export function ChildPage({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { children, removeChild } = useChildren(user)
  const { entries, loading, removeEntry } = useEntries(id, user)
  const [filter, setFilter] = useState('all')

  const child = children.find(c => c.id === id)
  const isOwner = child?.owner_id === user?.id

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => e.kategorie === filter)

  const handleDeleteChild = async () => {
    if (!confirm(`${child?.name} wirklich löschen?`)) return
    await removeChild(id)
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: '#fef8f1' }}>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md pb-md pt-14 px-container-margin shadow-soft">
        <div className="flex items-center gap-md mb-md">
          {/* Avatar */}
          <div
            className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary-container"
            style={{ boxShadow: '0 4px 12px rgba(116,89,63,0.15)' }}
          >
            {child?.foto_url ? (
              <img src={child.foto_url} alt={child.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container ms-fill text-2xl">child_care</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-display-lg font-display-lg text-primary leading-none">{child?.name || '…'}</h1>
            {child?.geburtsdatum && (
              <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">child_care</span>
                {(() => {
                  const birth = new Date(child.geburtsdatum)
                  const now = new Date()
                  const months = Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 30.44))
                  const years = Math.floor(months / 12)
                  const rem = months % 12
                  if (years === 0) return `${months} Monate alt`
                  if (rem === 0) return `${years} Jahre alt`
                  return `${years} J. ${rem} M. alt`
                })()}
              </p>
            )}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/child/${id}/invite`)}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition"
              title="Einladen"
            >
              <span className="material-symbols-outlined">group_add</span>
            </button>
            {isOwner && (
              <button
                onClick={handleDeleteChild}
                className="p-2 rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition"
                title="Kind löschen"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-sm overflow-x-auto scrollbar-hide pb-1 -mx-container-margin px-container-margin">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-label-sm font-label-sm transition shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] active:scale-95 ${
              filter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
            }`}
          >
            Alle
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-label-sm font-label-sm transition active:scale-95 ${
                filter === cat.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Timeline */}
      <main className="px-container-margin mt-lg max-w-lg mx-auto">
        {loading && (
          <div className="space-y-lg">
            {[1, 2, 3].map(i => (
              <div key={i} className="pl-16">
                <div className="h-24 bg-surface-container rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-primary-container ms-fill block mb-4">
              auto_stories
            </span>
            <p className="text-headline-sm font-headline-sm text-on-surface mb-1">Noch kein Meilenstein</p>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Halte den ersten besonderen Moment fest!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-lg">
          {filtered.map((entry, i) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              childBirthDate={child?.geburtsdatum}
              onDelete={removeEntry}
              canDelete={isOwner || entry.erstellt_von === user?.id}
              isLast={i === filtered.length - 1}
            />
          ))}
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => navigate(`/child/${id}/add-entry`)}
        className="fixed bottom-24 right-6 w-14 h-14 flex items-center justify-center rounded-2xl z-50 transition-transform active:scale-90 hover:-translate-y-1"
        style={{
          background: 'linear-gradient(135deg, #ffdab9, #ffdcbe)',
          boxShadow: '0 8px 24px rgba(255,218,185,0.6)',
        }}
        aria-label="Meilenstein hinzufügen"
      >
        <span className="material-symbols-outlined text-[32px] text-on-primary-container">add</span>
      </button>
    </div>
  )
}
