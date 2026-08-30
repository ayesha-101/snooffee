import { Leaf, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const FEATURES = [
  {
    icon: Leaf,
    title: 'محاصيل مختارة',
    text: 'عربيكا 100% من أفضل المزارع في إثيوبيا وكولومبيا والبرازيل واليمن.',
  },
  {
    icon: Truck,
    title: 'توصيل سريع',
    text: 'نشحن طلبك خلال 24 ساعة ليصلك البن طازجاً أينما كنت.',
  },
  {
    icon: ShieldCheck,
    title: 'دفع آمن',
    text: 'خيارات دفع متعددة وموثوقة تحمي بياناتك في كل عملية شراء.',
  },
  {
    icon: RotateCcw,
    title: 'استرجاع مرن',
    text: 'لم يعجبك المحصول؟ نستبدله أو نعيد قيمته خلال 14 يوماً.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-coffee-800 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold tracking-wide text-coffee-300">لماذا سنووفي؟</span>
          <h2 className="mt-3 text-3xl font-extrabold text-coffee-50 sm:text-4xl">
            تجربة قهوة متكاملة من أول رشفة
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-coffee-700 bg-coffee-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-coffee-500"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coffee-700 text-coffee-200">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-coffee-50">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-coffee-200/80">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
