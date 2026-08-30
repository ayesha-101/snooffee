import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Navbar } from '@/sections/Navbar';
import { Hero } from '@/sections/Hero';
import { Products } from '@/sections/Products';
import { Story } from '@/sections/Story';
import { Features } from '@/sections/Features';
import { Footer } from '@/sections/Footer';
import { CartDrawer, type CartItem } from '@/sections/CartDrawer';
import { Admin } from '@/pages/Admin';
import { PRODUCTS, type Product } from '@/data/products';

const MARQUEE_ITEMS = [
  'تحميص طازج يومياً',
  'محاصيل عربيكا 100%',
  'شحن مجاني فوق 200 د.إ',
  'توصيل في دبي والإمارات',
  'خلطات سنووفي الخاصة',
  'تقطير بارد جاهز',
];

const STORAGE_KEY = 'snooffee-cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: { id: string; qty: number }[] = JSON.parse(raw);
    return parsed
      .map((i) => {
        const product = PRODUCTS.find((p) => p.id === i.id);
        return product ? { product, qty: i.qty } : null;
      })
      .filter((i): i is CartItem => i !== null);
  } catch {
    return [];
  }
}

function HomePage() {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.map((i) => ({ id: i.product.id, qty: i.qty }))));
  }, [cart]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`أُضيف «${product.name}» إلى السلة`);
  };

  const setQty = (id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product.id !== id)
        : prev.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  return (
    <div className="min-h-screen bg-coffee-50">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main>
        <Hero />

        {/* شريط متحرك */}
        <div className="overflow-hidden border-y border-coffee-200 bg-coffee-600 py-3.5" dir="ltr">
          <div className="animate-marquee flex w-max items-center gap-8">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap text-sm font-bold text-coffee-100">
                {item}
                <span className="h-1.5 w-1.5 rounded-full bg-coffee-300" />
              </span>
            ))}
          </div>
        </div>

        <Products onAdd={addToCart} />
        <Story />
        <Features />
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onSetQty={setQty}
        onRemove={removeItem}
      />

      <Toaster position="bottom-center" dir="rtl" richColors />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster position="bottom-center" dir="rtl" richColors />
    </BrowserRouter>
  );
}
