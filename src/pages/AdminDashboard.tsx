import { useState } from 'react';
import { Package, Grid3x3, LogOut } from 'lucide-react';
import { Admin as AdminProducts } from './Admin';
import { AdminCategories } from './AdminCategories';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم - سنووفي</h1>
              <p className="mt-1 text-gray-600">إدارة المنتجات والأقسام</p>
            </div>
            <button
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              تسجيل خروج
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 font-semibold transition-colors ${
                activeTab === 'products'
                  ? 'border-coffee-600 text-coffee-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package size={20} />
              المنتجات
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 border-b-2 px-4 py-4 font-semibold transition-colors ${
                activeTab === 'categories'
                  ? 'border-coffee-600 text-coffee-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 size={20} />
              الأقسام
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
      </div>
    </div>
  );
}
