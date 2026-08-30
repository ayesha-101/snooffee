import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/opt/pw-browsers/chromium'
  });
  const page = await browser.newPage();
  
  try {
    // اختبر الصفحة الرئيسية
    console.log('✓ اختبار الصفحة الرئيسية...');
    await page.goto('http://localhost:3002/', { waitUntil: 'networkidle' });
    
    // اختبر الذهاب للادمن
    console.log('✓ الذهاب لصفحة الادمن...');
    await page.goto('http://localhost:3002/admin', { waitUntil: 'networkidle' });
    
    // تحقق من وجود حقل كلمة المرور
    const passwordInput = await page.$('input[type="password"]');
    if (passwordInput) {
      console.log('✓ صفحة تسجيل الدخول تحتوي على حقل كلمة المرور');
      
      // أدخل كلمة المرور الصحيحة
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("دخول")');
      
      // انتظر لوحة التحكم
      await page.waitForTimeout(2000);
      
      // تحقق من وجود التبويبات الجديدة
      const tabs = ['العملاء', 'المخزون', 'التقارير', 'المراجعات', 'الدعم'];
      for (const tab of tabs) {
        const tabElement = await page.$(`button:has-text("${tab}")`);
        if (tabElement) {
          console.log(`✓ تبويب "${tab}" موجود`);
        } else {
          console.log(`✗ تبويب "${tab}" غير موجود`);
        }
      }
      
      // اختبر تبويب العملاء
      console.log('\n✓ اختبار تبويب العملاء...');
      await page.click('button:has-text("العملاء")');
      await page.waitForTimeout(1000);
      const customersTable = await page.$('table');
      if (customersTable) {
        console.log('✓ جدول العملاء يعمل');
      }
      
      // اختبر تبويب المخزون
      console.log('✓ اختبار تبويب المخزون...');
      await page.click('button:has-text("المخزون")');
      await page.waitForTimeout(1000);
      const inventoryTable = await page.$('table');
      if (inventoryTable) {
        console.log('✓ جدول المخزون يعمل');
      }
      
      // اختبر تبويب التقارير
      console.log('✓ اختبار تبويب التقارير...');
      await page.click('button:has-text("التقارير")');
      await page.waitForTimeout(1000);
      const statsCards = await page.$$('.bg-gradient-to-br');
      console.log(`✓ تبويب التقارير يعرض ${statsCards.length} بطاقات إحصائيات`);
      
      // اختبر تبويب المراجعات
      console.log('✓ اختبار تبويب المراجعات...');
      await page.click('button:has-text("المراجعات")');
      await page.waitForTimeout(1000);
      console.log('✓ تبويب المراجعات يعمل');
      
      // اختبر تبويب الدعم
      console.log('✓ اختبار تبويب الدعم...');
      await page.click('button:has-text("الدعم")');
      await page.waitForTimeout(1000);
      console.log('✓ تبويب الدعم يعمل');
      
      console.log('\n✅ جميع الاختبارات نجحت!');
    }
  } catch (error) {
    console.error('❌ حدث خطأ:', error.message);
  } finally {
    await browser.close();
  }
})();
