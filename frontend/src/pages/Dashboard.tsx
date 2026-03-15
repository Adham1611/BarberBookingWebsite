import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Navigation from '../components/Navigation';

const SERVICES_MAP: { [key: string]: string } = {
  '1': 'Haircut',
  '2': 'Beard Trim',
  '3': 'Hair + Beard Package',
  '4': 'Skin Fade',
  '5': 'Kids Haircut',
};

const BARBERS_MAP: { [key: string]: string } = {
  '1': 'Alex Johnson',
  '2': 'Marcus Smith',
  '3': 'David Brown',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useBooking();
  const { user } = useAuth();
  const { t } = useLanguage();

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('dashboard.welcome')}, {user?.name || 'Guest'}
          </h1>
          <p className="text-gray-400">Manage your appointments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('dashboard.upcoming')}</p>
            <p className="text-3xl font-bold text-gold">
              {upcomingBookings.length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('dashboard.completed')}</p>
            <p className="text-3xl font-bold text-white">
              {completedBookings.length}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">{t('dashboard.total')}</p>
            <p className="text-3xl font-bold text-white">{bookings.length}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('dashboard.upcomingAppointments')}
          </h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-900 rounded-xl p-6 flex justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-white mb-2">
                      {SERVICES_MAP[booking.serviceId] || 'Service'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-1">
                      Barber: {BARBERS_MAP[booking.barberId] || 'Barber'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {booking.date} at {booking.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/booking')}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
                    >
                      {t('common.reschedule')}
                    </button>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-all duration-300"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">{t('dashboard.noAppointments')}</p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300"
              >
                {t('home.book')}
              </button>
            </div>
          )}
        </div>

        {completedBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {t('dashboard.bookingHistory')}
            </h2>
            <div className="space-y-4">
              {completedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-900 rounded-xl p-6 opacity-75"
                >
                  <h3 className="font-bold text-white mb-2">
                    {SERVICES_MAP[booking.serviceId] || 'Service'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    Barber: {BARBERS_MAP[booking.barberId] || 'Barber'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {booking.date} at {booking.time} • Completed
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}