import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'admin123'; // كلمة السر الافتراضية

export function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // محاكاة تأخير الـ API
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_auth', 'true');
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/admin');
      } else {
        toast.error('كلمة السر غير صحيحة');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-900 to-coffee-700 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-coffee-800 to-coffee-600 text-white p-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock size={32} />
              <h1 className="text-3xl font-extrabold">لوحة التحكم</h1>
            </div>
            <p className="text-center text-coffee-100">أدخل كلمة المرور للوصول</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:border-coffee-600 focus:ring-1 focus:ring-coffee-600"
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                {isLoading ? 'جاري التحقق...' : 'دخول'}
              </button>

              <p className="text-center text-xs text-gray-500">
                هذه صفحة محمية للمسؤولين فقط
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
