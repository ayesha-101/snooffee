import { useState, useEffect } from 'react';
import { ChevronDown, Check, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';
import { getAllOrders, updateOrderStatus, type Order } from '@/lib/order-api';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allOrders = getAllOrders();
    setOrders(allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, []);

  const handleStatusUpdate = (orderId: string, newStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered') => {
    const updated = updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updated : order))
      );
      toast.success(`تم تحديث حالة الطلب إلى ${getStatusLabel(newStatus)}`);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكدة',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">جاري تحميل الطلبات...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">إدارة الطلبات</h2>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'confirmed', 'shipped', 'delivered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-coffee-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'جميع الطلبات' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-bold text-gray-900">{order.orderNo}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-6 text-sm text-gray-600">
                      <span>البريد: {order.email}</span>
                      <span>الهاتف: {order.phone}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('ar-AE')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-coffee-600">د.إ {order.totalPrice}</p>
                    <ChevronDown
                      size={20}
                      className={`ml-4 mt-2 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">تفاصيل الطلب</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-700">
                          <span>{item.productName} × {item.quantity}</span>
                          <span>د.إ {(item.price * item.quantity).toLocaleString('ar-AE')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">بيانات التوصيل</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">العنوان:</span> {order.address}
                      </div>
                      {order.notes && (
                        <div>
                          <span className="font-medium">ملاحظات:</span> {order.notes}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">طريقة الدفع:</span>{' '}
                        {order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'Apple Pay'}
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">تحديث الحالة</h4>
                    <div className="flex gap-2 flex-wrap">
                      {(['pending', 'confirmed', 'shipped', 'delivered'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(order.id, status)}
                          disabled={order.status === status}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            order.status === status
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-coffee-600 text-white hover:bg-coffee-700'
                          }`}
                        >
                          {status === 'confirmed' && <Check size={16} />}
                          {status === 'shipped' && <Truck size={16} />}
                          {status === 'delivered' && <Package size={16} />}
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
