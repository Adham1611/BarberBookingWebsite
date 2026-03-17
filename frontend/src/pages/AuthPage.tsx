import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const t = useTranslation();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(email, password) as any;
        const role = user?.role ?? JSON.parse(localStorage.getItem('user') ?? '{}').role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'owner') navigate('/owner-dashboard');
        else navigate('/home');
      } else {
        await register({ name, email, password });
        navigate('/home');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fullscreen-center auth-bg">
      <section className="auth-card">
        <h1>{mode === 'login' ? t('auth', 'loginButton') : 'Create account'}</h1>
        <p>
          {mode === 'login'
            ? 'تسجيل الدخول لإدارة الحجوزات • Sign in to manage bookings'
            : 'إنشاء حساب جديد • Create a new customer account'}
        </p>

        {error && (
          <div className="error-banner" role="alert">{error}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input
              label="Full name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          )}
          <Input
            label={t('auth', 'email')}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t('auth', 'password')}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" full disabled={loading}>
            {loading ? 'Please wait…' : (mode === 'login' ? t('auth', 'loginButton') : 'Create account')}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button className="btn-ghost" onClick={() => setMode('register')}>Sign up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button className="btn-ghost" onClick={() => setMode('login')}>Sign in</button>
            </>
          )}
        </p>

        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem' }}>
          <button
            className="btn-ghost"
            onClick={() => navigate('/register-shop')}
            style={{ color: 'var(--gold)' }}
          >
            🏪 Register your barber shop
          </button>
        </div>
      </section>
    </main>
  );
}
