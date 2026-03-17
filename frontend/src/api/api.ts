// Central API client for all backend communication
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Auth helpers ────────────────────────────────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiFetch<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerOwner: (data: { name: string; email: string; password: string; phone?: string; shopName: string; shopSlug: string }) =>
    apiFetch<{ accessToken: string; refreshToken: string; user: User; shop: Shop }>('/auth/register/owner', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Shops API ───────────────────────────────────────────────────────────────
export const shopsApi = {
  getPublic: (params?: { search?: string; city?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<Shop[]>(`/shops/public${q ? '?' + q : ''}`);
  },

  getBySlug: (slug: string) =>
    apiFetch<Shop>(`/shops/public/${slug}`),

  getMyShops: () =>
    apiFetch<Shop[]>('/shops/my-shops'),

  get: (shopId: string) =>
    apiFetch<Shop>(`/shops/${shopId}`),

  create: (data: Partial<Shop>) =>
    apiFetch<{ shop: Shop }>('/shops', { method: 'POST', body: JSON.stringify(data) }),

  update: (shopId: string, data: Partial<Shop>) =>
    apiFetch<{ shop: Shop }>(`/shops/${shopId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getStats: (shopId: string) =>
    apiFetch<ShopStats>(`/shops/${shopId}/stats`),

  getSubscription: (shopId: string) =>
    apiFetch<Subscription>(`/shops/${shopId}/subscription`),

  upgradeSubscription: (shopId: string, plan: string) =>
    apiFetch<{ subscription: Subscription }>(`/shops/${shopId}/subscription/upgrade`, {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),
};

// ─── Analytics API ───────────────────────────────────────────────────────────
export const analyticsApi = {
  getOverview: (shopId: string) =>
    apiFetch<AnalyticsOverview>(`/analytics/shops/${shopId}/overview`),

  getBookingTrends: (shopId: string, days = 30) =>
    apiFetch<TrendPoint[]>(`/analytics/shops/${shopId}/trends?days=${days}`),

  getTopServices: (shopId: string) =>
    apiFetch<ServiceStat[]>(`/analytics/shops/${shopId}/services`),

  getBarberPerformance: (shopId: string) =>
    apiFetch<BarberStat[]>(`/analytics/shops/${shopId}/barbers`),

  getRevenueByMonth: (shopId: string) =>
    apiFetch<RevenueStat[]>(`/analytics/shops/${shopId}/revenue`),

  getUpcomingBookings: (shopId: string) =>
    apiFetch<Booking[]>(`/analytics/shops/${shopId}/upcoming`),

  // Admin
  getPlatformStats: () =>
    apiFetch<PlatformStats>('/analytics/admin/stats'),

  getAdminShops: (params?: { search?: string; plan?: string; page?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<{ shops: Shop[]; total: number; pages: number }>(`/analytics/admin/shops${q ? '?' + q : ''}`);
  },

  toggleShopStatus: (shopId: string) =>
    apiFetch<{ isActive: boolean }>(`/analytics/admin/shops/${shopId}/toggle`, { method: 'PATCH' }),

  getRevenueTrend: () =>
    apiFetch<RevenueStat[]>('/analytics/admin/revenue-trend'),
};

// ─── Bookings API ────────────────────────────────────────────────────────────
export const bookingsApi = {
  getAvailableSlots: (shopId: string, params: { barberId: string; serviceId: string; bookingDate: string }) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch<TimeSlot[]>(`/bookings/${shopId}/available-slots?${q}`);
  },

  getAvailableBarbers: (shopId: string, params: { serviceId: string; bookingDate: string; startTime: string }) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch<Barber[]>(`/bookings/${shopId}/available-barbers?${q}`);
  },

  create: (shopId: string, data: CreateBookingPayload) =>
    apiFetch<{ booking: Booking }>(`/bookings/${shopId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getShopBookings: (shopId: string, params?: { status?: string; startDate?: string; endDate?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<Booking[]>(`/bookings/${shopId}${q ? '?' + q : ''}`);
  },

  cancel: (shopId: string, bookingId: string) =>
    apiFetch<{ booking: Booking }>(`/bookings/${shopId}/bookings/${bookingId}/cancel`, { method: 'PATCH' }),
};

// ─── Services API ────────────────────────────────────────────────────────────
export const servicesApi = {
  getShopServices: (shopId?: string) => {
    const path = shopId ? `/services?shop=${shopId}` : '/services';
    return apiFetch<Service[]>(path);
  },
  create: (data: Partial<Service>) =>
    apiFetch<Service>('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Service>) =>
    apiFetch<Service>(`/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch<void>(`/services/${id}`, { method: 'DELETE' }),
};

// ─── Barbers API ─────────────────────────────────────────────────────────────
export const barbersApi = {
  getShopBarbers: (shopId?: string) => {
    const path = shopId ? `/barbers?shop=${shopId}` : '/barbers';
    return apiFetch<Barber[]>(path);
  },
  create: (data: Partial<Barber>) =>
    apiFetch<Barber>('/barbers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Barber>) =>
    apiFetch<Barber>(`/barbers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Customers API ───────────────────────────────────────────────────────────
export const customersApi = {
  getAll: (shopId: string, params?: { search?: string; page?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<{ customers: Customer[]; total: number }>(`/customers/${shopId}${q ? '?' + q : ''}`);
  },
  get: (shopId: string, customerId: string) =>
    apiFetch<Customer>(`/customers/${shopId}/customers/${customerId}`),
  create: (shopId: string, data: Partial<Customer>) =>
    apiFetch<Customer>(`/customers/${shopId}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (shopId: string, customerId: string, data: Partial<Customer>) =>
    apiFetch<Customer>(`/customers/${shopId}/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (shopId: string, customerId: string) =>
    apiFetch<void>(`/customers/${shopId}/customers/${customerId}`, { method: 'DELETE' }),
  getStats: (shopId: string) =>
    apiFetch<CustomerStats>(`/customers/${shopId}/stats`),
};

// ─── Subscriptions API ───────────────────────────────────────────────────────
export const subscriptionsApi = {
  getPlans: () => apiFetch<Record<string, Plan>>('/subscriptions/plans/all'),
  pause: (shopId: string, reason?: string) =>
    apiFetch<void>(`/subscriptions/${shopId}/pause`, { method: 'POST', body: JSON.stringify({ reason }) }),
  resume: (shopId: string) =>
    apiFetch<void>(`/subscriptions/${shopId}/resume`, { method: 'POST' }),
  cancel: (shopId: string, data: { reason: string; feedback?: string }) =>
    apiFetch<void>(`/subscriptions/${shopId}/cancel`, { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Shared Types ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'barber' | 'owner' | 'admin';
  primaryShop?: string;
  shops?: string[];
}

export interface Shop {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  owner: User | string;
  address?: { street?: string; city?: string; state?: string; country?: string };
  phone?: string;
  email?: string;
  image?: string;
  workingHours?: Record<string, { open: string; close: string; isClosed: boolean }>;
  settings?: { bufferTimeInMinutes: number; maxDaysInAdvance: number; minTimeBeforeBooking: number };
  stats?: ShopStats;
  subscription?: Subscription | string;
  isActive: boolean;
  createdAt: string;
}

export interface ShopStats {
  totalBarbers: number;
  totalServices: number;
  totalBookings: number;
  totalCustomers: number;
  monthlyRevenue: number;
}

export interface Subscription {
  _id: string;
  shop: string;
  plan: 'free' | 'starter' | 'pro' | 'premium';
  status: 'active' | 'paused' | 'cancelled' | 'pending';
  features: {
    maxBarbers: number | null;
    maxServices: number | null;
    maxMonthlyBookings: number | null;
    analyticsAccess: boolean;
    smsNotifications: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
  };
  usage: {
    currentMonth: { bookings: number; barbers: number; services: number };
  };
  renewalDate?: string;
}

export interface Plan {
  name: string;
  price: number;
  features: Subscription['features'];
  description: string;
}

export interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
  category?: string;
  description?: string;
  isActive: boolean;
  shop?: string;
}

export interface Barber {
  _id: string;
  name: string;
  averageRating?: number;
  totalBookings?: number;
  avatar?: string;
  shop?: string;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  shop: string;
  barber?: Barber;
  service?: Service;
  customer?: Customer;
  bookingDate: string;
  startTime: string;
  endTime?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'in-progress';
  notes?: string;
  createdAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  loyaltyPoints: number;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate?: string;
  tags?: string[];
}

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
}

export interface CreateBookingPayload {
  barberId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
}

export interface AnalyticsOverview {
  overview: {
    totalBookings: number;
    monthBookings: number;
    bookingGrowth: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    revenueGrowth: number;
    totalCustomers: number;
    newCustomersThisMonth: number;
    totalBarbers: number;
    totalServices: number;
  };
  subscription: Pick<Subscription, 'plan' | 'status' | 'usage' | 'features'> | null;
}

export interface TrendPoint { date: string; bookings: number }
export interface ServiceStat { _id: string; name: string; price: number; count: number; revenue: number }
export interface BarberStat { _id: string; name: string; averageRating: number; totalBookings: number }
export interface RevenueStat { month: string; year: number; revenue?: number; bookings?: number; newShops?: number }
export interface PlatformStats {
  totalShops: number;
  activeShops: number;
  totalUsers: number;
  totalBookings: number;
  subscriptionBreakdown: Record<string, number>;
  estimatedMRR: number;
}
