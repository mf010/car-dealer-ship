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
                margin: 20mm;
              }
              
              body {
                font-family: 'Arial', sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              .print-container {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                background: white;
                color: black;
                font-size: 12pt;
              }

              .print-header {
                text-align: center;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }

              .company-logo {
                width: 120px;
                height: 120px;
                margin: 0 auto 15px;
                display: block;
              }

              .company-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }

              .company-name {
                font-size: 28pt;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 5px;
              }

              .invoice-title {
                font-size: 20pt;
                font-weight: bold;
                color: #374151;
                margin-top: 15px;
              }

              .invoice-details {
                margin-bottom: 30px;
              }

              .section-title {
                font-size: 16pt;
                font-weight: bold;
                margin-bottom: 15px;
                color: #1e40af;
              }

              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
              }

              .detail-label {
                font-weight: bold;
                color: #374151;
              }

              .detail-value {
                color: #1f2937;
              }

              .payments-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
              }

              .payments-table th,
              .payments-table td {
                border: 1px solid #d1d5db;
                padding: 10px;
                text-align: center;
              }

              .payments-table th {
                background-color: #3b82f6;
                color: white;
                font-weight: bold;
              }

              .payments-table tr:nth-child(even) {
                background-color: #f9fafb;
              }

              .summary-section {
                margin-top: 30px;
                padding: 20px;
                background-color: #f3f4f6;
                border-radius: 8px;
              }

              .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 14pt;
              }

              .summary-row.total {
                font-size: 16pt;
                font-weight: bold;
                border-top: 2px solid #2563eb;
                padding-top: 15px;
                margin-top: 10px;
              }

              .stamp-area {
                margin-top: 50px;
                text-align: left;
              }

              .stamp-box {
                border: 2px dashed #9ca3af;
                padding: 60px 40px;
                text-align: center;
                color: #6b7280;
                font-size: 14pt;
                margin-top: 20px;
              }

              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 10pt;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 15px;
              }
            }
          `}
        </style>

        <div className="print-container">
          {/* Header */}
          <div className="print-header">
            <div className="company-logo">
              <img src={Logo} alt="شركة بيان" />
            </div>
            <div className="company-name">شركة بيان</div>
            <div className="invoice-title">فاتورة رقم #{invoice.id}</div>
          </div>

          {/* Invoice Details */}
          <div className="invoice-details">
            <div className="detail-row">
              <span className="detail-label">اسم العميل:</span>
              <span className="detail-value">{invoice.client?.name || 'غير متوفر'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">رقم الهاتف:</span>
              <span className="detail-value">{invoice.client?.phone || 'غير متوفر'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">العنوان:</span>
              <span className="detail-value">{invoice.client?.address || 'غير متوفر'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">تاريخ الفاتورة:</span>
              <span className="detail-value">{formatDateAr(invoice.invoice_date)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">مبلغ الفاتورة:</span>
              <span className="detail-value" style={{ fontWeight: 'bold', color: '#059669' }}>{formatCurrencyAr(invoice.amount)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">المبلغ المدفوع:</span>
              <span className="detail-value" style={{ fontWeight: 'bold', color: '#2563eb' }}>{formatCurrencyAr(totalPaid)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">المبلغ المتبقي:</span>
              <span className="detail-value" style={{ fontWeight: 'bold', color: remainingBalance > 0 ? '#dc2626' : '#059669' }}>{formatCurrencyAr(remainingBalance)}</span>
            </div>
          </div>

          {/* Car Information Section */}
          <div>
            <h3 className="section-title" style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '15px', color: '#1e40af' }}>
              معلومات السيارة
            </h3>
            <div className="invoice-details" style={{ marginBottom: '30px' }}>
              <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span className="detail-label" style={{ fontWeight: 'bold', color: '#374151' }}>الماركة:</span>
                <span className="detail-value" style={{ color: '#1f2937' }}>
                  {makeName}
                </span>
              </div>
              <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span className="detail-label" style={{ fontWeight: 'bold', color: '#374151' }}>الموديل:</span>
                <span className="detail-value" style={{ color: '#1f2937' }}>
                  {modelName}
                </span>
              </div>
              <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span className="detail-label" style={{ fontWeight: 'bold', color: '#374151' }}>رقم السيارة:</span>
                <span className="detail-value" style={{ color: '#1f2937' }}>#{invoice.car?.id || 'غير متوفر'}</span>
              </div>
              <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span className="detail-label" style={{ fontWeight: 'bold', color: '#374151' }}>حالة السيارة:</span>
                <span className="detail-value" style={{ color: '#1f2937' }}>
                  {invoice.car?.status === 'available' ? 'متاحة' : 
                   invoice.car?.status === 'sold' ? 'مباعة' : 
                   invoice.car?.status === 'reserved' ? 'محجوزة' : 'غير متوفر'}
                </span>
              </div>
            </div>
          </div>

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
                      <td>{formatCurrencyAr(payment.amount)}</td>
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
              <span>{formatCurrencyAr(invoice.amount)}</span>
            </div>
            <div className="summary-row">
              <span>المبلغ المدفوع:</span>
              <span style={{ color: '#059669' }}>{formatCurrencyAr(totalPaid)}</span>
            </div>
            <div className="summary-row total">
              <span>المتبقي:</span>
              <span style={{ color: remainingBalance > 0 ? '#dc2626' : '#059669' }}>
                {formatCurrencyAr(remainingBalance)}
              </span>
            </div>
          </div>

          {/* Stamp Area */}
          <div className="stamp-area">
            <div style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '10px' }}>
              ختم الشركة:
            </div>
            <div className="stamp-box">
              مكان ختم الشركة
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>شكراً لتعاملكم معنا</p>
            <p>شركة بيان - {formatDateAr(new Date().toISOString().split('T')[0])}</p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = "PrintableInvoice";
