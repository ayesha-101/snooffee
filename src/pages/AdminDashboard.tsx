import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Grid3x3, LogOut, Phone, ShoppingCart, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Admin as AdminProducts } from './Admin';
import { AdminCategories } from './AdminCategories';
import { AdminContact } from './AdminContact';
import { AdminOrders } from './AdminOrders';
import { AdminStatistics } from './AdminStatistics';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'contact' | 'orders' | 'statistics'>('statistics');

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-coffee-900/30 bg-gradient-to-r from-coffee-900 to-coffee-800 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white">لوحة التحكم</h1>
              <p className="mt-2 text-coffee-200">سنووفي - إدارة المتجر</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition-colors shadow-lg"
            >
              <LogOut size={20} />
              تسجيل خروج
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-coffee-900/30 bg-gray-800/50 backdrop-blur overflow-x-auto sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 min-w-max md:min-w-0">
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold transition-all whitespace-nowrap rounded-t-lg ${
                activeTab === 'statistics'
                  ? 'bg-coffee-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <BarChart3 size={20} />
              الإحصائيات
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold transition-all whitespace-nowrap rounded-t-lg ${
                activeTab === 'orders'
                  ? 'bg-coffee-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <ShoppingCart size={20} />
              الطلبات
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold transition-all whitespace-nowrap rounded-t-lg ${
                activeTab === 'products'
                  ? 'bg-coffee-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Package size={20} />
              المنتجات
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold transition-all whitespace-nowrap rounded-t-lg ${
                activeTab === 'categories'
                  ? 'bg-coffee-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Grid3x3 size={20} />
              الأقسام
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-2 px-4 py-4 font-semibold transition-all whitespace-nowrap rounded-t-lg ${
                activeTab === 'contact'
                  ? 'bg-coffee-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Phone size={20} />
              بيانات الاتصال
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen pb-12">
        <div className="animate-fade-in">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'statistics' && <AdminStatistics />}
          {activeTab === 'contact' && <AdminContact />}
        </div>
      </div>
    </div>
  );
}
