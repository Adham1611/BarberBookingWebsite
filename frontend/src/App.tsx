import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LanguagePage from './pages/LanguagePage';
import WelcomePage from './pages/WelcomePage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ShopsDiscoveryPage from './pages/ShopsDiscoveryPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import RegisterShopPage from './pages/RegisterShopPage';

function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== role) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LanguagePage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/shops" element={<ShopsDiscoveryPage />} />
      <Route path="/register-shop" element={<RegisterShopPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/dashboard" element={<CustomerDashboardPage />} />
      <Route
        path="/owner-dashboard"
        element={
          <RequireRole role="owner">
            <OwnerDashboardPage />
          </RequireRole>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminDashboardPage />
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
