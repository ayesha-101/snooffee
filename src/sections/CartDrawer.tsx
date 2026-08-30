import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X, CreditCard, Banknote } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { WHATSAPP_NUMBER, type Product } from '@/data/products';
import { sendEmailNotification, getOrderConfirmationEmail } from '@/lib/email-service';
import { createOrder } from '@/lib/order-api';

export interface CartItem {
  product: Product;
  qty: number;
}

const checkoutSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().min(7, 'رقم الهاتف غير صحيح'),
  address: z.string().min(5, 'العنوان مطلوب'),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'apple_pay']),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout?: () => void;
}

export function CartDrawer({ open, items, onClose, onSetQty, onRemove }: CartDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shippingPrice = total > 200 ? 0 : 25;
  const finalTotal = total + shippingPrice;

  const checkoutWhatsApp = () => {
    const lines = items
      .map((i) => `• ${i.product.name} (${i.product.size}) × ${i.qty} = ${i.product.price * i.qty} د.إ`)
      .join('\n');
    const message = `مرحباً، أود إتمام طلبي من snooffee:\n\n${lines}\n\nالإجمالي: ${total} د.إ`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const onSubmitCheckout = async (data: CheckoutData) => {
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const createdOrder = createOrder(order);

      const userData = {
        email: data.email,
        phone: data.phone,
        address: data.address,
      };

      const emailNotification = getOrderConfirmationEmail(createdOrder, userData);
      await sendEmailNotification(emailNotification);

      toast.success('تم تأكيد الطلب بنجاح! تحقق من بريدك الإلكتروني.');
      reset();
      setShowCheckout(false);
      onClose();
    } catch (error) {
      toast.error('حدث خطأ أثناء معالجة الطلب');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* الخلفية */}
      <button
        aria-label="إغلاق السلة"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-coffee-900/50 backdrop-blur-sm"
      />

      {/* الدرج */}
      <aside className="animate-slide-in-left absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-coffee-50 shadow-2xl">
        {/* الرأس */}
        <div className="flex items-center justify-between border-b border-coffee-200 px-6 py-5">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-coffee-900">
            <ShoppingBag className="h-5 w-5 text-coffee-600" />
            سلة المشتريات
          </h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 items-center justify-center rounded-full text-coffee-600 transition-colors hover:bg-coffee-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* المحتوى */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-coffee-100">
              <ShoppingBag className="h-9 w-9 text-coffee-400" />
            </span>
            <p className="font-bold text-coffee-900">سلتك فارغة</p>
            <p className="text-sm text-coffee-600">تصفّح تشكيلتنا وأضف ما يعجبك من المحاصيل والخلطات.</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full bg-coffee-600 px-6 py-3 text-sm font-bold text-coffee-50 transition-colors hover:bg-coffee-700"
            >
              ابدأ التسوق
            </button>
          </div>
        ) : !showCheckout ? (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex gap-4 rounded-2xl border border-coffee-200/70 bg-white p-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-coffee-900">{product.name}</h3>
                        <p className="text-xs text-coffee-500">{product.size}</p>
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        aria-label="حذف المنتج"
                        className="text-coffee-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-full border border-coffee-200 bg-coffee-50 px-1.5 py-1">
                        <button
                          onClick={() => onSetQty(product.id, qty + 1)}
                          aria-label="زيادة الكمية"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-coffee-700 hover:bg-coffee-200"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[20px] text-center text-sm font-bold text-coffee-900">{qty}</span>
                        <button
                          onClick={() => onSetQty(product.id, qty - 1)}
                          aria-label="إنقاص الكمية"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-coffee-700 hover:bg-coffee-200"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-extrabold text-coffee-900">
                        {product.price * qty} <span className="text-xs font-bold text-coffee-500">د.إ</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* التذييل */}
            <div className="border-t border-coffee-200 bg-white px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-coffee-700">الإجمالي</span>
                <span className="font-display text-2xl font-extrabold text-coffee-900">
                  {total} <span className="text-sm font-bold text-coffee-500">د.إ</span>
                </span>
              </div>
              <p className="mt-1 text-xs text-coffee-500">شحن مجاني للطلبات فوق 200 د.إ</p>
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full rounded-full bg-coffee-600 py-3.5 font-bold text-coffee-50 shadow-lg shadow-coffee-600/25 transition-colors hover:bg-coffee-700"
                >
                  إتمام الشراء
                </button>
                <p className="text-center text-[11px] text-coffee-500">
                  ادفع بآمان باستخدام بطاقتك أو الدفع عند الاستلام
                </p>
                <button
                  onClick={checkoutWhatsApp}
                  className="w-full rounded-full bg-green-600 py-3.5 font-bold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
                >
                  أو إتمام الطلب عبر واتساب
                </button>
                <p className="text-center text-[11px] text-coffee-500">
                  سيتم تحويلك إلى واتساب لتأكيد طلبك
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Checkout Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <button
                onClick={() => setShowCheckout(false)}
                className="mb-4 text-coffee-600 hover:text-coffee-700 font-medium text-sm flex items-center gap-1"
              >
                ← العودة إلى السلة
              </button>

              <form onSubmit={handleSubmit(onSubmitCheckout)} className="space-y-4">
                {/* Order Summary */}
                <div className="bg-coffee-50 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-coffee-900 mb-3">ملخص الطلب</h3>
                  <div className="space-y-2 mb-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm text-coffee-700">
                        <span>{item.product.name} × {item.qty}</span>
                        <span>د.إ {(item.product.price * item.qty).toLocaleString('ar-AE')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-coffee-200 pt-2 space-y-1 text-sm">
                    <div className="flex justify-between text-coffee-700">
                      <span>المجموع</span>
                      <span>د.إ {total.toLocaleString('ar-AE')}</span>
                    </div>
                    <div className="flex justify-between text-coffee-700">
                      <span>الشحن {total > 200 ? '(مجاني)' : ''}</span>
                      <span className={total > 200 ? 'text-green-600 font-semibold' : ''}>
                        د.إ {shippingPrice.toLocaleString('ar-AE')}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-coffee-900 pt-2 border-t">
                      <span>الإجمالي</span>
                      <span>د.إ {finalTotal.toLocaleString('ar-AE')}</span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-sm text-coffee-900"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-sm text-coffee-900"
                    placeholder="+971 50 000 0000"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-1">العنوان</label>
                  <textarea
                    {...register('address')}
                    className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-sm text-coffee-900"
                    placeholder="دبي، الإمارات"
                    rows={2}
                  />
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-1">ملاحظات (اختياري)</label>
                  <textarea
                    {...register('notes')}
                    className="w-full rounded-lg border border-coffee-200 px-3 py-2 text-sm text-coffee-900"
                    placeholder="أي ملاحظات أو تعليمات توصيل خاصة"
                    rows={2}
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-coffee-900 mb-2">طريقة الدفع</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-coffee-200 rounded-lg cursor-pointer hover:bg-coffee-50"
                      style={selectedPaymentMethod === 'cod' ? { borderColor: 'var(--coffee-600)', backgroundColor: '#FEF3EB' } : {}}
                    >
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="cod"
                        className="ml-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote size={16} className="text-coffee-600" />
                          <span className="font-semibold text-sm text-coffee-900">الدفع عند الاستلام</span>
                        </div>
                        <p className="text-xs text-coffee-600 mt-1">ادفع عند استلام طلبك</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-coffee-200 rounded-lg cursor-pointer hover:bg-coffee-50"
                      style={selectedPaymentMethod === 'apple_pay' ? { borderColor: 'var(--coffee-600)', backgroundColor: '#FEF3EB' } : {}}
                    >
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="apple_pay"
                        className="ml-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-coffee-600" />
                          <span className="font-semibold text-sm text-coffee-900">Apple Pay</span>
                        </div>
                        <p className="text-xs text-coffee-600 mt-1">ادفع بشكل آمن</p>
                      </div>
                    </label>
                  </div>
                  {errors.paymentMethod && <p className="text-xs text-red-600 mt-1">{errors.paymentMethod.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-coffee-600 hover:bg-coffee-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors mt-4"
                >
                  {isProcessing ? 'جاري معالجة الطلب...' : `تأكيد الطلب - د.إ ${finalTotal.toLocaleString('ar-AE')}`}
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
