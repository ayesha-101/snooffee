import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

interface Customer {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  joinDate?: string;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const customerMap = new Map<string, Customer>();

    allOrders.forEach((order: any) => {
      if (!customerMap.has(order.email)) {
        customerMap.set(order.email, {
          email: order.email,
          name: order.email.split('@')[0],
          phone: order.phone,
          address: order.address,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
        });
      }
      const customer = customerMap.get(order.email)!;
      customer.totalOrders += 1;
      customer.totalSpent += order.totalPrice;
      customer.lastOrderDate = order.createdAt;
    });

    setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent));
    setLoading(false);
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">جاري تحميل العملاء...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">إدارة العملاء</h2>
        <p className="text-gray-400">عرض وإدارة بيانات العملاء والطلبات</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-3">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">إجمالي العملاء</p>
          <p className="text-3xl font-bold text-white">{customers.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">إجمالي المشتريات</p>
          <p className="text-3xl font-bold text-green-400">
            د.إ {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('ar-AE')}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">متوسط الإنفاق</p>
          <p className="text-3xl font-bold text-blue-400">
            د.إ {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0).toLocaleString('ar-AE', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث عن عميل..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-coffee-600"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">الهاتف</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">الطلبات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">الإجمالي</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">آخر طلب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.email} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-white">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{customer.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-white flex items-center gap-2">
                    <ShoppingBag size={16} className="text-coffee-500" />
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-400">
                    د.إ {customer.totalSpent.toLocaleString('ar-AE')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('ar-AE') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">لا توجد نتائج</p>
        </div>
      )}
    </div>
  );
}
