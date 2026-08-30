import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

const LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#products', label: 'المنتجات' },
  { href: '#story', label: 'قصتنا' },
  { href: '#features', label: 'لماذا نحن' },
  { href: '#contact', label: 'تواصل معنا' },
];

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-coffee-50/90 shadow-[0_2px_20px_rgba(58,38,23,0.08)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* الشعار */}
        <a href="#home" className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-coffee-600 shadow-md ring-2 ring-coffee-300">
            <img src="/mascot.png" alt="تميمة سنووفي" className="h-9 w-9 object-contain pt-1" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-extrabold tracking-tight text-coffee-900">
              snooffee
            </span>
            <span className="block text-[11px] font-medium text-coffee-500">قهوة ومحاصيل مختصة</span>
          </span>
        </a>

        {/* الروابط - سطح المكتب */}
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-coffee-700 transition-colors hover:text-coffee-500"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* زر السلة */}
          <button
            onClick={onOpenCart}
            aria-label="سلة المشتريات"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-coffee-600 text-coffee-50 shadow-md transition-transform hover:scale-105 hover:bg-coffee-700"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-coffee-900 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* زر القائمة - الجوال */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="القائمة"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-coffee-200 bg-white/70 text-coffee-800 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* قائمة الجوال */}
      {menuOpen && (
        <div className="border-t border-coffee-200 bg-coffee-50/95 backdrop-blur-md lg:hidden">
          <ul className="space-y-1 px-6 py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2.5 font-medium text-coffee-800 transition-colors hover:bg-coffee-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
