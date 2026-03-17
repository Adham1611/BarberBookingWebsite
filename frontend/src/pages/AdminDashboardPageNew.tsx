import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, type PlatformStats, type Shop } from '../api/api';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'shops'>('stats');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth');
      return;
    }
    loadStats();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'shops') loadShops();
  }, [activeTab, page, search, planFilter]);

  const loadStats = async () => {
    try {
      const data = await analyticsApi.getPlatformStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadShops = async () => {
    setLoading(true);
    try {
      const data = await analyticsApi.getAdminShops({
        search: search || undefined,
        plan: planFilter || undefined,
        page,
      });
      setShops(data.shops);
      setTotal(data.total);
      setPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleShop = async (shopId: string) => {
    try {
      const res = await analyticsApi.toggleShopStatus(shopId);
      setShops(prev =>
        prev.map(s => s._id === shopId ? { ...s, isActive: res.isActive } : s)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const planColors: Record<string, string> = {
    free: '#666',
    starter: '#4caf50',
    pro: '#2196f3',
    premium: '#ff9800',
  };

  return (
    <div className="dashboard-layout" dir={isRTL ? 'rtl' : 'ltr'}>
      <aside className="sidebar">
        <div className="sidebar-logo">🛡️ Admin</div>
        <nav className="sidebar-nav">
          {[
            { key: 'stats', icon: '📊', label: isRTL ? 'الإحصائيات' : 'Platform Stats' },
            { key: 'shops', icon: '🏪', label: isRTL ? 'الصالونات' : 'Manage Shops' },
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
          <button className="sidebar-nav-item danger" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span>{isRTL ? 'خروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h1 className="dashboard-title">
            {isRTL ? 'لوحة تحكم المنصة' : 'Platform Dashboard'}
          </h1>
        </div>

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div className="tab-content">
            {loading || !stats ? (
              <div className="spinner-center"><div className="spinner" /></div>
            ) : (
              <>
                <div className="stats-grid">
                  {[
                    { icon: '🏪', label: isRTL ? 'الصالونات' : 'Shops', value: stats.totalShops, sub: `${stats.activeShops} active` },
                    { icon: '👤', label: isRTL ? 'المستخدمون' : 'Users', value: stats.totalUsers },
                    { icon: '📅', label: isRTL ? 'الحجوزات' : 'Bookings', value: stats.totalBookings },
                    { icon: '💰', label: 'MRR', value: `$${stats.estimatedMRR.toLocaleString()}`, highlight: true },
                  ].map((c, i) => (
                    <div key={i} className={`stat-card ${c.highlight ? 'highlight' : ''}`}>
                      <span className="stat-icon">{c.icon}</span>
                      <div>
                        <p className="stat-label">{c.label}</p>
                        <p className="stat-value">{c.value}</p>
                        {c.sub && <p className="stat-sub">{c.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>{isRTL ? 'توزيع الاشتراكات' : 'Subscription Breakdown'}</h3>
                  <div className="plan-breakdown">
                    {Object.entries(stats.subscriptionBreakdown).map(([plan, count]) => (
                      <div key={plan} className="plan-badge-row">
                        <span className="plan-pill" style={{ background: planColors[plan] }}>
                          {plan.toUpperCase()}
                        </span>
                        <span className="plan-count">{count}</span>
                        <div className="plan-bar-wrapper">
                          <div
                            className="plan-bar-fill"
                            style={{
                              width: stats.totalShops > 0
                                ? `${(count / stats.totalShops) * 100}%`
                                : '0%',
                              background: planColors[plan],
                            }}
                          />
                        </div>
                        <span className="plan-pct">
                          {stats.totalShops > 0
                            ? `${((count / stats.totalShops) * 100).toFixed(0)}%`
                            : '0%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Shops tab */}
        {activeTab === 'shops' && (
          <div className="tab-content">
            <div className="filters-row">
              <input
                className="search-input-sm"
                placeholder={isRTL ? 'ابحث...' : 'Search...'}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <select
                className="select-filter"
                value={planFilter}
                onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
              >
                <option value="">{isRTL ? 'كل الخطط' : 'All plans'}</option>
                {['free', 'starter', 'pro', 'premium'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="spinner-center"><div className="spinner" /></div>
            ) : (
              <>
                <div className="card">
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{isRTL ? 'الصالون' : 'Shop'}</th>
                          <th>{isRTL ? 'المالك' : 'Owner'}</th>
                          <th>{isRTL ? 'الخطة' : 'Plan'}</th>
                          <th>{isRTL ? 'الحالة' : 'Status'}</th>
                          <th>{isRTL ? 'حجوزات' : 'Bookings'}</th>
                          <th>{isRTL ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shops.map(shop => {
                          const sub = shop.subscription as { plan?: string } | undefined;
                          return (
                            <tr key={shop._id}>
                              <td>
                                <strong>{shop.name}</strong>
                                <br /><small className="text-muted">{shop.slug}</small>
                              </td>
                              <td>
                                {typeof shop.owner === 'object'
                                  ? `${shop.owner.name}`
                                  : shop.owner}
                              </td>
                              <td>
                                <span className="plan-pill" style={{ background: planColors[sub?.plan ?? 'free'] }}>
                                  {(sub?.plan ?? 'free').toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span className={`status-badge ${shop.isActive ? 'confirmed' : 'cancelled'}`}>
                                  {shop.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'موقوف' : 'Inactive')}
                                </span>
                              </td>
                              <td>{shop.stats?.totalBookings ?? 0}</td>
                              <td>
                                <button
                                  className={`btn-sm ${shop.isActive ? 'btn-danger' : 'btn-secondary'}`}
                                  onClick={() => toggleShop(shop._id)}
                                >
                                  {shop.isActive ? (isRTL ? 'إيقاف' : 'Disable') : (isRTL ? 'تفعيل' : 'Enable')}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pagination">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  <span>{page} / {pages} ({total})</span>
                  <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
