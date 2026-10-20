'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from './actions';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginAdmin(password);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error || 'Invalid password.');
      setLoading(false);
    }
  };

  return (
    <main id="main" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%', background: '#fff', border: '1px solid var(--line)', borderRadius: '1.4rem', padding: '2.5rem', boxShadow: 'var(--shadow)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/images/logo-mark.png" alt="Cocoqube" width={48} height={48} style={{ borderRadius: '50%', background: '#063923', padding: '4px', marginBottom: '.8rem' }} />
          <h1 style={{ fontSize: '1.75rem', margin: '0 0 .4rem' }}>Cocoqube Admin</h1>
          <p className="fine" style={{ margin: 0 }}>Sign in to manage blog publications and Supabase data</p>
        </div>

        {error && (
          <div style={{ padding: '.8rem 1rem', background: '#ffebe9', border: '1px solid #ff8182', borderRadius: '.7rem', color: '#c5221f', fontSize: '.88rem', marginBottom: '1.2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field" style={{ marginBottom: '1.4rem' }}>
            <label htmlFor="admin-pass">Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password (default: cocoqube2026)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                style={{ paddingRight: '3.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.6rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  fontSize: '.82rem',
                  fontWeight: 600,
                  color: 'var(--forest)',
                  padding: '.3rem',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="button primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign into Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '.82rem', color: 'var(--muted)' }}>
          Default password is <code>cocoqube2026</code> (configured via <code>ADMIN_PASSWORD</code>).
        </div>
      </div>
    </main>
  );
}
