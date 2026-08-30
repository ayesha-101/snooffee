import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  lowStockThreshold: number;
  image: string;
}

export function AdminInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(
    PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      sku: `SKU-${p.id.toUpperCase()}`,
      stock: Math.floor(Math.random() * 100) + 5,
      price: p.price,
      category: p.category,
      lowStockThreshold: 10,
      image: p.image,
    }))
  );

  const lowStockItems = useMemo(() => {
    return inventoryItems.filter((item) => item.stock <= item.lowStockThreshold);
  }, [inventoryItems]);

  const totalValue = useMemo(() => {
    return inventoryItems.reduce((sum, item) => sum + item.stock * item.price, 0);
  }, [inventoryItems]);

  const handleStockUpdate = (id: string, newStock: number) => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, newStock) } : item
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">إدارة المخزون</h2>
        <p className="text-gray-400">تتبع الأسهم والمنتجات</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-3">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">إجمالي المنتجات</p>
          <p className="text-3xl font-bold text-white">{inventoryItems.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">قيمة المخزون</p>
          <p className="text-3xl font-bold text-green-400">د.إ {totalValue.toLocaleString('ar-AE')}</p>
        </div>
        <div className="bg-red-900/30 rounded-lg p-6 border border-red-700">
          <p className="text-sm text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle size={16} />
            منتجات بمخزون منخفض
          </p>
          <p className="text-3xl font-bold text-red-400">{lowStockItems.length}</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="mb-8 bg-red-900/20 border border-red-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            تنبيهات المخزون المنخفض
          </h3>
          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-sm text-red-400">المخزون: {item.stock} وحدة فقط</p>
                </div>
                <button className="px-4 py-2 bg-coffee-600 hover:bg-coffee-700 text-white rounded text-sm">
                  إعادة تعبئة
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">المنتج</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">SKU</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">المخزون</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">السعر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">القيمة الإجمالية</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-white">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.sku}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.stock <= item.lowStockThreshold
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-green-900/50 text-green-300'
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">د.إ {item.price}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-400">
                    د.إ {(item.stock * item.price).toLocaleString('ar-AE')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStockUpdate(item.id, item.stock + 1)}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleStockUpdate(item.id, item.stock - 1)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                      >
                        -
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
