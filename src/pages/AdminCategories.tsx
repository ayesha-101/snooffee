import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  image: string;
  desc?: string;
}

const categorySchema = z.object({
  id: z.string().min(1, 'معرّف القسم مطلوب'),
  name: z.string().min(1, 'اسم القسم مطلوب'),
  image: z.string().min(1, 'الصورة مطلوبة'),
  desc: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'crops',
    name: 'المحاصيل',
    image: '/images/crops.jpg',
    desc: 'محاصيل قهوة مختارة من حول العالم',
  },
  {
    id: 'blends',
    name: 'الخلطات',
    image: '/images/blends.jpg',
    desc: 'خلطات سنووفي الحصرية',
  },
  {
    id: 'drinks',
    name: 'المشروبات',
    image: '/images/drinks.jpg',
    desc: 'مشروبات قهوة جاهزة',
  },
];

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: '',
      name: '',
      image: '',
      desc: '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('image', result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setImagePreview(category.image);
      Object.keys(category).forEach((key) => {
        setValue(key as keyof CategoryFormData, category[key as keyof Category] as any);
      });
    } else {
      setEditingId(null);
      setImagePreview(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImagePreview(null);
    reset();
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingId) {
      setCategories(
        categories.map((c) => (c.id === editingId ? (data as Category) : c))
      );
      toast.success(`تم تحديث «${data.name}» بنجاح`);
    } else {
      if (categories.some((c) => c.id === data.id)) {
        toast.error('معرّف القسم موجود بالفعل');
        return;
      }
      setCategories([...categories, data as Category]);
      toast.success(`تم إضافة «${data.name}» بنجاح`);
    }
    closeModal();
  };

  const deleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (confirm(`هل تريد حذف «${category?.name}»؟`)) {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success(`تم حذف القسم بنجاح`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الأقسام</h1>
          <p className="mt-2 text-gray-600">أضف وعدّل وحذف أقسام المنتجات</p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="rounded-lg bg-blue-50 p-6 text-blue-700">
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="mt-2 text-sm font-medium">إجمالي الأقسام</div>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-lg bg-coffee-600 px-6 py-3 font-semibold text-white hover:bg-coffee-700 transition-colors"
          >
            <Plus size={20} />
            إضافة قسم جديد
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{category.desc || 'بدون وصف'}</p>
                <p className="mt-2 text-xs text-gray-500">ID: {category.id}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'تعديل القسم' : 'إضافة قسم جديد'}
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
                      معرّف القسم *
                    </label>
                    <input
                      type="text"
                      {...register('id')}
                      disabled={!!editingId}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 disabled:bg-gray-100"
                      placeholder="مثال: crops"
                    />
                    {errors.id && (
                      <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      اسم القسم *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      placeholder="مثال: المحاصيل"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">
                      الصورة *
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      />
                      {errors.image && (
                        <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">معاينة الصورة:</p>
                        <img
                          src={imagePreview}
                          alt="معاينة"
                          className="h-32 w-full rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-900">
                      الوصف (اختياري)
                    </label>
                    <textarea
                      {...register('desc')}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                      rows={2}
                      placeholder="وصف القسم"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-coffee-600 py-2 font-semibold text-white hover:bg-coffee-700 transition-colors"
                  >
                    {editingId ? 'تحديث القسم' : 'إضافة القسم'}
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
