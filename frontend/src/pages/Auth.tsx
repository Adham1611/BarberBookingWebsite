import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import GoogleIcon from '../components/Icons/GoogleIcon';
import AppleIcon from '../components/Icons/AppleIcon';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, loginWithGoogle, loginWithApple } = useAuth();
  const { t } = useLanguage();

  const mode = searchParams.get('mode') || 'login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/home');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      await loginWithApple();
      navigate('/home');
    } catch (error) {
      console.error('Apple login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Barber Pro</h1>
          <p className="text-gray-400">
            {isSignup ? t('auth.createAccount') : t('auth.welcomeBack')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {isSignup && (
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                {t('auth.fullName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? t('common.loading') : isSignup ? t('auth.signUp') : t('auth.login')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">{t('auth.orContinueWith')}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <GoogleIcon />
            {t('auth.continueWithGoogle')}
          </button>
          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <AppleIcon />
            {t('auth.continueWithApple')}
          </button>
        </div>

        <p className="text-center text-gray-400">
          {isSignup ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}{' '}
          <button
            onClick={() =>
              navigate(`/auth?mode=${isSignup ? 'login' : 'signup'}`)
            }
            className="text-gold hover:text-yellow-500 font-semibold"
          >
            {isSignup ? t('auth.login') : t('auth.signUp')}
          </button>
        </p>

        <button
          onClick={() => navigate('/welcome')}
          className="mt-6 w-full py-2 text-gray-400 hover:text-white transition-colors"
        >
          {t('auth.backToWelcome')}
        </button>
      </div>
    </div>
  );
}