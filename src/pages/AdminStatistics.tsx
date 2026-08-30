import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, BarChart3 } from 'lucide-react';
import { getOrderStatistics } from '@/lib/order-api';

interface Statistics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  byStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
  };
}

export function AdminStatistics() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statistics = getOrderStatistics();
    setStats(statistics);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">جاري تحميل الإحصائيات...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: 'إجمالي الطلبات',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'إجمالي الإيرادات',
      value: `د.إ ${stats.totalRevenue.toLocaleString('ar-AE')}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'متوسط قيمة الطلب',
      value: `د.إ ${stats.avgOrderValue.toLocaleString('ar-AE', { maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">إحصائيات المبيعات</h2>
        <p className="text-gray-600">نظرة عامة على أداء متجرك</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 size={24} className="text-coffee-600" />
          توزيع حالات الطلبات
        </h3>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <div className="text-center">
              <p className="text-sm font-medium text-yellow-800 mb-2">قيد الانتظار</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.byStatus.pending}</p>
              <p className="text-xs text-yellow-700 mt-2">
                {stats.totalOrders > 0
                  ? `${((stats.byStatus.pending / stats.totalOrders) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800 mb-2">مؤكدة</p>
              <p className="text-3xl font-bold text-blue-600">{stats.byStatus.confirmed}</p>
              <p className="text-xs text-blue-700 mt-2">
                {stats.totalOrders > 0
                  ? `${((stats.byStatus.confirmed / stats.totalOrders) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-800 mb-2">تم الشحن</p>
              <p className="text-3xl font-bold text-purple-600">{stats.byStatus.shipped}</p>
              <p className="text-xs text-purple-700 mt-2">
                {stats.totalOrders > 0
                  ? `${((stats.byStatus.shipped / stats.totalOrders) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="text-center">
              <p className="text-sm font-medium text-green-800 mb-2">تم التوصيل</p>
              <p className="text-3xl font-bold text-green-600">{stats.byStatus.delivered}</p>
              <p className="text-xs text-green-700 mt-2">
                {stats.totalOrders > 0
                  ? `${((stats.byStatus.delivered / stats.totalOrders) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
