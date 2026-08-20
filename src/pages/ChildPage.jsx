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
  const { entries, loading, addEntry, removeEntry } = useEntries(id, user)
  const [filter, setFilter] = useState('all')
  const [showAddEntry, setShowAddEntry] = useState(false)

  const child = children.find(c => c.id === id)
  const isOwner = child?.owner_id === user?.id

  if (!child && !loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Kind nicht gefunden</p>
          <button onClick={() => navigate('/')} className="text-brand-600 font-medium">Zurück</button>
        </div>
      </div>
    )
  }

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => e.kategorie === filter)

  const handleDeleteChild = async () => {
    if (!confirm(`${child?.name} und alle Einträge löschen?`)) return
    await removeChild(id)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{child?.name || '…'}</h1>
            {child?.geburtsdatum && (
              <p className="text-gray-400 text-xs mt-0.5">
                geb. {new Date(child.geburtsdatum).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/child/${id}/invite`)}
              className="p-2 rounded-xl hover:bg-gray-50 transition text-gray-500"
              title="Einladen"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </button>
            {isOwner && (
              <button
                onClick={handleDeleteChild}
                className="p-2 rounded-xl hover:bg-red-50 transition text-gray-400 hover:text-red-500"
                title="Kind löschen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Alle
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="px-5 pt-4 space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-gray-500 font-medium mb-1">Noch kein Meilenstein</p>
            <p className="text-gray-400 text-sm">Halte den ersten besonderen Moment fest!</p>
          </div>
        )}

        {filtered.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            childBirthDate={child?.geburtsdatum}
            onDelete={removeEntry}
            isOwner={isOwner || entry.erstellt_von === user?.id}
          />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate(`/child/${id}/add-entry`)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center text-2xl"
        aria-label="Meilenstein hinzufügen"
      >
        +
      </button>
    </div>
  )
}
