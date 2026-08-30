import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'admin123';

export function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_auth', 'true');
        window.dispatchEvent(new CustomEvent('admin-login-success'));
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/admin');
      } else {
        toast.error('كلمة السر غير صحيحة');
        setPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-900 to-coffee-700 flex items-center justify-center px-4" dir="rtl">
      {/* زر العودة - أعلى اليسار */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-6 flex items-center gap-2 text-white hover:text-coffee-200 transition-colors group"
      >
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        <span className="text-sm font-medium">العودة للمتجر</span>
      </button>

      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border-2 border-coffee-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-coffee-800 to-coffee-600 text-white p-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock size={36} className="text-coffee-200" />
              <h1 className="text-3xl font-extrabold">لوحة التحكم</h1>
            </div>
            <p className="text-center text-coffee-100 text-sm">منطقة محمية - للمسؤولين فقط</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    disabled={isLoading}
                    autoFocus
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coffee-600 focus:ring-2 focus:ring-coffee-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-coffee-600 transition-colors"
                  >
                    {showPassword ? '✓' : '•'}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={20} />
                {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>

              {/* Info Text */}
              <p className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                🔒 هذه الصفحة محمية. الوصول للمسؤولين المصرح لهم فقط.
              </p>
            </form>

            {/* Bottom Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/')}
                className="w-full text-center text-sm text-coffee-600 hover:text-coffee-700 font-medium transition-colors"
              >
                ← العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white text-xs mt-6 opacity-80">
          سنووفي - متجر القهوة الفاخرة
        </p>
      </div>
    </div>
  );
}
