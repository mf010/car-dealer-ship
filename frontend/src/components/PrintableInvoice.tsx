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

    // Calculate total paid from invoice.payed (which already includes all payments)
    const totalPaid = parseFloat(String(invoice.payed || 0)) || 0;
    const totalAmount = parseFloat(String(invoice.amount)) || 0;
    const remainingBalance = totalAmount - totalPaid;

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
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');

            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
              }

              body {
                font-family: 'Cairo', 'Arial', 'Helvetica', sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color: #000;
              }

              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .print-container {
                width: 100%;
                max-width: 190mm;
                height: 277mm;
                margin: 0 auto;
                background: white;
                color: black;
                font-size: 9pt;
                position: relative;
                border: 2px solid #000;
                padding: 0;
                overflow: hidden;
                page-break-after: avoid;
                page-break-inside: avoid;
              }

              .watermark {
                position: absolute;
                top: 55%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.08;
                z-index: 0;
                pointer-events: none;
                width: 70%;
                max-width: 500px;
                height: auto;
              }

              .content-wrapper {
                position: relative;
                z-index: 1;
                padding: 12px;
                height: 100%;
                display: flex;
                flex-direction: column;
              }

              .print-header {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                padding: 12px 15px 18px 15px;
                margin: -12px -12px 12px -12px;
                text-align: center;
                clip-path: ellipse(100% 100% at 50% 0%);
                position: relative;
                padding-bottom: 25px;
              }

              .company-logo {
                width: 100px;
                height: auto;
                margin: 0 auto 6px auto;
                display: block;
                filter: brightness(0) invert(1);
              }

              .company-name {
                font-size: 18pt;
                font-weight: bold;
                margin-bottom: 6px;
                letter-spacing: 2px;
                color: #ffffff;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
              }

              .invoice-header-box {
                background: rgba(255, 255, 255, 0.15);
                color: #ffffff;
                padding: 6px 10px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                text-align: center;
                margin-top: 6px;
                backdrop-filter: blur(10px);
              }

              .invoice-title {
                font-size: 11pt;
                font-weight: bold;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #ffffff;
              }

              .invoice-number {
                font-size: 10pt;
                font-weight: bold;
                color: #ffffff;
                padding: 2px 8px;
                display: inline-block;
                margin-bottom: 2px;
              }

              .invoice-date-badge {
                background: rgba(255, 255, 255, 0.25);
                padding: 3px 10px;
                border: 1px solid rgba(255, 255, 255, 0.4);
                border-radius: 15px;
                display: inline-block;
                margin-top: 3px;
                font-size: 8.5pt;
                color: #ffffff;
                font-weight: 600;
              }

              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 12px;
              }

              .info-box {
                background: white;
                border: 1.5px solid #000;
                border-radius: 5px;
                padding: 8px;
              }

              .info-box-title {
                font-size: 10pt;
                font-weight: bold;
                color: #000;
                margin-bottom: 6px;
                padding-bottom: 4px;
                border-bottom: 1.5px solid #000;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
                padding: 3px 5px;
                border-bottom: 1px solid #ddd;
                background: white;
                margin-bottom: 2px;
                font-size: 8.5pt;
              }

              .info-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
              }

              .info-label {
                font-weight: 700;
                color: #000;
              }

              .info-value {
                color: #000;
                font-weight: 600;
              }

              .section-title {
                font-size: 11pt;
                font-weight: bold;
                margin: 12px 0 8px 0;
                color: #000;
                padding: 6px 10px;
                background: #f5f5f5;
                border-right: 3px solid #000;
                border-radius: 3px;
              }

              .payments-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 12px;
                border: 1.5px solid #000;
                font-size: 8.5pt;
              }

              .payments-table th,
              .payments-table td {
                padding: 5px 8px;
                text-align: center;
                border: 1px solid #000;
              }

              .payments-table th {
                background: #f5f5f5;
                color: #000;
                font-weight: bold;
                font-size: 9pt;
                text-transform: uppercase;
              }

              .payments-table tbody tr:nth-child(odd) {
                background-color: #fafafa;
              }

              .payments-table tbody tr:nth-child(even) {
                background-color: white;
              }

              .summary-section {
                margin-top: 12px;
                background: white;
                border: 1.5px solid #000;
                border-radius: 5px;
                padding: 10px;
              }

              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 5px 10px;
                font-size: 9.5pt;
                border-bottom: 1px solid #ddd;
                background: white;
                margin-bottom: 3px;
                font-weight: 600;
              }

              .summary-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
              }

              .summary-row.total {
                font-size: 12pt;
                font-weight: bold;
                border-top: 1.5px solid #000;
                padding: 8px 10px;
                margin-top: 5px;
                background: #f5f5f5;
                border: 1.5px solid #000;
              }

              .status-badge {
                display: block;
                padding: 5px 10px;
                border-radius: 3px;
                font-weight: bold;
                font-size: 9pt;
                margin-top: 8px;
                text-align: center;
                border: 1.5px solid #000;
              }

              .status-paid {
                background: #f0f0f0;
                color: #000;
              }

              .status-pending {
                background: #f5f5f5;
                color: #000;
              }

              .bottom-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-top: 12px;
              }

              .notes-section {
                background: white;
                border: 1.5px solid #000;
                border-radius: 5px;
                padding: 8px;
              }

              .notes-title {
                font-weight: bold;
                color: #000;
                margin-bottom: 5px;
                font-size: 9pt;
                padding-bottom: 4px;
                border-bottom: 1px solid #000;
              }

              .notes-content {
                color: #000;
                font-size: 7.5pt;
                line-height: 1.4;
              }

              .stamp-section {
                background: white;
                border: 1.5px solid #000;
                border-radius: 5px;
                padding: 8px;
                text-align: center;
              }

              .stamp-title {
                font-weight: bold;
                color: #000;
                margin-bottom: 5px;
                font-size: 9pt;
                padding-bottom: 4px;
                border-bottom: 1px solid #000;
              }

              .stamp-box {
                border: 1.5px dashed #666;
                padding: 20px 10px;
                border-radius: 5px;
                background: white;
                color: #666;
                font-size: 8pt;
                font-weight: 600;
                min-height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .footer {
                margin-top: 12px;
                text-align: center;
                padding: 30px 15px 20px 15px;
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: white;
                margin-left: -12px;
                margin-right: -12px;
                margin-bottom: -12px;
                clip-path: ellipse(100% 100% at 50% 100%);
                position: relative;
                padding-top: 40px;
              }

              .footer-title {
                font-size: 10pt;
                font-weight: bold;
                color: #ffffff;
                margin-bottom: 4px;
                margin-top: 8px;
              }

              .footer-text {
                font-size: 7.5pt;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.4;
              }

              .amount-highlight {
                font-weight: bold;
                font-size: 9.5pt;
              }

              .divider {
                height: 1.5px;
                background: #000;
                margin: 10px 0;
              }

              .qr-section {
                text-align: center;
                padding: 6px;
                background: white;
                border: 1.5px solid #000;
                border-radius: 5px;
                margin-top: 10px;
              }

              .qr-placeholder {
                width: 60px;
                height: 60px;
                margin: 0 auto;
                border: 1.5px dashed #666;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 7pt;
              }

              .barcode {
                margin-top: 5px;
                text-align: center;
                font-family: 'Courier New', monospace;
                font-size: 14pt;
                font-weight: bold;
                letter-spacing: 4px;
                color: #000;
                padding: 5px;
                border: 1.5px solid #000;
                border-radius: 3px;
                background: white;
              }

              /* Print-specific optimizations */
              @media print {
                .print-container {
                  page-break-inside: avoid;
                  page-break-after: avoid;
                }
                
                .info-grid,
                .summary-section,
                .bottom-section {
                  page-break-inside: avoid;
                }

                /* Hide browser default header/footer */
                @page {
                  margin: 10mm;
                }
              }
            }
          `}
        </style>

        <div className="print-container">
          {/* Watermark */}
          <img src={Logo} alt="" className="watermark" />
          
          <div className="content-wrapper">
            {/* Header */}
            <div className="print-header">
              <img src={Logo} alt="شركة بيان" className="company-logo" />
              <div className="company-name">شركة بيان</div>
              
              <div className="invoice-header-box">
                <div className="invoice-title">فاتورة بيع</div>
                <div className="invoice-number">رقم الفاتورة: #{invoice.id}</div>
                <div className="invoice-date-badge">
                  التاريخ: {formatDateAr(invoice.invoice_date)}
                </div>
              </div>
            </div>

            {/* Client and Car Information Grid */}
            <div className="info-grid">
              {/* Client Information */}
              <div className="info-box">
                <div className="info-box-title">معلومات العميل</div>
                <div className="info-row">
                  <span className="info-label">الاسم:</span>
                  <span className="info-value">{invoice.client?.name || 'غير متوفر'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">رقم الهاتف:</span>
                  <span className="info-value">
                    {(() => {
                      const client = invoice.client as any;
                      const phone = client?.phone || client?.phone_number || client?.phoneNumber;
                      return phone || 'غير متوفر';
                    })()}
                  </span>
                </div>
              </div>

              {/* Car Information */}
              <div className="info-box">
                <div className="info-box-title">معلومات السيارة</div>
                <div className="info-row">
                  <span className="info-label">الماركة:</span>
                  <span className="info-value">{makeName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">الموديل:</span>
                  <span className="info-value">{modelName}</span>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Payments Table */}
            {payments.length > 0 && (
              <>
                <h3 className="section-title">
                  سجل الدفعات
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
                <span>المبلغ الإجمالي:</span>
                <span className="amount-highlight">{formatCurrencyAr(invoice.amount)}</span>
              </div>
              <div className="summary-row">
                <span>المبلغ المدفوع:</span>
                <span className="amount-highlight" style={{ color: '#000' }}>{formatCurrencyAr(totalPaid)}</span>
              </div>
              <div className="summary-row total">
                <span>الرصيد المتبقي:</span>
                <span style={{ color: '#000' }}>
                  {formatCurrencyAr(remainingBalance)}
                </span>
              </div>
              {remainingBalance <= 0 && (
                <div className="status-badge status-paid" style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
                  تم السداد بالكامل
                </div>
              )}
              {remainingBalance > 0 && (
                <div className="status-badge status-pending" style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
                  متبقي مبلغ {formatCurrencyAr(remainingBalance)}
                </div>
              )}
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
              {/* Notes Section */}
              

              {/* Stamp Section */}
              <div className="stamp-section">
                <div className="stamp-title">ختم وتوقيع الشركة</div>
                <div className="stamp-box">
                  مكان الختم والتوقيع
                </div>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="qr-section">
              <div className="barcode">
                INV-{String(invoice.id).padStart(6, '0')}
              </div>
              <div style={{ fontSize: '7pt', color: '#333', marginTop: '3px' }}>
                الرقم التسلسلي للفاتورة
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <div className="footer-title">شكراً لتعاملكم معنا</div>
              <div className="footer-text">
                <strong>شركة بيان</strong><br/>
                تاريخ الطباعة: {formatDateAr(new Date().toISOString().split('T')[0])}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = "PrintableInvoice";
