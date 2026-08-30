import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { WHATSAPP_NUMBER, type Product } from '@/data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onSetQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout?: () => void;
}

export function CartDrawer({ open, items, onClose, onSetQty, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const checkoutWhatsApp = () => {
    const lines = items
      .map((i) => `• ${i.product.name} (${i.product.size}) × ${i.qty} = ${i.product.price * i.qty} د.إ`)
      .join('\n');
    const message = `مرحباً، أود إتمام طلبي من snooffee:\n\n${lines}\n\nالإجمالي: ${total} د.إ`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
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
        ) : (
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
                {onCheckout && (
                  <>
                    <button
                      onClick={() => {
                        onCheckout();
                        onClose();
                      }}
                      className="w-full rounded-full bg-coffee-600 py-3.5 font-bold text-coffee-50 shadow-lg shadow-coffee-600/25 transition-colors hover:bg-coffee-700"
                    >
                      إتمام الشراء
                    </button>
                    <p className="text-center text-[11px] text-coffee-500">
                      ادفع بآمان باستخدام بطاقتك أو الدفع عند الاستلام
                    </p>
                  </>
                )}
                <button
                  onClick={checkoutWhatsApp}
                  className="w-full rounded-full bg-green-600 py-3.5 font-bold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
                >
                  {onCheckout ? 'أو ' : ''}إتمام الطلب عبر واتساب
                </button>
                <p className="text-center text-[11px] text-coffee-500">
                  سيتم تحويلك إلى واتساب لتأكيد طلبك
                </p>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
