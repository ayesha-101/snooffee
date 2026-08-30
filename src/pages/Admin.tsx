import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import type { Product } from '@/data/products';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const productSchema = z.object({
  id: z.string().min(1, 'معرّف المنتج مطلوب'),
  name: z.string().min(1, 'الاسم مطلوب'),
  desc: z.string().min(1, 'الوصف مطلوب'),
  notes: z.string().min(1, 'الملاحظات مطلوبة'),
  roast: z.string().min(1, 'درجة التحميص مطلوبة'),
  size: z.string().min(1, 'الحجم مطلوب'),
  price: z.number().positive('السعر يجب أن يكون أكبر من 0'),
  image: z.string().url('رابط الصورة غير صحيح'),
  category: z.enum(['crops', 'blends', 'drinks']),
  badge: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function Admin() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editingId
      ? products.find((p) => p.id === editingId)
      : {
          id: '',
          name: '',
          desc: '',
          notes: '',
          roast: '',
          size: '',
          price: 0,
          image: '',
          category: 'crops',
          badge: '',
        },
  });

  const stats = useMemo(() => {
    return {
      total: products.length,
      crops: products.filter((p) => p.category === 'crops').length,
      blends: products.filter((p) => p.category === 'blends').length,
      drinks: products.filter((p) => p.category === 'drinks').length,
    };
  }, [products]);

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      Object.keys(product).forEach((key) => {
        setValue(key as keyof ProductFormData, product[key as keyof Product] as any);
      });
    } else {
      setEditingId(null);
      reset({
        id: '',
        name: '',
        desc: '',
        notes: '',
        roast: '',
        size: '',
        price: 0,
        image: '',
        category: 'crops',
        badge: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingId) {
      setProducts(
        products.map((p) => (p.id === editingId ? (data as Product) : p))
      );
      toast.success(`تم تحديث «${data.name}» بنجاح`);
    } else {
      if (products.some((p) => p.id === data.id)) {
        toast.error('معرّف المنتج موجود بالفعل');
        return;
      }
      setProducts([...products, data as Product]);
      toast.success(`تم إضافة «${data.name}» بنجاح`);
    }
    closeModal();
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (confirm(`هل تريد حذف «${product?.name}»؟`)) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success(`تم حذف المنتج بنجاح`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="mt-2 text-gray-600">إدارة منتجات القهوة</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'إجمالي المنتجات', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'المحاصيل', value: stats.crops, color: 'bg-green-50 text-green-700' },
            { label: 'الخلطات', value: stats.blends, color: 'bg-amber-50 text-amber-700' },
            { label: 'المشروبات', value: stats.drinks, color: 'bg-orange-50 text-orange-700' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-lg ${stat.color} p-6 text-center`}
            >
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="mt-2 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-lg bg-coffee-600 px-6 py-3 font-semibold text-white hover:bg-coffee-700 transition-colors"
          >
            <Plus size={20} />
            إضافة منتج جديد
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الفئة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحجم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">السعر</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {CATEGORIES.find((c) => c.key === product.category)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.size}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.price} د.إ</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      معرّف المنتج *
                    </label>
                    <input
                      type="text"
                      {...register('id')}
                      disabled={!!editingId}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 disabled:bg-gray-100"
                      placeholder="مثال: ethiopia"
                    />
                    {errors.id && (
                      <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      اسم المنتج *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: إثيوبيا يرغاتشيف"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">
                      الوصف *
                    </label>
                    <textarea
                      {...register('desc')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      rows={2}
                      placeholder="وصف تفصيلي للمنتج"
                    />
                    {errors.desc && (
                      <p className="mt-1 text-sm text-red-600">{errors.desc.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">
                      الملاحظات (النكهات) *
                    </label>
                    <input
                      type="text"
                      {...register('notes')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: ياسمين • خوخ • عسل"
                    />
                    {errors.notes && (
                      <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      درجة التحميص *
                    </label>
                    <input
                      type="text"
                      {...register('roast')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: تحميص فاتح"
                    />
                    {errors.roast && (
                      <p className="mt-1 text-sm text-red-600">{errors.roast.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      الحجم *
                    </label>
                    <input
                      type="text"
                      {...register('size')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: 250 غ"
                    />
                    {errors.size && (
                      <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      السعر (د.إ) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: 88"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      الفئة *
                    </label>
                    <select
                      {...register('category')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                    >
                      <option value="crops">المحاصيل</option>
                      <option value="blends">الخلطات</option>
                      <option value="drinks">المشروبات</option>
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">
                      رابط الصورة *
                    </label>
                    <input
                      type="url"
                      {...register('image')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: /images/p-ethiopia.jpg"
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">
                      شارة (اختياري)
                    </label>
                    <input
                      type="text"
                      {...register('badge')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: محصول مميز"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-coffee-600 py-2 font-semibold text-white hover:bg-coffee-700 transition-colors"
                  >
                    {editingId ? 'تحديث المنتج' : 'إضافة المنتج'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
