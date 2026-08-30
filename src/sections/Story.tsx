import { BadgeCheck, Flame, HandHeart } from 'lucide-react';

const POINTS = [
  {
    icon: HandHeart,
    title: 'انتقاء يدوي',
    text: 'نختار المحاصيل من مزارع موثوقة ونتذوق كل دفعة قبل اعتمادها.',
  },
  {
    icon: Flame,
    title: 'تحميص طازج',
    text: 'نحمّص بكميات صغيرة يومياً لضمان وصول القهوة بكامل نكهتها.',
  },
  {
    icon: BadgeCheck,
    title: 'جودة موثقة',
    text: 'محاصيل عربيكا 100% بتقييمات تقيّم القهوة المختصة العالمية.',
  },
];

export function Story() {
  return (
    <section id="story" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        {/* الصور */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="overflow-hidden rounded-[2.5rem] shadow-2xl shadow-coffee-900/15">
            <img
              src="/images/story.jpg"
              alt="تحضير القهوة المقطرة"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-4 hidden w-48 overflow-hidden rounded-3xl border-4 border-coffee-50 shadow-xl sm:block">
            <img
              src="/images/brew.jpg"
              alt="أدوات تقطير القهوة"
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </div>
          {/* شارة الخبرة */}
          <div className="absolute -top-5 -right-3 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-coffee-600 text-coffee-50 shadow-lg">
            <span className="font-display text-2xl font-extrabold">+7</span>
            <span className="text-[11px] font-medium">سنوات شغف</span>
          </div>
        </div>

        {/* النص */}
        <div>
          <span className="text-sm font-bold tracking-wide text-coffee-500">قصتنا</span>
          <h2 className="mt-3 text-3xl font-extrabold leading-snug text-coffee-900 sm:text-4xl">
            من الكرزة إلى الفنجان…
            <br />
            رحلة نعيشها بشغف
          </h2>
          <p className="mt-5 leading-loose text-coffee-700/80">
            بدأت سنووفي من حبّ بسيط للقهوة، وتحوّل إلى رسالة: أن نوصل لكل بيت محاصيل
            قهوة استثنائية بسعر عادل. نسافر إلى المصدر، نبني علاقات مباشرة مع المزارعين،
            ونتذوق مئات الأكواب سنوياً لنختار لكم الأفضل فقط.
          </p>

          <div className="mt-8 space-y-5">
            {POINTS.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coffee-100 text-coffee-600">
                  <p.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-coffee-900">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-coffee-700/75">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
