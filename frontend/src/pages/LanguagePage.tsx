import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useLanguage, useTranslation } from '../context/LanguageContext';

export default function LanguagePage() {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const t = useTranslation();

  const chooseLanguage = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    navigate('/welcome');
  };

  return (
    <main className="fullscreen-center intro-bg">
      <div className="logo-badge">✦</div>
      <h1>{t('language', 'title')}</h1>
      <p>اختر اللغة لمتابعة الاستخدام • Select language to continue</p>
      <div className="row">
        <Button onClick={() => chooseLanguage('ar')}>{t('language', 'arabic')}</Button>
        <Button variant="secondary" onClick={() => chooseLanguage('en')}>
          {t('language', 'english')}
        </Button>
      </div>
    </main>
  );
}
