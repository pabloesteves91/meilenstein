import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function JoinPage({ user }) {
  const { code } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      // Store code in sessionStorage so we can use it after login
      sessionStorage.setItem('pendingJoinCode', code)
      navigate('/login')
      return
    }
    joinWithCode()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, code])

  const joinWithCode = async () => {
    setStatus('loading')

    // Find invite
    const { data: invite, error: invErr } = await supabase
      .from('invites')
      .select('*')
      .eq('code', code)
      .gt('gueltig_bis', new Date().toISOString())
      .single()

    if (invErr || !invite) {
      setError('Einladungslink ungültig oder abgelaufen.')
      setStatus('error')
      return
    }

    // Check if already member
    const { data: existing } = await supabase
      .from('child_members')
      .select('id')
      .eq('child_id', invite.child_id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      const { error: memberErr } = await supabase
        .from('child_members')
        .insert({ id: crypto.randomUUID(), child_id: invite.child_id, user_id: user.id, rolle: 'member' })

      if (memberErr) {
        setError('Beitritt fehlgeschlagen: ' + memberErr.message)
        setStatus('error')
        return
      }
    }

    setStatus('success')
    setTimeout(() => navigate(`/child/${invite.child_id}`), 1500)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4 animate-spin">⭐</div>
            <p className="text-gray-600 font-medium">Einladung wird verarbeitet…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-bold text-gray-900 text-xl mb-2">Willkommen!</h2>
            <p className="text-gray-500 text-sm">Du wirst weitergeleitet…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">😕</div>
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="text-brand-600 font-medium"
            >
              Zurück zur Startseite
            </button>
          </>
        )}
      </div>
    </div>
  )
}
