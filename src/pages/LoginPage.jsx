import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signInWithMagicLink(email)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      {/* Logo / hero */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
          ⭐
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kindermeilensteine</h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          Halte die schönsten Momente deines Kindes fest – für immer.
        </p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-6">
        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="font-semibold text-gray-900 mb-2">Schau in dein Postfach!</h2>
            <p className="text-gray-500 text-sm">
              Wir haben einen Magic-Link an <strong>{email}</strong> gesendet. Klick darauf, um dich einzuloggen.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-brand-600 text-sm font-medium"
            >
              Andere E-Mail verwenden
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition text-gray-900 text-sm"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-60"
            >
              {loading ? 'Sende Link…' : 'Magic Link senden ✨'}
            </button>
          </form>
        )}
      </div>
      <p className="text-gray-400 text-xs mt-6 text-center max-w-xs">
        Kein Passwort nötig. Du erhältst einen sicheren Login-Link per E-Mail.
      </p>
    </div>
  )
}
