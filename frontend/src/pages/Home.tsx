import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navigation from '../components/Navigation';

const SERVICES = [
  {
    id: 'haircut',
    name: 'Haircut',
    price: '$30',
    duration: '30 min',
    icon: '✂️',
  },
  {
    id: 'beard',
    name: 'Beard Trim',
    price: '$20',
    duration: '20 min',
    icon: '🧔',
  },
  {
    id: 'package',
    name: 'Hair + Beard Package',
    price: '$45',
    duration: '50 min',
    icon: '✨',
  },
  {
    id: 'fade',
    name: 'Skin Fade',
    price: '$35',
    duration: '35 min',
    icon: '💈',
  },
  {
    id: 'kids',
    name: 'Kids Haircut',
    price: '$20',
    duration: '25 min',
    icon: '👶',
  },
];

const BARBERS = [
  {
    id: 1,
    name: 'Alex Johnson',
    specialty: 'Precision Cuts',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    id: 2,
    name: 'Marcus Smith',
    specialty: 'Fades & Designs',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: 3,
    name: 'David Brown',
    specialty: 'Classic Styles',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1599027615386-9c139173df3e?w=1200&h=400&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl">
            {t('home.hero.subtitle')}
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-4 bg-gold text-black font-semibold rounded-xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {t('home.book')}
          </button>
        </div>
      </div>

      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            {t('home.services')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-gold text-lg font-bold mb-2">
                  {service.price}
                </p>
                <p className="text-gray-400 text-sm mb-4">{service.duration}</p>
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full py-2 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300"
                >
                  {t('common.book')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            {t('home.barbers')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BARBERS.map((barber) => (
              <div
                key={barber.id}
                className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={barber.avatar}
                  alt={barber.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {barber.name}
                  </h3>
                  <p className="text-gold text-sm font-semibold mb-3">
                    {barber.specialty}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">
                      {barber.rating}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/booking')}
                    className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300"
                  >
                    {t('common.book')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>&copy; 2026 Barber Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}