import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import { CATEGORIES, MILESTONE_SUGGESTIONS } from '../lib/milestones'

export function AddEntryPage({ user }) {
  const { id: childId } = useParams()
  const navigate = useNavigate()
  const { addEntry } = useEntries(childId, user)

  const [form, setForm] = useState({
    titel: '',
    kategorie: 'motorisch',
    datum: new Date().toISOString().split('T')[0],
    notiz: '',
    foto_url: '',
  })
  const [saving, setSaving] = useState(false)
  const [customTitle, setCustomTitle] = useState(false)

  const suggestions = MILESTONE_SUGGESTIONS[form.kategorie] || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titel.trim()) return
    setSaving(true)
    await addEntry(form)
    navigate(`/child/${childId}`)
  }

  return (
    <div className="min-h-screen bg-cream pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Neuer Meilenstein</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 pt-5 space-y-5">
        {/* Kategorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setForm(f => ({ ...f, kategorie: cat.id, titel: '' })); setCustomTitle(false) }}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium transition border-2 ${
                  form.kategorie === cat.id
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Titel – Vorschläge */}
        {!customTitle && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meilenstein wählen</label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, titel: s }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                    form.titel === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setCustomTitle(true); setForm(f => ({ ...f, titel: '' })) }}
                className="px-3 py-1.5 rounded-full text-xs font-medium border-2 border-dashed border-gray-300 text-gray-500 hover:border-brand-400 hover:text-brand-600 transition"
              >
                + Eigener Titel
              </button>
            </div>
          </div>
        )}

        {customTitle && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Eigener Titel</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={form.titel}
                onChange={e => setForm(f => ({ ...f, titel: e.target.value }))}
                placeholder="Was ist passiert?"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setCustomTitle(false); setForm(f => ({ ...f, titel: '' })) }}
                className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-sm"
              >
                ←
              </button>
            </div>
          </div>
        )}

        {/* Datum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Datum</label>
          <input
            type="date"
            required
            value={form.datum}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setForm(f => ({ ...f, datum: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
          />
        </div>

        {/* Notiz */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notiz (optional)</label>
          <textarea
            value={form.notiz}
            onChange={e => setForm(f => ({ ...f, notiz: e.target.value }))}
            placeholder="Was war besonders an diesem Moment?"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm resize-none"
          />
        </div>

        {/* Foto URL (vereinfacht – kein Upload ohne Storage) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto-URL (optional)</label>
          <input
            type="url"
            value={form.foto_url}
            onChange={e => setForm(f => ({ ...f, foto_url: e.target.value }))}
            placeholder="https://…"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving || !form.titel.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
        >
          {saving ? 'Speichern…' : 'Meilenstein speichern ✨'}
        </button>
      </form>
    </div>
  )
}
