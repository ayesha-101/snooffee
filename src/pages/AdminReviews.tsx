import { useState } from 'react';
import { Star, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      productId: '1',
      productName: 'كولومبيا سوبريمو',
      customerEmail: 'customer@example.com',
      rating: 5,
      comment: 'منتج رائع جداً، جودة عالية وطعم ممتاز!',
      date: new Date().toISOString(),
      approved: true,
    },
    {
      id: '2',
      productId: '2',
      productName: 'إثيوبيا يرجاتشيفي',
      customerEmail: 'user@example.com',
      rating: 4,
      comment: 'جيد جداً، التوصيل سريع',
      date: new Date(Date.now() - 86400000).toISOString(),
      approved: false,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: true } : r)));
    toast.success('تم قبول المراجعة');
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success('تم حذف المراجعة');
  };

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">إدارة المراجعات</h2>
        <p className="text-gray-400">إدارة تقييمات ومراجعات العملاء</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-3">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">إجمالي المراجعات</p>
          <p className="text-3xl font-bold text-white">{reviews.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">متوسط التقييم</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-yellow-400">{averageRating}</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(Number(averageRating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">في انتظار الموافقة</p>
          <p className="text-3xl font-bold text-orange-400">{reviews.filter((r) => !r.approved).length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-coffee-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {f === 'all' && 'الكل'}
            {f === 'pending' && 'في الانتظار'}
            {f === 'approved' && 'موافق عليها'}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{review.productName}</h3>
                <p className="text-sm text-gray-400">{review.customerEmail}</p>
              </div>
              <div className="flex gap-2">
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <CheckCircle size={16} />
                    قبول
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-semibold">{review.rating}/5</span>
              {!review.approved && <span className="ml-auto px-3 py-1 bg-orange-600/30 text-orange-300 text-xs rounded-full">في الانتظار</span>}
              {review.approved && <span className="ml-auto px-3 py-1 bg-green-600/30 text-green-300 text-xs rounded-full">موافق عليها</span>}
            </div>

            {/* Comment */}
            <p className="text-gray-300 mb-3">{review.comment}</p>

            {/* Date */}
            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('ar-AE')}</p>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">لا توجد مراجعات</p>
        </div>
      )}
    </div>
  );
}
