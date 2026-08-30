import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { getAllOrders } from '@/lib/order-api';

export function AdminReports() {
  const orders = getAllOrders();

  const stats = {
    totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length : 0,
    totalItems: orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0),
  };

  const topProducts = Array.from(
    orders.reduce((map, order) => {
      order.items.forEach((item) => {
        if (!map.has(item.productName)) {
          map.set(item.productName, { name: item.productName, qty: 0, revenue: 0 });
        }
        const product = map.get(item.productName)!;
        product.qty += item.quantity;
        product.revenue += item.price * item.quantity;
      });
      return map;
    }, new Map<string, { name: string; qty: number; revenue: number }>())
  )
    .map(([, product]) => product)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const monthlyRevenue = Array.from(
    orders.reduce((map, order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleDateString('ar-AE', { year: 'numeric', month: 'long' });
      if (!map.has(month)) {
        map.set(month, 0);
      }
      map.set(month, map.get(month)! + order.totalPrice);
      return map;
    }, new Map())
  ).map(([month, revenue]) => ({ month, revenue }));

  const paymentMethods = {
    cod: orders.filter((o) => o.paymentMethod === 'cod').length,
    apple_pay: orders.filter((o) => o.paymentMethod === 'apple_pay').length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">التقارير والتحليلات</h2>
        <p className="text-gray-400">تحليل شامل للمبيعات والأداء</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-200 mb-2">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-white">د.إ {stats.totalRevenue.toLocaleString('ar-AE')}</p>
            </div>
            <DollarSign className="text-blue-300" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-200 mb-2">إجمالي الطلبات</p>
              <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <Package className="text-purple-300" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-200 mb-2">متوسط الطلب</p>
              <p className="text-3xl font-bold text-white">د.إ {stats.averageOrderValue.toLocaleString('ar-AE', { maximumFractionDigits: 0 })}</p>
            </div>
            <TrendingUp className="text-green-300" size={40} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 border border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-200 mb-2">إجمالي المنتجات</p>
              <p className="text-3xl font-bold text-white">{stats.totalItems}</p>
            </div>
            <BarChart3 className="text-orange-300" size={40} />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">أكثر المنتجات مبيعاً</h3>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.qty} وحدة</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">د.إ {product.revenue.toLocaleString('ar-AE')}</p>
                  <div className="w-16 bg-gray-600 h-2 rounded-full mt-1">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(product.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">طرق الدفع</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-700/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white">الدفع عند الاستلام</p>
                <p className="text-2xl font-bold text-blue-400">{paymentMethods.cod}</p>
              </div>
              <div className="w-full bg-gray-600 h-2 rounded-full">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${((paymentMethods.cod / stats.totalOrders) || 0) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {(((paymentMethods.cod / stats.totalOrders) || 0) * 100).toFixed(1)}% من الطلبات
              </p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white">Apple Pay</p>
                <p className="text-2xl font-bold text-purple-400">{paymentMethods.apple_pay}</p>
              </div>
              <div className="w-full bg-gray-600 h-2 rounded-full">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${((paymentMethods.apple_pay / stats.totalOrders) || 0) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {(((paymentMethods.apple_pay / stats.totalOrders) || 0) * 100).toFixed(1)}% من الطلبات
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">الإيرادات الشهرية</h3>
        <div className="space-y-3">
          {monthlyRevenue.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
              <p className="text-white">{item.month}</p>
              <div className="text-right">
                <p className="text-green-400 font-semibold">د.إ {item.revenue.toLocaleString('ar-AE')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
