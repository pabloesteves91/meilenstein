import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeEmailLinkSignIn } from '../hooks/useAuth'

export function FinishLoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    completeEmailLinkSignIn()
      .then((user) => {
        if (user) {
          const pending = sessionStorage.getItem('pendingJoinCode')
          if (pending) {
            sessionStorage.removeItem('pendingJoinCode')
            navigate(`/join/${pending}`, { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        } else {
          navigate('/login', { replace: true })
        }
      })
      .catch((e) => setError(e.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-container-margin"
      style={{ background: '#fef8f1' }}
    >
      {error ? (
        <div className="text-center space-y-md">
          <span className="material-symbols-outlined text-5xl text-error block">error</span>
          <p className="text-body-md font-body-md text-error">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-label-sm font-label-sm text-primary hover:underline"
          >
            Zurück zum Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-md">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto animate-pulse">
            <span className="material-symbols-outlined text-3xl ms-fill text-on-primary-container">child_care</span>
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant">Einloggen…</p>
        </div>
      )}
    </div>
  )
}
