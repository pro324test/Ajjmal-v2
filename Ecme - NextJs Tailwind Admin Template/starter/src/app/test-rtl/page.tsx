import { getLocale } from 'next-intl/server'
import { getTheme } from '@/server/actions/theme'
import RTLTestClient from './client'

export default async function TestRTLPage() {
    const locale = await getLocale()
    const theme = await getTheme()

    // This is a simple test page to demonstrate RTL functionality
    return (
        <html lang={locale} dir={theme.direction}>
            <head>
                <title>RTL Test Page</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style dangerouslySetInnerHTML={{ __html: `
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .rtl-demo {
                        margin: 20px 0;
                        padding: 20px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                    }
                    .navigation-demo {
                        display: flex;
                        gap: 20px;
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8fafc;
                        border-radius: 6px;
                    }
                    .navigation-demo a {
                        text-decoration: none;
                        color: #3b82f6;
                        padding: 8px 16px;
                        border-radius: 4px;
                        background: white;
                        border: 1px solid #e2e8f0;
                    }
                    .form-demo {
                        display: grid;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .form-demo input, .form-demo textarea {
                        padding: 12px;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        font-size: 14px;
                    }
                    .button-demo {
                        display: flex;
                        gap: 10px;
                        margin: 20px 0;
                    }
                    .button-demo button {
                        padding: 10px 20px;
                        border: none;
                        border-radius: 6px;
                        background: #3b82f6;
                        color: white;
                        cursor: pointer;
                    }
                    .text-demo {
                        margin: 20px 0;
                        line-height: 1.6;
                    }
                    .direction-indicator {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #059669;
                        color: white;
                        padding: 10px 15px;
                        border-radius: 6px;
                        font-weight: bold;
                        z-index: 1000;
                    }
                    .language-switcher {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        z-index: 1000;
                    }
                    .language-switcher button {
                        margin: 0 5px;
                        padding: 8px 12px;
                        border: 1px solid #d1d5db;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .language-switcher button.active {
                        background: #3b82f6;
                        color: white;
                        border-color: #3b82f6;
                    }
                `}} />
            </head>
            <body>
                <RTLTestClient />
                <div className="direction-indicator">
                    Direction: {theme.direction.toUpperCase()} | Locale: {locale}
                </div>
                
                <div className="language-switcher">
                    <button className={locale === 'en' ? 'active' : ''}>English</button>
                    <button className={locale === 'ar' ? 'active' : ''}>العربية</button>
                </div>

                <div className="container">
                    <h1>RTL/LTR Layout Test</h1>
                    <p>Current Direction: <strong>{theme.direction}</strong></p>
                    <p>Current Locale: <strong>{locale}</strong></p>

                    <div className="rtl-demo">
                        <h2>{locale === 'ar' ? 'اختبار تخطيط RTL' : 'RTL Layout Test'}</h2>
                        <div className="navigation-demo">
                            <a href="#">{locale === 'ar' ? 'الرئيسية' : 'Home'}</a>
                            <a href="#">{locale === 'ar' ? 'المنتجات' : 'Products'}</a>
                            <a href="#">{locale === 'ar' ? 'من نحن' : 'About'}</a>
                            <a href="#">{locale === 'ar' ? 'اتصل بنا' : 'Contact'}</a>
                        </div>
                    </div>

                    <div className="rtl-demo">
                        <h3>{locale === 'ar' ? 'نموذج الإدخال' : 'Form Demo'}</h3>
                        <div className="form-demo">
                            <input type="text" placeholder={locale === 'ar' ? 'أدخل اسمك' : 'Enter your name'} />
                            <input type="email" placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} />
                            <textarea placeholder={locale === 'ar' ? 'أدخل رسالتك هنا' : 'Enter your message here'} rows={4}></textarea>
                        </div>
                        <div className="button-demo">
                            <button>{locale === 'ar' ? 'إرسال' : 'Submit'}</button>
                            <button>{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                        </div>
                    </div>

                    <div className="rtl-demo">
                        <h3>{locale === 'ar' ? 'نص تجريبي' : 'Sample Text'}</h3>
                        <div className="text-demo">
                            {locale === 'ar' ? (
                                <p>
                                    هذا نص تجريبي باللغة العربية لاختبار تخطيط RTL. يجب أن يظهر النص من اليمين إلى اليسار، 
                                    وأن تكون عناصر التنقل والأزرار محاذاة بشكل صحيح. هذا يتضمن أيضاً اختبار تخطيط النماذج 
                                    والعناصر التفاعلية الأخرى في واجهة المستخدم.
                                </p>
                            ) : (
                                <p>
                                    This is sample text in English to test LTR layout. The text should flow from left to right,
                                    with navigation elements and buttons properly aligned. This also includes testing form layouts
                                    and other interactive UI elements.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rtl-demo">
                        <h3>{locale === 'ar' ? 'قائمة العناصر' : 'Item List'}</h3>
                        <ul>
                            <li>{locale === 'ar' ? 'العنصر الأول' : 'First item'}</li>
                            <li>{locale === 'ar' ? 'العنصر الثاني' : 'Second item'}</li>
                            <li>{locale === 'ar' ? 'العنصر الثالث' : 'Third item'}</li>
                        </ul>
                    </div>
                </div>
            </body>
        </html>
    )
}