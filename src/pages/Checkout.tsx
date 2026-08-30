import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowRight, CreditCard, Banknote } from 'lucide-react';
import type { CartItem } from '@/sections/CartDrawer';
import { sendEmailNotification, getOrderConfirmationEmail } from '@/lib/email-service';
import { createOrder } from '@/lib/order-api';
import { AuthModal } from '@/sections/AuthModal';

const checkoutSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(7, 'رقم الهاتف غير صحيح'),
  address: z.string().min(5, 'العنوان مطلوب'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'apple_pay']),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

interface CheckoutProps {
  items: CartItem[];
  onCheckoutComplete: (order: any) => void;
  onCancel: () => void;
}

export function Checkout({ items, onCheckoutComplete, onCancel }: CheckoutProps) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shippingPrice = totalPrice > 200 ? 0 : 25;
  const finalTotal = totalPrice + shippingPrice;

  const handleAuthSuccess = (userData: { email: string; name?: string }) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const onSubmit = async (data: CheckoutData) => {
    setIsProcessing(true);
    try {
      const order = {
        id: Date.now().toString(),
        orderNo: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes || '',
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending' as const,
        status: 'pending' as const,
        totalPrice: finalTotal,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.qty,
          price: item.product.price,
        })),
        createdAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const currentUser = localStorage.getItem('user');
      let userData = { name: '', email: data.email };
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        userData = {
          ...parsedUser,
          phone: data.phone,
          address: data.address,
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      const createdOrder = createOrder({
        ...order,
      });

      const emailNotification = getOrderConfirmationEmail(createdOrder, userData);
      await sendEmailNotification(emailNotification);

      toast.success('تم تأكيد الطلب بنجاح! تحقق من بريدك الإلكتروني للتأكيد.');
      onCheckoutComplete(createdOrder);
      navigate('/dashboard');
    } catch (error) {
      toast.error('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-900 to-coffee-700 py-12 px-4 flex items-center justify-center" dir="rtl">
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(true)} onLoginSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-900 to-coffee-700 py-12 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-white hover:text-coffee-100 mb-6 transition-colors"
        >
          <ArrowRight size={20} />
          العودة
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-coffee-800 to-coffee-600 text-white p-8">
            <h1 className="text-3xl font-bold">إتمام الشراء</h1>
            <p className="text-coffee-100 mt-2">أدخل بيانات التوصيل والدفع</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4">ملخص الطلب</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm text-gray-700">
                    <span>{item.product.name} × {item.qty}</span>
                    <span>د.إ {(item.product.price * item.qty).toLocaleString('ar-AE')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-3 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>المجموع</span>
                  <span>د.إ {totalPrice.toLocaleString('ar-AE')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>الشحن {totalPrice > 200 ? '(مجاني)' : ''}</span>
                  <span className={totalPrice > 200 ? 'text-green-600 font-semibold' : ''}>
                    د.إ {shippingPrice.toLocaleString('ar-AE')}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-coffee-900 pt-2 border-t">
                  <span>الإجمالي</span>
                  <span>د.إ {finalTotal.toLocaleString('ar-AE')}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900">بيانات التوصيل</h2>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  placeholder="+971 50 000 0000"
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">العنوان</label>
                <textarea
                  {...register('address')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  placeholder="دبي، الإمارات"
                  rows={3}
                />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">ملاحظات إضافية (اختياري)</label>
                <textarea
                  {...register('notes')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
                  placeholder="أي ملاحظات أو تعليمات توصيل خاصة"
                  rows={2}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900">طريقة الدفع</h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-coffee-600 transition-colors"
                  style={selectedPaymentMethod === 'cod' ? { borderColor: 'var(--coffee-600)' } : {}}
                >
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value="cod"
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={20} className="text-coffee-600" />
                      <span className="font-semibold text-gray-900">الدفع عند الاستلام</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">ادفع عند استلام طلبك</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-coffee-600 transition-colors"
                  style={selectedPaymentMethod === 'apple_pay' ? { borderColor: 'var(--coffee-600)' } : {}}
                >
                  <input
                    type="radio"
                    {...register('paymentMethod')}
                    value="apple_pay"
                    className="mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-coffee-600" />
                      <span className="font-semibold text-gray-900">Apple Pay</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">ادفع بشكل آمن باستخدام Apple Pay</p>
                  </div>
                </label>
              </div>

              {errors.paymentMethod && <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-coffee-600 hover:bg-coffee-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {isProcessing ? 'جاري معالجة الطلب...' : `تأكيد الطلب - د.إ ${finalTotal.toLocaleString('ar-AE')}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
