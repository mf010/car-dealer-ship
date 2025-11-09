import { forwardRef } from "react";
import type { Invoice } from "../models/Invoice";
import type { Payment } from "../models/Payment";
import { formatCurrency, formatDate } from "../utils/formatters";
import Logo from "../assets/Logo.png";

interface PrintableInvoiceProps {
  invoice: Invoice;
  payments: Payment[];
}

export const PrintableInvoice = forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ invoice, payments }, ref) => {
    const formatCurrencyAr = (amount: number) => formatCurrency(amount, 'ar');
    const formatDateAr = (dateString: string) => formatDate(dateString, 'ar');

    const totalPaid = invoice.payed || payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingBalance = invoice.amount - totalPaid;

    // Extract car make and model - handle both camelCase and snake_case
    const carData: any = invoice.car;
    const carModelData: any = carData?.carModel || carData?.car_model;
    const makeData: any = carModelData?.make;
    
    const makeName = makeData?.name || 'غير متوفر';
    const modelName = carModelData?.name || 'غير متوفر';

    return (
      <div ref={ref} className="hidden print:block" dir="rtl">
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 15mm;
              }
              
              body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color: #000;
              }

              .print-container {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                color: black;
                font-size: 11pt;
                position: relative;
                border: 3px solid #2563eb;
                padding: 20px;
              }

              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 100pt;
                color: rgba(37, 99, 235, 0.05);
                font-weight: bold;
                z-index: 0;
                pointer-events: none;
              }

              .content-wrapper {
                position: relative;
                z-index: 1;
              }

              .print-header {
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                color: white;
                padding: 20px;
                margin: -20px -20px 25px -20px;
                border-bottom: 4px solid #1e3a8a;
              }

              .header-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
              }

              .company-info {
                flex: 1;
              }

              .company-logo {
                width: 100px;
                height: 100px;
                background: white;
                border-radius: 10px;
                padding: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
              }

              .company-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }

              .company-name {
                font-size: 32pt;
                font-weight: bold;
                margin-bottom: 5px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
              }

              .company-details {
                font-size: 10pt;
                opacity: 0.95;
                margin-top: 5px;
              }

              .invoice-header-box {
                background: white;
                color: #1e40af;
                padding: 15px 20px;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              .invoice-title {
                font-size: 22pt;
                font-weight: bold;
                margin-bottom: 5px;
              }

              .invoice-number {
                font-size: 16pt;
                font-weight: bold;
                color: #dc2626;
              }

              .invoice-date-badge {
                background: #f3f4f6;
                padding: 5px 15px;
                border-radius: 20px;
                display: inline-block;
                margin-top: 8px;
                font-size: 10pt;
                color: #374151;
              }

              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 25px;
              }

              .info-box {
                background: #f9fafb;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }

              .info-box-title {
                font-size: 13pt;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid #2563eb;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px dashed #d1d5db;
              }

              .info-row:last-child {
                border-bottom: none;
              }

              .info-label {
                font-weight: 600;
                color: #4b5563;
                font-size: 10.5pt;
              }

              .info-value {
                color: #1f2937;
                font-weight: 500;
                font-size: 10.5pt;
              }

              .section-title {
                font-size: 14pt;
                font-weight: bold;
                margin: 25px 0 15px 0;
                color: #1e40af;
                padding: 10px 15px;
                background: #eff6ff;
                border-right: 4px solid #2563eb;
                border-radius: 4px;
              }

              .payments-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 25px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              .payments-table th,
              .payments-table td {
                border: 1px solid #d1d5db;
                padding: 12px;
                text-align: center;
              }

              .payments-table th {
                background: #2563eb;
                color: white;
                font-weight: bold;
                font-size: 11pt;
              }

              .payments-table tbody tr:nth-child(odd) {
                background-color: #f9fafb;
              }

              .payments-table tbody tr:nth-child(even) {
                background-color: white;
              }

              .payments-table tbody tr:hover {
                background-color: #eff6ff;
              }

              .summary-section {
                margin-top: 30px;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border: 2px solid #2563eb;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }

              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                font-size: 13pt;
                border-bottom: 1px dashed #bfdbfe;
              }

              .summary-row:last-child {
                border-bottom: none;
              }

              .summary-row.total {
                font-size: 18pt;
                font-weight: bold;
                border-top: 3px solid #2563eb;
                padding-top: 15px;
                margin-top: 10px;
                background: white;
                padding: 15px;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              .status-badge {
                display: inline-block;
                padding: 6px 16px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 11pt;
                margin-top: 10px;
              }

              .status-paid {
                background: #dcfce7;
                color: #166534;
                border: 2px solid #22c55e;
              }

              .status-pending {
                background: #fef3c7;
                color: #854d0e;
                border: 2px solid #f59e0b;
              }

              .bottom-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-top: 30px;
              }

              .notes-section {
                background: #fffbeb;
                border: 2px solid #fbbf24;
                border-radius: 8px;
                padding: 15px;
              }

              .notes-title {
                font-weight: bold;
                color: #92400e;
                margin-bottom: 10px;
                font-size: 11pt;
              }

              .notes-content {
                color: #78350f;
                font-size: 9pt;
                line-height: 1.5;
              }

              .stamp-section {
                background: #f9fafb;
                border: 2px dashed #9ca3af;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
              }

              .stamp-title {
                font-weight: bold;
                color: #374151;
                margin-bottom: 10px;
                font-size: 11pt;
              }

              .stamp-box {
                border: 2px dashed #d1d5db;
                padding: 40px 20px;
                border-radius: 8px;
                background: white;
                color: #9ca3af;
                font-size: 10pt;
                min-height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .footer {
                margin-top: 30px;
                text-align: center;
                padding: 15px 0;
                border-top: 3px double #2563eb;
                background: #f9fafb;
                margin-left: -20px;
                margin-right: -20px;
                margin-bottom: -20px;
                padding-bottom: 20px;
              }

              .footer-title {
                font-size: 12pt;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 8px;
              }

              .footer-text {
                font-size: 9pt;
                color: #6b7280;
                line-height: 1.6;
              }

              .amount-highlight {
                font-weight: bold;
                font-size: 12pt;
              }

              .divider {
                height: 2px;
                background: linear-gradient(to left, transparent, #2563eb, transparent);
                margin: 20px 0;
              }
            }
          `}
        </style>

        <div className="print-container">
          {/* Watermark */}
          <div className="watermark">فاتورة</div>
          
          <div className="content-wrapper">
            {/* Header */}
            <div className="print-header">
              <div className="header-top">
                <div className="company-info">
                  <div className="company-name">شركة بيان</div>
                  <div className="company-details">
                    <div>📍 العنوان: السعودية - الرياض</div>
                    <div>📞 الهاتف: +966 XX XXX XXXX</div>
                    <div>✉️ البريد الإلكتروني: info@bayan.com</div>
                  </div>
                </div>
                <div className="company-logo">
                  <img src={Logo} alt="شركة بيان" />
                </div>
              </div>
              <div className="invoice-header-box">
                <div className="invoice-title">فاتورة بيع</div>
                <div className="invoice-number">رقم الفاتورة: #{invoice.id}</div>
                <div className="invoice-date-badge">
                  📅 التاريخ: {formatDateAr(invoice.invoice_date)}
                </div>
              </div>
            </div>

            {/* Client and Car Information Grid */}
            <div className="info-grid">
              {/* Client Information */}
              <div className="info-box">
                <div className="info-box-title">👤 معلومات العميل</div>
                <div className="info-row">
                  <span className="info-label">الاسم:</span>
                  <span className="info-value">{invoice.client?.name || 'غير متوفر'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">رقم الهاتف:</span>
                  <span className="info-value">{invoice.client?.phone || 'غير متوفر'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">العنوان:</span>
                  <span className="info-value">{invoice.client?.address || 'غير متوفر'}</span>
                </div>
              </div>

              {/* Car Information */}
              <div className="info-box">
                <div className="info-box-title">🚗 معلومات السيارة</div>
                <div className="info-row">
                  <span className="info-label">الماركة:</span>
                  <span className="info-value">{makeName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الموديل:</span>
                  <span className="info-value">{modelName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">رقم السيارة:</span>
                  <span className="info-value">#{invoice.car?.id || 'غير متوفر'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الحالة:</span>
                  <span className="info-value">
                    {invoice.car?.status === 'available' ? '✅ متاحة' : 
                     invoice.car?.status === 'sold' ? '✔️ مباعة' : 
                     invoice.car?.status === 'reserved' ? '📌 محجوزة' : 'غير متوفر'}
                  </span>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Payments Table */}
            {payments.length > 0 && (
              <>
                <h3 className="section-title">
                  💳 سجل الدفعات
                </h3>
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>رقم الدفعة</th>
                      <th>المبلغ</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>#{payment.id}</td>
                        <td className="amount-highlight">{formatCurrencyAr(payment.amount)}</td>
                        <td>{formatDateAr(payment.payment_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Summary Section */}
            <div className="summary-section">
              <div className="summary-row">
                <span>💰 المبلغ الإجمالي:</span>
                <span className="amount-highlight">{formatCurrencyAr(invoice.amount)}</span>
              </div>
              <div className="summary-row">
                <span>✅ المبلغ المدفوع:</span>
                <span className="amount-highlight" style={{ color: '#059669' }}>{formatCurrencyAr(totalPaid)}</span>
              </div>
              <div className="summary-row total">
                <span>📊 الرصيد المتبقي:</span>
                <span style={{ color: remainingBalance > 0 ? '#dc2626' : '#059669' }}>
                  {formatCurrencyAr(remainingBalance)}
                </span>
              </div>
              {remainingBalance <= 0 && (
                <div className="status-badge status-paid" style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
                  ✔️ تم السداد بالكامل
                </div>
              )}
              {remainingBalance > 0 && (
                <div className="status-badge status-pending" style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
                  ⏳ متبقي مبلغ {formatCurrencyAr(remainingBalance)}
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
              {/* Notes Section */}
              <div className="notes-section">
                <div className="notes-title">📝 ملاحظات:</div>
                <div className="notes-content">
                  • يرجى الاحتفاظ بهذه الفاتورة كإثبات للدفع<br/>
                  • في حالة وجود أي استفسار، يرجى التواصل معنا<br/>
                  • شكراً لثقتكم بشركة بيان
                </div>
              </div>

              {/* Stamp Section */}
              <div className="stamp-section">
                <div className="stamp-title">🔖 ختم وتوقيع الشركة</div>
                <div className="stamp-box">
                  مكان الختم والتوقيع
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <div className="footer-title">شكراً لتعاملكم معنا</div>
              <div className="footer-text">
                شركة بيان | تاريخ الطباعة: {formatDateAr(new Date().toISOString().split('T')[0])}<br/>
                📍 المملكة العربية السعودية - الرياض | 📞 +966 XX XXX XXXX | ✉️ info@bayan.com
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = "PrintableInvoice";
