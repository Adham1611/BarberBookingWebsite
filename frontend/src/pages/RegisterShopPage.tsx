import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

// Auto-generate slug from shop name
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function RegisterShopPage() {
  const { registerOwner, isAuthenticated, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [step, setStep] = useState<'account' | 'shop'>(
    isAuthenticated && user?.role === 'owner' ? 'shop' : 'account'
  );

  // Account fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Shop fields
  const [shopName, setShopName] = useState('');
  const [shopSlug, setShopSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShopNameChange = (val: string) => {
    setShopName(val);
    if (!slugEdited) setShopSlug(toSlug(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerOwner({ name, email, password, phone, shopName, shopSlug });
      navigate('/owner-dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container auth-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>
          {isRTL ? '→' : '←'}
        </button>
        <h1 className="top-bar-title">
          {isRTL ? 'تسجيل صالون جديد' : 'Register Your Shop'}
        </h1>
        <div />
      </header>

      {/* Step indicator */}
      <div className="step-indicator">
        <div className={`step ${step === 'account' ? 'active' : 'done'}`}>
          {isRTL ? 'الحساب' : 'Account'}
        </div>
        <div className="step-divider" />
        <div className={`step ${step === 'shop' ? 'active' : step === 'account' ? '' : 'done'}`}>
          {isRTL ? 'الصالون' : 'Shop'}
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="error-banner">{error}</div>}

        {step === 'account' && (
          <>
            <h2 className="form-section-title">
              {isRTL ? 'بيانات حسابك' : 'Your Account Info'}
            </h2>
            <div className="form-group">
              <label>{isRTL ? 'الاسم الكامل' : 'Full Name'}</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isRTL ? 'كلمة المرور' : 'Password'}</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>{isRTL ? 'رقم الهاتف' : 'Phone (optional)'}</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => { if (name && email && password) setStep('shop'); }}
            >
              {isRTL ? 'التالي →' : 'Next →'}
            </button>
          </>
        )}

        {step === 'shop' && (
          <>
            <h2 className="form-section-title">
              {isRTL ? 'بيانات الصالون' : 'Your Shop Info'}
            </h2>
            <div className="form-group">
              <label>{isRTL ? 'اسم الصالون' : 'Shop Name'}</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={e => handleShopNameChange(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{isRTL ? 'الرابط المخصص' : 'Custom URL'}</label>
              <div className="slug-input-wrapper">
                <span className="slug-prefix">barbershop.app/</span>
                <input
                  type="text"
                  required
                  pattern="[a-z0-9\-]+"
                  value={shopSlug}
                  onChange={e => { setShopSlug(e.target.value); setSlugEdited(true); }}
                />
              </div>
              <p className="input-hint">
                {isRTL ? 'فقط أحرف إنجليزية صغيرة وأرقام وشرطات' : 'Only lowercase letters, numbers, hyphens'}
              </p>
            </div>

            <div className="plan-info-box">
              <h4>{isRTL ? '🎉 تبدأ مجانًا!' : '🎉 Start Free!'}</h4>
              <ul>
                <li>{isRTL ? 'حلاق واحد' : '1 barber'}</li>
                <li>{isRTL ? '3 خدمات' : '3 services'}</li>
                <li>{isRTL ? '30 حجز شهريًا' : '30 bookings/month'}</li>
                <li>{isRTL ? 'ترقية في أي وقت' : 'Upgrade anytime'}</li>
              </ul>
            </div>

            <div className="btn-row">
              <button type="button" className="btn-ghost" onClick={() => setStep('account')}>
                {isRTL ? '← رجوع' : '← Back'}
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '...' : isRTL ? 'إنشاء الصالون' : 'Create Shop'}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="auth-switch">
        {isRTL ? 'لديك حساب؟ ' : 'Already have an account? '}
        <button className="link-btn" onClick={() => navigate('/auth')}>
          {isRTL ? 'سجل الدخول' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
