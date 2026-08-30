import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Navbar } from '@/sections/Navbar';
import { Hero } from '@/sections/Hero';
import { Products } from '@/sections/Products';
import { Story } from '@/sections/Story';
import { Features } from '@/sections/Features';
import { Footer } from '@/sections/Footer';
import { CartDrawer, type CartItem } from '@/sections/CartDrawer';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { Auth } from '@/pages/Auth';
import { CustomerDashboard } from '@/pages/CustomerDashboard';
import { Checkout } from '@/pages/Checkout';
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

interface HomePageProps {
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  onCheckout: () => void;
}

function HomePage({ cart, setCart, cartOpen, setCartOpen, onCheckout }: HomePageProps) {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.map((i) => ({ id: i.product.id, qty: i.qty }))));
  }, [cart]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const addToCart = (product: Product) => {
    setCart((prev: CartItem[]) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`أُضيف «${product.name}» إلى السلة`);
  };

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
    </div>
  );
}

interface AuthState {
  isLoggedIn: boolean;
  user: { email: string; name?: string } | null;
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const user = localStorage.getItem('user');
    return {
      isLoggedIn: !!user,
      user: user ? JSON.parse(user) : null,
    };
  });

  const handleLoginSuccess = (user: { email: string; name?: string }) => {
    setAuth({ isLoggedIn: true, user });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuth({ isLoggedIn: false, user: null });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={auth.isLoggedIn ? <HomePageWrapper /> : <Auth onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Toaster position="bottom-center" dir="rtl" richColors />
    </>
  );
}

function HomePageWrapper() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <HomePage
        cart={cart}
        setCart={setCart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onCheckout={() => navigate('/checkout')}
      />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onSetQty={(id, qty) => setQty(id, qty, cart, setCart)}
        onRemove={(id) => removeItem(id, cart, setCart)}
        onCheckout={() => navigate('/checkout')}
      />
    </>
  );
}

function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const navigate = useNavigate();

  return (
    <Checkout
      items={cart}
      onCheckoutComplete={(order) => {
        setCart([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }}
      onCancel={() => navigate('/')}
    />
  );
}

function setQty(id: string, qty: number, cart: CartItem[], setCart: (items: CartItem[]) => void) {
  setCart(
    qty <= 0
      ? cart.filter((i) => i.product.id !== id)
      : cart.map((i) => (i.product.id === id ? { ...i, qty } : i)),
  );
}

function removeItem(id: string, cart: CartItem[], setCart: (items: CartItem[]) => void) {
  setCart(cart.filter((i) => i.product.id !== id));
}
}
