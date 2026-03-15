import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1599027615386-9c139173df3e?w=1200&h=400&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('welcome.title')}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            {t('welcome.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-black px-4 py-16">
        <div className="max-w-md mx-auto space-y-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 border border-gray-700"
          >
            {t('welcome.guest')}
          </button>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="w-full py-4 px-6 bg-gold text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all duration-300 shadow-lg"
          >
            {t('welcome.signup')}
          </button>
          <button
            onClick={() => navigate('/auth?mode=login')}
            className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 border border-gold/50"
          >
            {t('welcome.login')}
          </button>
        </div>
      </div>
    </div>
  );
}