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
    <div className="min-h-screen pb-10" style={{ background: '#fef8f1' }}>
      {/* Top App Bar */}
      <header className="bg-surface shadow-soft flex justify-between items-center w-full px-container-margin py-sm sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 p-1"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-headline-md font-headline-md text-primary">Neuer Meilenstein</h1>
        <div className="w-8" />
      </header>

      <form onSubmit={handleSubmit} className="px-container-margin py-lg space-y-xl max-w-md mx-auto pb-32">

        {/* Kategorie */}
        <section className="space-y-sm">
          <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1">Kategorie</label>
          <div className="grid grid-cols-2 gap-sm">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setForm(f => ({ ...f, kategorie: cat.id, titel: '' })); setCustomTitle(false) }}
                className={`py-3 px-4 rounded-lg text-label-sm font-label-sm transition border-2 flex items-center gap-sm ${
                  form.kategorie === cat.id
                    ? 'border-primary-container bg-primary-container/40 text-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${form.kategorie === cat.id ? 'ms-fill' : ''}`}>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Titel */}
        <section className="space-y-sm">
          <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1">Titel</label>

          {!customTitle ? (
            <>
              <input
                type="text"
                readOnly
                value={form.titel}
                placeholder="Meilenstein auswählen oder eingeben…"
                onClick={() => setCustomTitle(true)}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-lg font-body-lg focus:outline-none focus:border-primary-container transition-all soft-shadow cursor-pointer text-on-surface placeholder:text-outline"
              />
              <div className="flex flex-wrap gap-sm pt-1">
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, titel: s }))}
                    className={`px-3 py-1.5 rounded-full text-caption font-caption transition ${
                      form.titel === s
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-variant text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setCustomTitle(true); setForm(f => ({ ...f, titel: '' })) }}
                  className="px-3 py-1.5 rounded-full text-caption font-caption border-2 border-dashed border-outline-variant text-outline hover:border-primary hover:text-primary transition"
                >
                  + Eigener Titel
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-sm">
              <input
                type="text"
                required
                value={form.titel}
                onChange={e => setForm(f => ({ ...f, titel: e.target.value }))}
                placeholder="Worum geht es?"
                className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-lg font-body-lg focus:outline-none focus:border-primary-container transition-all text-on-surface"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setCustomTitle(false); setForm(f => ({ ...f, titel: '' })) }}
                className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition"
              >
                ← Vorschläge anzeigen
              </button>
            </div>
          )}
        </section>

        {/* Foto */}
        <section>
          <div className="border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors relative overflow-hidden group">
            {form.foto_url ? (
              <>
                <img src={form.foto_url} alt="Vorschau" className="absolute inset-0 w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, foto_url: '' }))}
                  className="absolute top-2 right-2 bg-inverse-surface text-inverse-on-surface rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                <span className="material-symbols-outlined text-primary text-4xl mb-2 ms-fill group-hover:scale-110 transition-transform">photo_camera</span>
                <p className="text-label-sm font-label-sm text-primary">Foto hinzufügen</p>
                <input
                  type="url"
                  value={form.foto_url}
                  onChange={e => setForm(f => ({ ...f, foto_url: e.target.value }))}
                  placeholder="Foto-URL eingeben"
                  className="mt-3 mx-8 w-[calc(100%-64px)] bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-caption font-caption text-on-surface text-center focus:outline-none focus:border-primary-container transition"
                  onClick={e => e.stopPropagation()}
                />
              </label>
            )}
          </div>
        </section>

        {/* Kategorie & Datum */}
        <section className="grid grid-cols-2 gap-md">
          <div className="space-y-sm">
            <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1">Datum</label>
            <input
              type="date"
              required
              value={form.datum}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setForm(f => ({ ...f, datum: e.target.value }))}
              className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:outline-none focus:border-primary-container transition text-on-surface"
            />
          </div>
        </section>

        {/* Notiz */}
        <section className="space-y-sm">
          <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1">Notizen (Optional)</label>
          <textarea
            value={form.notiz}
            onChange={e => setForm(f => ({ ...f, notiz: e.target.value }))}
            placeholder="Besondere Erinnerungen an diesen Moment…"
            rows={4}
            className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-md font-body-md focus:outline-none focus:border-primary-container transition-all resize-none text-on-surface placeholder:text-outline"
          />
        </section>
      </form>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 w-full p-container-margin pb-lg z-40"
           style={{ background: 'linear-gradient(to top, #fef8f1 60%, transparent)' }}>
        <button
          onClick={handleSubmit}
          disabled={saving || !form.titel.trim()}
          className="w-full max-w-md mx-auto block py-4 rounded-full text-headline-sm font-headline-sm text-on-primary-container shadow-soft hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-sm"
          style={{ background: 'linear-gradient(135deg, #ffdab9, #ffdcbe)' }}
        >
          <span className="material-symbols-outlined ms-fill">favorite</span>
          {saving ? 'Speichern…' : 'Meilenstein speichern'}
        </button>
      </div>
    </div>
  )
}
