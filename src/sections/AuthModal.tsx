import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, User, Phone, MapPin, X } from 'lucide-react';
import { sendEmailNotification, getAccountCreatedEmail } from '@/lib/email-service';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  phone: z.string().min(7, 'رقم الهاتف غير صحيح'),
  address: z.string().min(5, 'العنوان مطلوب'),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; name?: string }) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginData) => {
    try {
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        name: data.email.split('@')[0],
      }));
      toast.success('تم تسجيل الدخول بنجاح');
      onLoginSuccess({ email: data.email });
      onClose();
      loginForm.reset();
    } catch (error) {
      toast.error('فشل تسجيل الدخول');
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      const userData = {
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      const emailNotification = getAccountCreatedEmail(userData);
      await sendEmailNotification(emailNotification);

      toast.success('تم التسجيل بنجاح! تحقق من بريدك الإلكتروني.');
      onLoginSuccess({ email: data.email, name: data.name });
      onClose();
      registerForm.reset();
    } catch (error) {
      toast.error('فشل التسجيل');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-coffee-900">snooffee</h1>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
          </p>
        </div>

        {/* Forms */}
        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                البريد الإلكتروني
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  {...loginForm.register('email')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="••••••"
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-coffee-600 py-3 font-semibold text-white hover:bg-coffee-700 transition-colors"
            >
              تسجيل الدخول
            </button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-3 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-900">الاسم</label>
              <div className="mt-1 relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...registerForm.register('name')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="محمد علي"
                />
              </div>
              {registerForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">البريد الإلكتروني</label>
              <div className="mt-1 relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  {...registerForm.register('email')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">رقم الهاتف</label>
              <div className="mt-1 relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  {...registerForm.register('phone')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="+971 50 000 0000"
                />
              </div>
              {registerForm.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">العنوان</label>
              <div className="mt-1 relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  {...registerForm.register('address')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="دبي، الإمارات"
                />
              </div>
              {registerForm.formState.errors.address && (
                <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">كلمة المرور</label>
              <div className="mt-1 relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  {...registerForm.register('password')}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-3 text-gray-900"
                  placeholder="••••••"
                />
              </div>
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-coffee-600 py-3 font-semibold text-white hover:bg-coffee-700 transition-colors"
            >
              التسجيل
            </button>
          </form>
        )}

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-coffee-600 hover:text-coffee-700"
            >
              {isLogin ? 'التسجيل الآن' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
