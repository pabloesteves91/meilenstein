import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildren } from '../hooks/useChildren'
import { ChildCard } from '../components/ChildCard'

export function HomePage({ user }) {
  const navigate = useNavigate()
  const { children, loading, addChild } = useChildren(user)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', geburtsdatum: '' })
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    await addChild(form)
    setForm({ name: '', geburtsdatum: '' })
    setShowForm(false)
    setSaving(false)
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: '#fef8f1' }}>
      {/* Header */}
      <div className="px-container-margin pt-14 pb-lg">
        <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">waving_hand</span>
          Willkommen zurück
        </p>
        <h1 className="text-display-lg font-display-lg text-primary mt-1">Deine Kinder</h1>
      </div>

      <div className="px-container-margin space-y-sm">
        {loading && (
          <div className="space-y-sm">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-surface-container rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && children.length === 0 && !showForm && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-primary-container ms-fill block mb-4">baby_changing_station</span>
            <p className="text-headline-sm font-headline-sm text-on-surface mb-1">Noch kein Kind angelegt</p>
            <p className="text-body-md font-body-md text-on-surface-variant">Füge dein erstes Kind hinzu!</p>
          </div>
        )}

        {!loading && children.map(child => (
          <ChildCard
            key={child.id}
            child={child}
            onClick={() => navigate(`/child/${child.id}`)}
          />
        ))}

        {/* Add child form */}
        {showForm && (
          <form
            onSubmit={handleAdd}
            className="bg-surface-container-lowest rounded-xl shadow-soft p-md space-y-md"
          >
            <h2 className="text-headline-sm font-headline-sm text-on-surface">Kind hinzufügen</h2>
            <div>
              <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1 mb-sm">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="z.B. Lena"
                className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:outline-none focus:border-primary-container transition-all text-on-surface"
              />
            </div>
            <div>
              <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1 mb-sm">Geburtsdatum</label>
              <input
                type="date"
                required
                value={form.geburtsdatum}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, geburtsdatum: e.target.value }))}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:outline-none focus:border-primary-container transition-all text-on-surface"
              />
            </div>
            <div className="flex gap-sm">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-full border-2 border-outline-variant text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container transition"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-full text-label-sm font-label-sm text-on-primary-container shadow-soft hover:opacity-90 transition disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #ffdab9, #ffdcbe)' }}
              >
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
            </div>
          </form>
        )}

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-xl border-2 border-dashed border-outline-variant text-label-sm font-label-sm text-on-surface-variant hover:border-primary-container hover:text-primary hover:bg-surface-container-low transition flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Kind hinzufügen
          </button>
        )}
      </div>
    </div>
  )
}
