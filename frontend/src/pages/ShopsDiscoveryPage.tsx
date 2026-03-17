import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopsApi, type Shop } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

export default function ShopsDiscoveryPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    timeout = setTimeout(() => {
      fetchShops();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await shopsApi.getPublic(search ? { search } : {});
      setShops(data);
    } catch {
      setError('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const days = isRTL
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = days[new Date().getDay()];

  return (
    <div className="page-container" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="top-bar">
        <button className="back-btn" onClick={() => navigate('/home')}>
          {isRTL ? '→' : '←'}
        </button>
        <h1 className="top-bar-title">
          {isRTL ? 'اكتشف الصالونات' : 'Discover Shops'}
        </h1>
        <div />
      </header>

      {/* Search */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={isRTL ? 'ابحث عن صالون...' : 'Search for a shop...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="spinner-center">
          <div className="spinner" />
        </div>
      ) : shops.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✂️</span>
          <p>{isRTL ? 'لا يوجد صالونات' : 'No shops found'}</p>
        </div>
      ) : (
        <div className="shops-grid">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="shop-card"
              onClick={() => navigate(`/shop/${shop.slug}`)}
            >
              {/* Cover image */}
              <div className="shop-card-image">
                {shop.image ? (
                  <img src={shop.image} alt={shop.name} />
                ) : (
                  <div className="shop-card-image-placeholder">✂️</div>
                )}
              </div>

              {/* Body */}
              <div className="shop-card-body">
                <h3 className="shop-card-name">{shop.name}</h3>
                {shop.address?.city && (
                  <p className="shop-card-city">📍 {shop.address.city}</p>
                )}
                {shop.description && (
                  <p className="shop-card-desc">{shop.description}</p>
                )}

                {/* Stats row */}
                <div className="shop-card-stats">
                  {shop.stats && (
                    <>
                      <span>👥 {shop.stats.totalBarbers} {isRTL ? 'حلاق' : 'barbers'}</span>
                      <span>✂️ {shop.stats.totalServices} {isRTL ? 'خدمة' : 'services'}</span>
                    </>
                  )}
                </div>

                {/* Today hours */}
                {shop.workingHours && (
                  <div className="shop-card-hours">
                    <span className="hours-label">{isRTL ? 'اليوم:' : 'Today:'}</span>
                    <span>{todayName}</span>
                  </div>
                )}

                <button className="btn-primary shop-card-btn">
                  {isRTL ? 'احجز الآن' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Become an owner CTA */}
      <div className="owner-cta">
        <h3>{isRTL ? 'هل أنت صاحب صالون؟' : 'Do you own a barbershop?'}</h3>
        <p>{isRTL ? 'أضف صالونك واحصل على حجوزات أكثر' : 'List your shop and get more bookings'}</p>
        <button className="btn-secondary" onClick={() => navigate('/register-shop')}>
          {isRTL ? 'أضف صالونك مجانًا' : 'Add your shop for free'}
        </button>
      </div>
    </div>
  );
}
