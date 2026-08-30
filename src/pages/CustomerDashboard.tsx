import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { getUserOrders } from '@/lib/order-api';

interface Order {
  id: string;
  orderNo: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface User {
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch user's orders from storage
    const userOrders = getUserOrders(parsedUser.email);
    setOrders(userOrders as Order[]);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد الانتظار' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'مؤكدة' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'تم الشحن' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'تم التوصيل' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-900 to-coffee-700 flex items-center justify-center">
        <div className="text-white text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-coffee-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-coffee-800 to-coffee-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مرحباً {user.name}</h1>
            <p className="text-coffee-100">لوحة تحكم العميل</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-coffee-900 mb-6 flex items-center gap-2">
            <Mail size={24} />
            بيانات الحساب
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-coffee-600" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-coffee-600" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">العنوان</label>
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-coffee-900 mb-6 flex items-center gap-2">
            <ShoppingBag size={24} />
            سجل الطلبات
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">لا توجد طلبات بعد</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-coffee-900">{order.orderNo}</h3>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('ar-AE')}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-2xl font-bold text-coffee-600 mt-2">د.إ {order.totalPrice}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">تفاصيل الطلب</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm text-gray-700">
                          <span>{item.productName}</span>
                          <span className="text-gray-500">
                            {item.quantity} × د.إ {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>طريقة الدفع: {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'Apple Pay'}</span>
                    <button className="text-coffee-600 hover:text-coffee-700 font-semibold">عرض التفاصيل →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
