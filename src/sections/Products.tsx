import { useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { CATEGORIES, PRODUCTS, type Category, type Product } from '@/data/products';

interface ProductsProps {
  onAdd: (product: Product) => void;
}

export function Products({ onAdd }: ProductsProps) {
  const [active, setActive] = useState<Category>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active],
  );

  const handleAdd = (p: Product) => {
    onAdd(p);
    setAddedId(p.id);
    window.setTimeout(() => setAddedId((id) => (id === p.id ? null : id)), 1200);
  };

  return (
    <section id="products" className="bg-coffee-100/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* العنوان */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold tracking-wide text-coffee-500">تشكيلتنا</span>
          <h2 className="mt-3 text-3xl font-extrabold text-coffee-900 sm:text-4xl">
            محاصيل وخلطات مختارة بعناية
          </h2>
          <p className="mt-4 leading-relaxed text-coffee-700/80">
            كل محصول يمر بتذوق دقيق قبل أن يصل إليك — اختر ما يناسب ذوقك من المحاصيل
            المفردة أو خلطاتنا الخاصة.
          </p>
        </div>

        {/* التصنيفات */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                active === c.key
                  ? 'bg-coffee-600 text-coffee-50 shadow-md shadow-coffee-600/25'
                  : 'border border-coffee-300 bg-white/70 text-coffee-700 hover:border-coffee-400 hover:bg-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* الشبكة */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group overflow-hidden rounded-3xl border border-coffee-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-coffee-900/10"
            >
              {/* الصورة */}
              <div className="relative aspect-[4/3] overflow-hidden bg-coffee-100">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.badge && (
                  <span className="absolute top-3 right-3 rounded-full bg-coffee-900/90 px-3 py-1 text-xs font-bold text-coffee-100 backdrop-blur">
                    {p.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-coffee-700 backdrop-blur">
                  {p.roast}
                </span>
              </div>

              {/* المحتوى */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-coffee-900">{p.name}</h3>
                  <span className="shrink-0 rounded-lg bg-coffee-100 px-2 py-1 text-xs font-bold text-coffee-600">
                    {p.size}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-coffee-700/75">{p.desc}</p>
                <p className="mt-2 text-xs font-medium text-coffee-500">{p.notes}</p>

                <div className="mt-4 flex items-center justify-between border-t border-dashed border-coffee-200 pt-4">
                  <p className="font-display text-xl font-extrabold text-coffee-900">
                    {p.price}
                    <span className="mr-1 text-sm font-bold text-coffee-500">ر.س</span>
                  </p>
                  <button
                    onClick={() => handleAdd(p)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
                      addedId === p.id
                        ? 'bg-green-600 text-white'
                        : 'bg-coffee-600 text-coffee-50 hover:bg-coffee-700'
                    }`}
                  >
                    {addedId === p.id ? (
                      <>
                        <Check className="h-4 w-4" /> تمت الإضافة
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> أضف للسلة
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
