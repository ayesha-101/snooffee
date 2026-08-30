import { Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-coffee-900 pt-16 pb-8 text-coffee-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* الشعار والنبذة */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-coffee-50 ring-2 ring-coffee-700">
                <img src="/mascot.png" alt="تميمة سنووفي" className="h-9 w-9 object-contain pt-1" />
              </span>
              <span className="font-display text-2xl font-extrabold text-coffee-50">snooffee</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-coffee-300">
              وجهتك الأولى لمحاصيل القهوة المختصة — انتقاء يدوي، تحميص يومي، وتجربة
              تستحق كل رشفة.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="انستغرام"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee-800 text-coffee-200 transition-colors hover:bg-coffee-600 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="تويتر"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-coffee-800 text-coffee-200 transition-colors hover:bg-coffee-600 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="font-bold text-coffee-50">روابط سريعة</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: '#home', label: 'الرئيسية' },
                { href: '#products', label: 'المنتجات' },
                { href: '#story', label: 'قصتنا' },
                { href: '#features', label: 'لماذا نحن' },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-coffee-300 transition-colors hover:text-coffee-100">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* التواصل */}
          <div>
            <h3 className="font-bold text-coffee-50">تواصل معنا</h3>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-coffee-400" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-coffee-400" />
                <span>hello@snooffee.coffee</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-coffee-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-coffee-800 pt-6 text-center text-xs text-coffee-400">
          <p>© {new Date().getFullYear()} snooffee — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
