export type Category = 'all' | 'crops' | 'blends' | 'drinks';

export interface Product {
  id: string;
  name: string;
  desc: string;
  notes: string;
  roast: string;
  size: string;
  price: number;
  image: string;
  category: Exclude<Category, 'all'>;
  badge?: string;
}

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'crops', label: 'المحاصيل' },
  { key: 'blends', label: 'الخلطات' },
  { key: 'drinks', label: 'المشروبات' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'ethiopia',
    name: 'إثيوبيا يرغاتشيف',
    desc: 'محصول إثيوبي فاخر من مرتفعات يرغاتشيف، معالج بالتجفيف الطبيعي.',
    notes: 'ياسمين • خوخ • عسل',
    roast: 'تحميص فاتح',
    size: '250 غ',
    price: 88,
    image: '/images/p-ethiopia.jpg',
    category: 'crops',
    badge: 'محصول مميز',
  },
  {
    id: 'colombia',
    name: 'كولومبيا سوبرمو',
    desc: 'بن كولومبي متوازن من مزارع هويلا، حلاوة عالية وقوام مخملي.',
    notes: 'كراميل • شوكولاتة • برتقال',
    roast: 'تحميص وسط',
    size: '250 غ',
    price: 76,
    image: '/images/p-colombia.jpg',
    category: 'crops',
  },
  {
    id: 'brazil',
    name: 'البرازيل سانتوس',
    desc: 'محصول برازيلي كلاسيكي، مثالي للإسبريسو والمشروبات بالحليب.',
    notes: 'مكسرات • كاكاو • سكر بني',
    roast: 'تحميص وسط داكن',
    size: '250 غ',
    price: 68,
    image: '/images/p-brazil.jpg',
    category: 'crops',
  },
  {
    id: 'espresso',
    name: 'خلطة سنووفي إسبريسو',
    desc: 'خلطتنا الخاصة للإسبريسو؛ كريما غنية ونهاية طويلة بالشوكولاتة.',
    notes: 'شوكولاتة داكنة • توت • دبس',
    roast: 'تحميص داكن',
    size: '250 غ',
    price: 72,
    image: '/images/p-espresso.jpg',
    category: 'blends',
    badge: 'الأكثر مبيعاً',
  },
  {
    id: 'latte',
    name: 'خلطة اللاتيه الكريمية',
    desc: 'خلطة ناعمة صُممت لتنسجم مع الحليب وتبرز حلاوة الفانيليا والبندق.',
    notes: 'فانيليا • بندق • حليب مكرمل',
    roast: 'تحميص وسط',
    size: '250 غ',
    price: 79,
    image: '/images/p-latte.jpg',
    category: 'blends',
  },
  {
    id: 'coldbrew',
    name: 'كولد برو جاهز',
    desc: 'قهوة مقطرة على البارد لمدة 12 ساعة، منعشة وسلسة بدون حموضة.',
    notes: 'تمر • شوكولاتة بالحليب',
    roast: 'تقطير بارد',
    size: '250 مل',
    price: 24,
    image: '/images/p-coldbrew.jpg',
    category: 'drinks',
    badge: 'جديد',
  },
];

// رقم الواتساب لاستقبال الطلبات — استبدله برقم المتجر
export const WHATSAPP_NUMBER = '966500000000';
