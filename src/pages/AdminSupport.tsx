import { useState } from 'react';
import { MessageSquare, Send, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
  reply?: string;
}

export function AdminSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      email: 'customer1@example.com',
      name: 'أحمد محمد',
      subject: 'سؤال عن المنتج',
      message: 'هل هذا المنتج يصلح للاستخدام اليومي؟',
      date: new Date().toISOString(),
      status: 'new',
    },
    {
      id: '2',
      email: 'customer2@example.com',
      name: 'فاطمة علي',
      subject: 'مشكلة في الطلب',
      message: 'الطلب لم يصل بعد',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'read',
      reply: 'نعتذر عن التأخير، سيتم توصيل الطلب قريباً',
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all');

  const filteredMessages = messages.filter((m) => {
    if (filter === 'new') return m.status === 'new';
    if (filter === 'replied') return m.status === 'replied';
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, status: 'read' as const } : m)));
  };

  const handleReply = (id: string) => {
    if (!replyText.trim()) {
      toast.error('الرجاء كتابة رد');
      return;
    }

    setMessages(
      messages.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'replied' as const,
              reply: replyText,
            }
          : m
      )
    );

    toast.success('تم إرسال الرد');
    setReplyText('');
    setSelectedMessage(null);
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    toast.success('تم حذف الرسالة');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">دعم العملاء</h2>
        <p className="text-gray-400">إدارة رسائل ودعم العملاء</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-3">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">إجمالي الرسائل</p>
          <p className="text-3xl font-bold text-white">{messages.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">جديدة</p>
          <p className="text-3xl font-bold text-blue-400">{messages.filter((m) => m.status === 'new').length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">تم الرد عليها</p>
          <p className="text-3xl font-bold text-green-400">{messages.filter((m) => m.status === 'replied').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['all', 'new', 'replied'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-coffee-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            {f === 'all' && 'الكل'}
            {f === 'new' && 'جديدة'}
            {f === 'replied' && 'تم الرد'}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Messages Panel */}
        <div className="lg:col-span-1">
          <div className="space-y-2 bg-gray-800 rounded-lg border border-gray-700 p-4">
            {filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg.id);
                  handleMarkAsRead(msg.id);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedMessage === msg.id
                    ? 'bg-coffee-600 text-white'
                    : msg.status === 'new'
                      ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                      : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <p className="font-medium truncate">{msg.name}</p>
                <p className="text-sm truncate">{msg.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  {msg.status === 'new' && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">جديدة</span>
                  )}
                  {msg.status === 'replied' && (
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">مجاب</span>
                  )}
                  <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString('ar-AE')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              {(() => {
                const msg = messages.find((m) => m.id === selectedMessage)!;
                return (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{msg.subject}</h3>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>من: {msg.name} ({msg.email})</p>
                        <p className="flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(msg.date).toLocaleDateString('ar-AE')}
                        </p>
                      </div>
                    </div>

                    {/* Original Message */}
                    <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <p className="text-sm text-gray-400 mb-2">الرسالة الأصلية:</p>
                      <p className="text-white">{msg.message}</p>
                    </div>

                    {/* Reply */}
                    {msg.reply && (
                      <div className="mb-6 p-4 bg-green-900/20 rounded-lg border border-green-700">
                        <p className="text-sm text-green-400 mb-2">الرد:</p>
                        <p className="text-white">{msg.reply}</p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {msg.status !== 'replied' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">اكتب ردك:</label>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-coffee-600"
                          rows={4}
                          placeholder="اكتب ردك هنا..."
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {msg.status !== 'replied' && (
                        <button
                          onClick={() => handleReply(msg.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          <Send size={16} />
                          إرسال الرد
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleDelete(msg.id);
                          setSelectedMessage(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                        حذف
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 flex flex-col items-center justify-center h-96">
              <MessageSquare size={48} className="text-gray-500 mb-4" />
              <p className="text-gray-400">اختر رسالة للرد عليها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
