import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import Navigation from '../components/Navigation';

const SERVICES = [
  { id: '1', name: 'Haircut', price: '$30', duration: '30 min' },
  { id: '2', name: 'Beard Trim', price: '$20', duration: '20 min' },
  { id: '3', name: 'Hair + Beard Package', price: '$45', duration: '50 min' },
  { id: '4', name: 'Skin Fade', price: '$35', duration: '35 min' },
  { id: '5', name: 'Kids Haircut', price: '$20', duration: '25 min' },
];

const BARBERS = [
  { id: '1', name: 'Alex Johnson', specialty: 'Precision Cuts' },
  { id: '2', name: 'Marcus Smith', specialty: 'Fades & Designs' },
  { id: '3', name: 'David Brown', specialty: 'Classic Styles' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { bookings } = useBooking();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('bookings');

  const dailyBookings = bookings.length;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('admin.dashboard')}
          </h1>
          <p className="text-gray-400">Manage your barber shop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('admin.totalBookings')}</p>
            <p className="text-3xl font-bold text-gold">{bookings.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('admin.todayBookings')}</p>
            <p className="text-3xl font-bold text-white">{dailyBookings}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('admin.activeBarbers')}</p>
            <p className="text-3xl font-bold text-white">{BARBERS.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('admin.services')}</p>
            <p className="text-3xl font-bold text-white">{SERVICES.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.bookings')}
          </button>
          <button
            onClick={() => setActiveTab('barbers')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'barbers'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.barbers')}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'services'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('admin.services')}
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('admin.allBookings')}
            </h2>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-900 rounded-xl p-6 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-white mb-1">
                        {booking.customerName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {booking.date} at {booking.time}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {booking.customerPhone}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          booking.status === 'upcoming'
                            ? 'bg-green-900 text-green-300'
                            : booking.status === 'completed'
                            ? 'bg-gray-800 text-gray-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl p-12 text-center">
                <p className="text-gray-400">No bookings yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'barbers' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('admin.manageBarbers')}
            </h2>
            <div className="space-y-3">
              {BARBERS.map((barber) => (
                <div
                  key={barber.id}
                  className="bg-gray-900 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-white">{barber.name}</h3>
                    <p className="text-gray-400 text-sm">{barber.specialty}</p>
                  </div>
                  <button className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-all duration-300">
                    {t('common.delete')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('admin.manageServices')}
            </h2>
            <div className="space-y-3">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-900 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-white">{service.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {service.price} • {service.duration}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-all duration-300">
                    {t('common.delete')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}