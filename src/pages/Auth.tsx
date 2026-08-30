import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';
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

interface AuthPageProps {
  onLoginSuccess?: (user: any) => void;
}

export function Auth({ onLoginSuccess }: AuthPageProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
      loginForm.reset();
      onLoginSuccess?.({ email: data.email });
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
      registerForm.reset();
      onLoginSuccess?.({ email: data.email, name: data.name });
    } catch (error) {
      toast.error('فشل التسجيل');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-900 to-coffee-700 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* زر العودة */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 flex items-center gap-2 text-white hover:text-coffee-200 transition-colors group"
      >
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        <span className="text-sm font-medium">العودة للمتجر</span>
      </button>

      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border-2 border-coffee-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-coffee-700 to-coffee-600 text-white p-8 text-center">
            <h1 className="text-4xl font-extrabold">snooffee</h1>
            <p className="mt-3 text-coffee-100 font-medium">
              {isLogin ? '🔑 تسجيل الدخول إلى حسابك' : '✨ إنشاء حساب جديد'}
            </p>
          </div>

          {/* Forms */}
          <div className="p-8">
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type="email"
                      {...loginForm.register('email')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 pl-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-coffee-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-60 shadow-lg"
                >
                  {loginForm.formState.isSubmitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type="text"
                      {...registerForm.register('name')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="محمد علي"
                    />
                  </div>
                  {registerForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">⚠️ {registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type="email"
                      {...registerForm.register('email')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  {registerForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">⚠️ {registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type="tel"
                      {...registerForm.register('phone')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="+971 50 000 0000"
                    />
                  </div>
                  {registerForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">⚠️ {registerForm.formState.errors.phone.message}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">العنوان</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type="text"
                      {...registerForm.register('address')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="دبي، الإمارات"
                    />
                  </div>
                  {registerForm.formState.errors.address && (
                    <p className="mt-1 text-sm text-red-600">⚠️ {registerForm.formState.errors.address.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('password')}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 pl-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                      placeholder="••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-coffee-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">⚠️ {registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registerForm.formState.isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-60 shadow-lg"
                >
                  {registerForm.formState.isSubmitting ? 'جاري التسجيل...' : 'التسجيل الآن'}
                </button>
              </form>
            )}

            {/* Toggle */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowPassword(false);
                  if (isLogin) registerForm.reset();
                  else loginForm.reset();
                }}
                className="w-full py-2.5 px-4 bg-coffee-50 text-coffee-700 font-semibold rounded-lg hover:bg-coffee-100 transition-colors"
              >
                {isLogin ? '✨ التسجيل الآن' : '🔑 تسجيل الدخول'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-coffee-100 text-xs mt-6">
          © 2025 سنووفي - متجر القهوة الفاخرة
        </p>
      </div>
    </div>
  );
}
