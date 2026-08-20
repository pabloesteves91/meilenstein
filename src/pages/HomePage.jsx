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
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <p className="text-gray-400 text-sm">Willkommen zurück 👋</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">Deine Kinder</h1>
      </div>

      <div className="px-5 space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && children.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-gray-500 font-medium mb-1">Noch kein Kind angelegt</p>
            <p className="text-gray-400 text-sm">Füge dein erstes Kind hinzu, um zu beginnen.</p>
          </div>
        )}

        {!loading && children.map((child, i) => (
          <ChildCard
            key={child.id}
            child={child}
            index={i}
            onClick={() => navigate(`/child/${child.id}`)}
          />
        ))}

        {/* Add child form */}
        {showForm && (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl shadow-card p-5 space-y-4"
          >
            <h2 className="font-semibold text-gray-900">Kind hinzufügen</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="z.B. Lena"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Geburtsdatum</label>
              <input
                type="date"
                required
                value={form.geburtsdatum}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, geburtsdatum: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-60"
              >
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
            </div>
          </form>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-brand-200 text-brand-600 font-medium text-sm hover:border-brand-400 hover:bg-brand-50 transition flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            Kind hinzufügen
          </button>
        )}
      </div>
    </div>
  )
}
