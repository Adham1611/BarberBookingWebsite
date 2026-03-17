import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, type AnalyticsOverview, type ServiceStat, type BarberStat, type Booking } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

export default function OwnerDashboardPage() {
  const { user, shop, myShops, setActiveShop, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [services, setServices] = useState<ServiceStat[]>([]);
  const [barbers, setBarbers] = useState<BarberStat[]>([]);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'team' | 'settings'>('overview');

  useEffect(() => {
    if (!shop) return;
    loadDashboard();
  }, [shop]);

  const loadDashboard = async () => {
    if (!shop) return;
    setLoading(true);
    try {
      const [ov, sv, br, up] = await Promise.all([
        analyticsApi.getOverview(shop._id),
        analyticsApi.getTopServices(shop._id),
        analyticsApi.getBarberPerformance(shop._id),
        analyticsApi.getUpcomingBookings(shop._id),
      ]);
      setOverview(ov);
      setServices(sv);
      setBarbers(br);
      setUpcoming(up);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Guard
  if (!user || !['owner', 'admin'].includes(user.role)) {
    return (
      <div className="center-page">
        <p>{isRTL ? 'غير مصرح' : 'Unauthorized'}</p>
        <button onClick={() => navigate('/auth')}>Login</button>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="center-page">
        <h2>{isRTL ? 'مرحبًا بك! ابدأ بإنشاء صالونك' : 'Welcome! Create your first shop'}</h2>
        <button className="btn-primary" onClick={() => navigate('/register-shop')}>
          {isRTL ? 'إنشاء صالون' : 'Create Shop'}
        </button>
      </div>
    );
  }

  const ov = overview?.overview;
  const sub = overview?.subscription;

  const planBadgeColor: Record<string, string> = {
    free: '#888',
    starter: '#4caf50',
    pro: '#2196f3',
    premium: '#ff9800',
  };

  return (
    <div className="dashboard-layout" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">✂️ BarberSaaS</div>

        {/* Shop switcher */}
        {myShops.length > 1 && (
          <select
            className="shop-switcher"
            value={shop._id}
            onChange={e => {
              const selected = myShops.find(s => s._id === e.target.value);
              if (selected) setActiveShop(selected);
            }}
          >
            {myShops.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}

        <nav className="sidebar-nav">
          {[
            { key: 'overview', icon: '📊', label: isRTL ? 'نظرة عامة' : 'Overview' },
            { key: 'bookings', icon: '📅', label: isRTL ? 'الحجوزات' : 'Bookings' },
            { key: 'team', icon: '👥', label: isRTL ? 'الفريق' : 'Team' },
            { key: 'settings', icon: '⚙️', label: isRTL ? 'الإعدادات' : 'Settings' },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              className={`sidebar-nav-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item" onClick={() => navigate(`/shop/${shop.slug}`)}>
            <span className="nav-icon">🔗</span>
            <span>{isRTL ? 'عرض الصفحة' : 'View Page'}</span>
          </button>
          <button className="sidebar-nav-item danger" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span>{isRTL ? 'خروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Top bar */}
        <div className="dashboard-topbar">
          <div>
            <h1 className="dashboard-title">{shop.name}</h1>
            {sub && (
              <span
                className="plan-badge"
                style={{ background: planBadgeColor[sub.plan] }}
              >
                {sub.plan.toUpperCase()}
              </span>
            )}
          </div>
          <div className="topbar-actions">
            <button className="btn-secondary" onClick={() => navigate(`/shop/${shop.slug}/booking`)}>
              {isRTL ? '+ حجز جديد' : '+ New Booking'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner-center"><div className="spinner" /></div>
        ) : (
          <>
            {/* ── Overview Tab ─────────────────────────────── */}
            {activeTab === 'overview' && ov && (
              <div className="tab-content">
                {/* Stat cards */}
                <div className="stats-grid">
                  <StatCard
                    icon="📅"
                    label={isRTL ? 'الحجوزات هذا الشهر' : 'Bookings this month'}
                    value={String(ov.monthBookings)}
                    growth={ov.bookingGrowth}
                  />
                  <StatCard
                    icon="💰"
                    label={isRTL ? 'الإيرادات هذا الشهر' : 'Revenue this month'}
                    value={`$${ov.revenueThisMonth.toFixed(2)}`}
                    growth={ov.revenueGrowth}
                  />
                  <StatCard
                    icon="👥"
                    label={isRTL ? 'إجمالي العملاء' : 'Total customers'}
                    value={String(ov.totalCustomers)}
                    sub={`+${ov.newCustomersThisMonth} ${isRTL ? 'هذا الشهر' : 'this month'}`}
                  />
                  <StatCard
                    icon="✂️"
                    label={isRTL ? 'إجمالي الحجوزات' : 'Total bookings'}
                    value={String(ov.totalBookings)}
                  />
                </div>

                {/* Subscription usage */}
                {sub && (
                  <div className="card subscription-card">
                    <h3>{isRTL ? 'استخدام الاشتراك' : 'Subscription Usage'}</h3>
                    <div className="usage-row">
                      <UsageBar
                        label={isRTL ? 'الحجوزات' : 'Bookings'}
                        used={sub.usage.currentMonth.bookings}
                        max={sub.features.maxMonthlyBookings}
                      />
                      <UsageBar
                        label={isRTL ? 'الحلاقون' : 'Barbers'}
                        used={ov.totalBarbers}
                        max={sub.features.maxBarbers}
                      />
                      <UsageBar
                        label={isRTL ? 'الخدمات' : 'Services'}
                        used={ov.totalServices}
                        max={sub.features.maxServices}
                      />
                    </div>
                    {sub.plan === 'free' && (
                      <button className="btn-primary upgrade-btn" onClick={() => navigate('/pricing')}>
                        {isRTL ? '⬆️ ترقية الخطة' : '⬆️ Upgrade Plan'}
                      </button>
                    )}
                  </div>
                )}

                {/* Top services */}
                {services.length > 0 && (
                  <div className="card">
                    <h3>{isRTL ? 'أكثر الخدمات حجزًا' : 'Top Services'}</h3>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{isRTL ? 'الخدمة' : 'Service'}</th>
                            <th>{isRTL ? 'الحجوزات' : 'Bookings'}</th>
                            <th>{isRTL ? 'الإيراد' : 'Revenue'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((s, i) => (
                            <tr key={i}>
                              <td>{s.name}</td>
                              <td>{s.count}</td>
                              <td>${s.revenue.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Barber performance */}
                {barbers.length > 0 && (
                  <div className="card">
                    <h3>{isRTL ? 'أداء الحلاقين' : 'Barber Performance'}</h3>
                    <div className="barber-perf-list">
                      {barbers.map((b, i) => (
                        <div key={i} className="barber-perf-item">
                          <div className="barber-avatar-sm">{b.name?.[0]}</div>
                          <div>
                            <strong>{b.name}</strong>
                            <p>⭐ {b.averageRating?.toFixed(1) ?? '—'} &nbsp;|&nbsp; {b.totalBookings} {isRTL ? 'حجز' : 'bookings'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Bookings Tab ─────────────────────────────── */}
            {activeTab === 'bookings' && (
              <div className="tab-content">
                <div className="card">
                  <h3>{isRTL ? 'الحجوزات القادمة' : 'Upcoming Bookings'}</h3>
                  {upcoming.length === 0 ? (
                    <p className="empty-msg">{isRTL ? 'لا حجوزات قادمة' : 'No upcoming bookings'}</p>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{isRTL ? 'العميل' : 'Customer'}</th>
                            <th>{isRTL ? 'الخدمة' : 'Service'}</th>
                            <th>{isRTL ? 'الحلاق' : 'Barber'}</th>
                            <th>{isRTL ? 'التاريخ' : 'Date'}</th>
                            <th>{isRTL ? 'الوقت' : 'Time'}</th>
                            <th>{isRTL ? 'الحالة' : 'Status'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcoming.map((b) => (
                            <tr key={b._id}>
                              <td>
                                {b.customer
                                  ? `${b.customer.firstName} ${b.customer.lastName}`
                                  : '—'}
                              </td>
                              <td>{b.service?.name ?? '—'}</td>
                              <td>{b.barber?.name ?? '—'}</td>
                              <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                              <td>{b.startTime}</td>
                              <td>
                                <span className={`status-badge ${b.status}`}>{b.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Team Tab ─────────────────────────────────── */}
            {activeTab === 'team' && (
              <div className="tab-content">
                <div className="card">
                  <div className="card-header-row">
                    <h3>{isRTL ? 'الحلاقون' : 'Barbers'}</h3>
                    <button className="btn-secondary btn-sm">
                      {isRTL ? '+ إضافة حلاق' : '+ Add Barber'}
                    </button>
                  </div>
                  {barbers.length === 0 ? (
                    <p className="empty-msg">{isRTL ? 'لا يوجد حلاقون بعد' : 'No barbers yet'}</p>
                  ) : (
                    <div className="barber-perf-list">
                      {barbers.map((b, i) => (
                        <div key={i} className="barber-perf-item">
                          <div className="barber-avatar-sm">{b.name?.[0]}</div>
                          <div>
                            <strong>{b.name}</strong>
                            <p>⭐ {b.averageRating?.toFixed(1) ?? '—'} &nbsp;|&nbsp; {b.totalBookings} {isRTL ? 'حجز هذا الشهر' : 'bookings this month'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Settings Tab ─────────────────────────────── */}
            {activeTab === 'settings' && (
              <div className="tab-content">
                <div className="card">
                  <h3>{isRTL ? 'إعدادات الصالون' : 'Shop Settings'}</h3>
                  <div className="settings-list">
                    <SettingRow
                      label={isRTL ? 'اسم الصالون' : 'Shop Name'}
                      value={shop.name}
                    />
                    <SettingRow
                      label={isRTL ? 'الرابط' : 'Shop URL'}
                      value={`/shop/${shop.slug}`}
                    />
                    <SettingRow
                      label={isRTL ? 'البريد الإلكتروني' : 'Email'}
                      value={shop.email ?? '—'}
                    />
                    <SettingRow
                      label={isRTL ? 'الهاتف' : 'Phone'}
                      value={shop.phone ?? '—'}
                    />
                  </div>
                  <button className="btn-primary mt-16" onClick={() => navigate(`/owner/shop/${shop._id}/edit`)}>
                    {isRTL ? 'تعديل الإعدادات' : 'Edit Settings'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ─── Helper sub-components ───────────────────────────────────────────────────

function StatCard({ icon, label, value, growth, sub }: {
  icon: string; label: string; value: string; growth?: number; sub?: string;
}) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {growth !== undefined && (
          <p className={`stat-growth ${growth >= 0 ? 'positive' : 'negative'}`}>
            {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}%
          </p>
        )}
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

function UsageBar({ label, used, max }: { label: string; used: number; max: number | null }) {
  const pct = max ? Math.min((used / max) * 100, 100) : 0;
  const isOver = max ? used >= max : false;

  return (
    <div className="usage-bar-wrapper">
      <div className="usage-bar-header">
        <span>{label}</span>
        <span className={isOver ? 'text-danger' : ''}>
          {used} / {max ?? '∞'}
        </span>
      </div>
      {max && (
        <div className="usage-bar-track">
          <div
            className="usage-bar-fill"
            style={{ width: `${pct}%`, background: isOver ? '#e53935' : '#4caf50' }}
          />
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <span className="setting-value">{value}</span>
    </div>
  );
}
