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
      .insert({ id: crypto.randomUUID(), child_id: childId, code, erstellt_von: user.id, gueltig_bis: gueltigBis })
      .select().single()
    if (!error && data) setInvite(data)
    setLoading(false)
  }

  const link = invite ? `${window.location.origin}/join/${invite.code}` : null

  const copyLink = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fef8f1' }}>
      {/* Header */}
      <header className="bg-surface shadow-soft flex justify-between items-center w-full px-container-margin py-sm sticky top-0 z-50 pt-14">
        <button onClick={() => navigate(-1)} className="text-on-surface-variant p-1 hover:opacity-80 transition active:scale-95">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-headline-md font-headline-md text-primary">Meilenstein Teilen</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-container-margin pt-xl pb-28 flex flex-col gap-xl">
        {/* Subtitle */}
        <header className="text-center space-y-sm">
          <p className="text-body-md font-body-md text-on-surface-variant">
            Lade Familie und Freunde ein, an den Erinnerungen teilzuhaben.
          </p>
        </header>

        {/* Share Card */}
        <section className="bg-surface-container-lowest rounded-xl shadow-soft p-lg flex flex-col items-center text-center relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-32 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(255,218,185,0.3), transparent)' }}
          />
          <div className="z-10 w-full">
            <span className="material-symbols-outlined text-4xl text-primary ms-fill mb-md block">family_restroom</span>
            <h2 className="text-headline-sm font-headline-sm text-on-surface mb-xs">Dein Einladungscode</h2>
            <p className="text-body-md font-body-md text-on-surface-variant mb-lg">
              Teile diesen Code, um Zugriff zu gewähren.
            </p>

            {!invite ? (
              <button
                onClick={generateInvite}
                disabled={loading}
                className="py-md px-xl rounded-full text-label-sm font-label-sm text-on-primary-container shadow-soft hover:opacity-90 transition disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #74593f, #8a6a4c)' }}
              >
                <span className="text-on-primary">
                  {loading ? 'Generiere…' : 'Einladungslink generieren'}
                </span>
              </button>
            ) : (
              <>
                {/* Code display */}
                <div className="bg-surface-container-low rounded-full py-md px-xl mb-lg inline-block border-2 border-surface-variant">
                  <span className="text-display-lg font-display-lg tracking-widest text-primary">
                    {invite.code}
                  </span>
                </div>

                {/* Link */}
                <div className="flex items-center justify-center gap-sm bg-surface rounded-full p-sm px-md mb-lg">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">link</span>
                  <span className="text-body-md font-body-md text-primary truncate max-w-[220px]">{link}</span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-md w-full justify-center">
                  <button
                    onClick={copyLink}
                    className="flex-1 flex items-center justify-center gap-sm bg-surface-container-low hover:bg-surface-container-highest text-primary text-label-sm font-label-sm rounded-full py-md px-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">{copied ? 'check' : 'content_copy'}</span>
                    {copied ? 'Kopiert!' : 'Link kopieren'}
                  </button>
                  {navigator.share && (
                    <button
                      onClick={() => navigator.share({ title: 'Kindermeilensteine – Einladung', url: link })}
                      className="flex-1 flex items-center justify-center gap-sm text-on-primary text-label-sm font-label-sm rounded-full py-md px-xl shadow-soft hover:opacity-90 transition"
                      style={{ background: 'linear-gradient(135deg, #74593f, #8a6a4c)' }}
                    >
                      <span className="material-symbols-outlined text-xl">share</span>
                      Teilen
                    </button>
                  )}
                </div>
                <p className="text-caption font-caption text-outline mt-md">
                  Gültig bis: {new Date(invite.gueltig_bis).toLocaleDateString('de-DE')}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Info */}
        <section className="bg-secondary-container/30 rounded-xl p-md flex gap-sm">
          <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">info</span>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Eingeladene Personen können Meilensteine einsehen und hinzufügen, aber keine Kinderprofile löschen.
          </p>
        </section>
      </main>
    </div>
  )
}
