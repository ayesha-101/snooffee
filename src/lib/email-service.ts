interface EmailNotification {
  to: string;
  type: 'order_confirmation' | 'order_shipped' | 'order_delivered' | 'account_created';
  data: Record<string, any>;
}

interface EmailTemplate {
  subject: string;
  body: string;
  html: string;
}

const emailTemplates: Record<string, EmailTemplate> = {
  order_confirmation: {
    subject: 'تأكيد الطلب - Snooffee',
    body: `مرحباً {{name}},

تم تأكيد طلبك رقم {{orderNo}} بنجاح!

التفاصيل:
- الإجمالي: {{total}} د.إ
- طريقة الدفع: {{paymentMethod}}
- العنوان: {{address}}

سيتم معالجة طلبك قريباً وإرسال تحديث بحالة الشحن.

شكراً لاختيارك Snooffee!`,
    html: `
      <h2>مرحباً {{name}},</h2>
      <p>تم تأكيد طلبك رقم <strong>{{orderNo}}</strong> بنجاح!</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>التفاصيل:</strong></p>
        <p>الإجمالي: {{total}} د.إ</p>
        <p>طريقة الدفع: {{paymentMethod}}</p>
        <p>العنوان: {{address}}</p>
      </div>
      <p>سيتم معالجة طلبك قريباً وإرسال تحديث بحالة الشحن.</p>
      <p>شكراً لاختيارك Snooffee!</p>
    `,
  },
  order_shipped: {
    subject: 'تم شحن طلبك - Snooffee',
    body: `مرحباً {{name}},

تم شحن طلبك رقم {{orderNo}} بنجاً!

التفاصيل:
- رقم التتبع: {{trackingNumber}}
- الشركة اللوجستية: {{carrier}}

يمكنك متابعة حالة الشحن من خلال لوحة التحكم الخاصة بك.

شكراً لاختيارك Snooffee!`,
    html: `
      <h2>مرحباً {{name}},</h2>
      <p>تم شحن طلبك رقم <strong>{{orderNo}}</strong> بنجاح!</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>التفاصيل:</strong></p>
        <p>رقم التتبع: {{trackingNumber}}</p>
        <p>الشركة اللوجستية: {{carrier}}</p>
      </div>
      <p>يمكنك متابعة حالة الشحن من خلال لوحة التحكم الخاصة بك.</p>
      <p>شكراً لاختيارك Snooffee!</p>
    `,
  },
  order_delivered: {
    subject: 'تم توصيل طلبك - Snooffee',
    body: `مرحباً {{name}},

تم توصيل طلبك رقم {{orderNo}} بنجاح!

نتمنى أن تستمتع بقهوتنا الفاخرة. في حالة وجود أي مشكلة، يرجى التواصل معنا فوراً.

شكراً لاختيارك Snooffee!`,
    html: `
      <h2>مرحباً {{name}},</h2>
      <p>تم توصيل طلبك رقم <strong>{{orderNo}}</strong> بنجاح!</p>
      <p>نتمنى أن تستمتع بقهوتنا الفاخرة.</p>
      <p>في حالة وجود أي مشكلة، يرجى التواصل معنا فوراً.</p>
      <p>شكراً لاختيارك Snooffee!</p>
    `,
  },
  account_created: {
    subject: 'أهلاً وسهلاً في Snooffee',
    body: `مرحباً {{name}},

تم إنشاء حسابك بنجاح! استمتع بتجربة التسوق الفاخرة مع Snooffee.

دخول حسابك: https://snooffee.example.com

شكراً لانضمامك إلينا!`,
    html: `
      <h2>مرحباً {{name}},</h2>
      <p>تم إنشاء حسابك بنجاح!</p>
      <p>استمتع بتجربة التسوق الفاخرة مع Snooffee.</p>
      <p><a href="https://snooffee.example.com" style="color: #8B4513; text-decoration: none; font-weight: bold;">دخول حسابك</a></p>
      <p>شكراً لانضمامك إلينا!</p>
    `,
  },
};

function interpolateTemplate(template: string, data: Record<string, any>): string {
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });
  return result;
}

export async function sendEmailNotification(notification: EmailNotification): Promise<boolean> {
  try {
    const template = emailTemplates[notification.type];
    if (!template) {
      console.error(`Unknown email template: ${notification.type}`);
      return false;
    }

    const subject = interpolateTemplate(template.subject, notification.data);
    const body = interpolateTemplate(template.body, notification.data);
    const html = interpolateTemplate(template.html, notification.data);

    // Store in localStorage for development/testing
    const sentEmails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
    sentEmails.push({
      to: notification.to,
      type: notification.type,
      subject,
      body,
      html,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('sent_emails', JSON.stringify(sentEmails));

    console.log(`Email notification sent:`, {
      to: notification.to,
      type: notification.type,
      subject,
    });

    // In a real app, this would call a backend API or use Resend/SendGrid
    // For now, we'll just log it and store it locally
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}

export function getOrderConfirmationEmail(order: any, user: any): EmailNotification {
  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'Apple Pay';

  return {
    to: order.email,
    type: 'order_confirmation',
    data: {
      name: user.name || order.email,
      orderNo: order.orderNo,
      total: order.totalPrice.toLocaleString('ar-AE'),
      paymentMethod: paymentMethodLabel,
      address: order.address,
    },
  };
}

export function getOrderShippedEmail(order: any, trackingNumber: string = 'TBD', carrier: string = 'DHL'): EmailNotification {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return {
    to: order.email,
    type: 'order_shipped',
    data: {
      name: user.name || order.email,
      orderNo: order.orderNo,
      trackingNumber,
      carrier,
    },
  };
}

export function getOrderDeliveredEmail(order: any): EmailNotification {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return {
    to: order.email,
    type: 'order_delivered',
    data: {
      name: user.name || order.email,
      orderNo: order.orderNo,
    },
  };
}

export function getAccountCreatedEmail(user: any): EmailNotification {
  return {
    to: user.email,
    type: 'account_created',
    data: {
      name: user.name || user.email,
    },
  };
}
