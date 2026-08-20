import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function InvitePage({ user }) {
  const { id: childId } = useParams()
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateInvite = async () => {
    setLoading(true)
    const code = Math.random().toString(36).slice(2, 10).toUpperCase()
    const gueltigBis = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('invites')
      .insert({
        id: crypto.randomUUID(),
        child_id: childId,
        code,
        erstellt_von: user.id,
        gueltig_bis: gueltigBis,
      })
      .select()
      .single()

    if (!error && data) {
      setInvite(data)
    }
    setLoading(false)
  }

  const link = invite
    ? `${window.location.origin}/join/${invite.code}`
    : null

  const copyLink = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-gray-100 px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-gray-50 transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Einladen</h1>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-5">
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Partner oder Großeltern einladen</h2>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            Generiere einen Einladungslink und teile ihn. Die Person kann nach dem Einloggen Meilensteine einsehen und hinzufügen.
          </p>

          {!invite ? (
            <button
              onClick={generateInvite}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:opacity-60"
            >
              {loading ? 'Generiere…' : 'Einladungslink generieren'}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-brand-50 rounded-xl p-4">
                <p className="text-xs text-brand-600 font-medium mb-1">Einladungslink</p>
                <p className="text-sm text-brand-900 break-all font-mono">{link}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                >
                  {copied ? '✓ Kopiert!' : 'Link kopieren'}
                </button>
                <button
                  onClick={() => navigator.share?.({ title: 'Kindermeilensteine – Einladung', url: link })}
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition"
                >
                  Teilen
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Gültig bis: {new Date(invite.gueltig_bis).toLocaleDateString('de-DE')}
              </p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 rounded-2xl p-4">
          <p className="text-amber-700 text-sm">
            <strong>Hinweis:</strong> Der Link ist 7 Tage gültig. Die eingeladene Person erhält Lesezugriff und kann Einträge hinzufügen, aber keine Kinderprofile löschen.
          </p>
        </div>
      </div>
    </div>
  )
}
