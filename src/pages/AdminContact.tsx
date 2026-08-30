import { useState } from 'react';
import { Mail, Phone, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
}

export function AdminContact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('contact_info');
    return saved
      ? JSON.parse(saved)
      : {
          email: 'info@snooffee.ae',
          phone: '+971 50 000 0000',
          address: 'دبي، الإمارات العربية المتحدة',
          workingHours: 'السبت - الخميس: 9:00 - 22:00\nالجمعة: 14:00 - 22:00',
        };
  });

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('contact_info', JSON.stringify(contactInfo));
    toast.success('تم حفظ بيانات الاتصال بنجاح');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">بيانات الاتصال</h1>
          <p className="mt-2 text-gray-600">إدارة معلومات الاتصال والعنوان</p>
        </div>

        <div className="grid gap-6">
          {/* Email */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Mail size={20} className="text-coffee-600" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              placeholder="info@example.com"
            />
          </div>

          {/* Phone */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Phone size={20} className="text-coffee-600" />
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              placeholder="+971 50 000 0000"
            />
          </div>

          {/* Address */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <label className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin size={20} className="text-coffee-600" />
              العنوان
            </label>
            <input
              type="text"
              value={contactInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              placeholder="المدينة والدولة"
            />
          </div>

          {/* Working Hours */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <label className="mb-3 block text-lg font-semibold text-gray-900">
              ساعات العمل
            </label>
            <textarea
              value={contactInfo.workingHours}
              onChange={(e) => handleChange('workingHours', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
              rows={4}
              placeholder="السبت - الخميس: 9:00 - 22:00"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-lg bg-coffee-600 px-6 py-3 font-bold text-white hover:bg-coffee-700 transition-colors"
          >
            <Save size={20} />
            حفظ البيانات
          </button>
        </div>
      </div>
    </div>
  );
}
