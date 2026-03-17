import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useTranslation } from '../context/LanguageContext';

export default function WelcomePage() {
  const navigate = useNavigate();
  const t = useTranslation();

  return (
    <main className="welcome-page">
      <section className="welcome-hero">
        <div className="overlay" />
        <div className="welcome-content">
          <p className="eyebrow">Premium Booking Experience</p>
          <h1>{t('welcome', 'headline')}</h1>
          <p>تبسيط الحجوزات وإدارة المواعيد بسهولة • Simplify bookings and manage appointments</p>
          <div className="row">
            <Button onClick={() => navigate('/home')}>{t('welcome', 'continueGuest')}</Button>
            <Button variant="secondary" onClick={() => navigate('/auth')}>
              {t('welcome', 'signUp')}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              {t('welcome', 'logIn')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
