import { ArrowLeft, Coffee, Star, Truck } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* خلفيات زخرفية */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-coffee-200/50 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-coffee-300/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        {/* النص */}
        <div className="animate-fade-up text-center lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-coffee-300 bg-white/70 px-4 py-1.5 text-sm font-medium text-coffee-700">
            <Coffee className="h-4 w-4 text-coffee-500" />
            تحميص طازج كل يوم
          </span>

          <h1 className="mt-6 text-4xl leading-[1.25] font-extrabold text-coffee-900 sm:text-5xl lg:text-[3.4rem]">
            قهوة تليق بمزاجك،
            <br />
            <span className="text-coffee-500">ومحاصيل</span> تُروى قصتها
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-coffee-700/80 lg:mx-0">
            في سنووفي ننتقي أفخر محاصيل القهوة من مزارع موثوقة حول العالم، ونحمّصها
            بعناية لتصل إلى فنجانك بكامل نكهتها ورائحتها.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#products"
              className="group inline-flex items-center gap-2 rounded-full bg-coffee-600 px-7 py-3.5 font-bold text-coffee-50 shadow-lg shadow-coffee-600/25 transition-all hover:bg-coffee-700 hover:shadow-coffee-700/30"
            >
              تسوّق الآن
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border-2 border-coffee-300 bg-white/60 px-7 py-3.5 font-bold text-coffee-800 transition-colors hover:border-coffee-400 hover:bg-white"
            >
              تعرّف على قصتنا
            </a>
          </div>

          {/* إحصائيات */}
          <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
            <div>
              <p className="font-display text-2xl font-extrabold text-coffee-900">+12</p>
              <p className="text-sm text-coffee-600">محصولاً مختاراً</p>
            </div>
            <div className="h-10 w-px bg-coffee-300" />
            <div>
              <p className="font-display text-2xl font-extrabold text-coffee-900">+2500</p>
              <p className="text-sm text-coffee-600">عميل سعيد</p>
            </div>
            <div className="h-10 w-px bg-coffee-300" />
            <div>
              <p className="flex items-center gap-1 font-display text-2xl font-extrabold text-coffee-900">
                4.9 <Star className="h-4 w-4 fill-coffee-400 text-coffee-400" />
              </p>
              <p className="text-sm text-coffee-600">تقييم عملائنا</p>
            </div>
          </div>
        </div>

        {/* التميمة */}
        <div className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-none" style={{ animationDelay: '0.15s' }}>
          <div className="relative mx-auto aspect-square max-w-[420px]">
            {/* دائرة الهوية */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coffee-300 via-coffee-400 to-coffee-600 shadow-2xl shadow-coffee-600/30" />
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-coffee-50/50" />

            <img
              src="/mascot.png"
              alt="تميمة سنووفي"
              className="animate-float absolute inset-0 m-auto w-[78%] object-contain drop-shadow-[0_18px_30px_rgba(58,38,23,0.35)]"
            />

            {/* شارات عائمة */}
            <div className="absolute -right-3 top-10 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg shadow-coffee-900/10 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coffee-100">
                <Coffee className="h-5 w-5 text-coffee-600" />
              </span>
              <span className="text-sm font-bold text-coffee-900">عربيكا 100%</span>
            </div>
            <div className="absolute -left-4 bottom-14 flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg shadow-coffee-900/10 backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coffee-100">
                <Truck className="h-5 w-5 text-coffee-600" />
              </span>
              <span className="text-sm font-bold text-coffee-900">توصيل سريع</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
