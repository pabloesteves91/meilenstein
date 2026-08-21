import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { sendMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await sendMagicLink(email)
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-container-margin relative overflow-hidden"
      style={{ background: '#fef8f1' }}
    >
      <div
        className="absolute top-0 left-0 w-full h-64 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #ffdab9 0%, #bbebf1 100%)', opacity: 0.18 }}
      />

      <div className="z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 rounded-xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ffdab9, #ffdcbe)', boxShadow: '0 8px 24px rgba(116,89,63,0.18)' }}
          >
            <span className="material-symbols-outlined text-5xl ms-fill text-on-primary-container">child_care</span>
          </div>
          <h1 className="text-display-lg font-display-lg text-primary mb-2">Meilensteine</h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-xs mx-auto">
            Halte die schönsten Momente deines Kindes für immer fest.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-lg shadow-soft">
          {sent ? (
            <div className="text-center py-4 space-y-3">
              <span className="material-symbols-outlined text-5xl text-secondary ms-fill block">mark_email_read</span>
              <h2 className="text-headline-sm font-headline-sm text-on-surface">Schau in dein Postfach!</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Wir haben einen Magic-Link an{' '}
                <strong className="text-primary">{email}</strong> gesendet. Klick darauf zum Einloggen.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-label-sm font-label-sm text-primary hover:underline underline-offset-2"
              >
                Andere E-Mail verwenden
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant block ml-1 mb-sm">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant rounded-lg px-4 py-3 text-body-lg font-body-lg focus:outline-none focus:border-primary-container transition-all text-on-surface placeholder:text-outline"
                />
              </div>
              {error && (
                <p className="text-caption font-caption text-error bg-error-container px-3 py-2 rounded-lg">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full text-headline-sm font-headline-sm text-on-primary-container shadow-soft hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-sm"
                style={{ background: 'linear-gradient(135deg, #ffdab9, #ffdcbe)' }}
              >
                <span className="material-symbols-outlined ms-fill">send</span>
                {loading ? 'Sende Link…' : 'Magic Link senden'}
              </button>
            </form>
          )}
        </div>

        <p className="text-caption font-caption text-outline text-center mt-md px-4">
          Kein Passwort nötig. Du erhältst einen sicheren Einmal-Link per E-Mail.
        </p>
      </div>
    </div>
  )
}
