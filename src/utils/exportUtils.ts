import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { PaymentDetail } from '../types';

export interface ExportData {
  เดือนที่: number;
  ปีที่: number;
  เงินต้นคงเหลือ: string;
  ยอดผ่อน: string;
  เงินต้น: string;
  ดอกเบี้ย: string;
  จ่ายเกิน: string;
  ดอกเบี้ยรวม: string;
  เงินต้นรวม: string;
  วันที่: string;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('th-TH', { maximumFractionDigits: 0 });
};

const convertPaymentDetailsToExportData = (
  paymentDetails: PaymentDetail[],
  monthlyOverpayments: { [month: number]: number }
): ExportData[] => {
  return paymentDetails.map((payment) => ({
    เดือนที่: payment.month,
    ปีที่: payment.year,
    เงินต้นคงเหลือ: formatCurrency(payment.remainingPrincipal),
    ยอดผ่อน: formatCurrency(payment.monthlyPayment),
    เงินต้น: formatCurrency(payment.principalPayment),
    ดอกเบี้ย: formatCurrency(payment.interestPayment),
    จ่ายเกิน: formatCurrency(monthlyOverpayments[payment.month] || 0),
    ดอกเบี้ยรวม: formatCurrency(payment.totalInterestPaid),
    เงินต้นรวม: formatCurrency(payment.totalPrincipalPaid),
    วันที่: payment.lastPaymentDate,
  }));
};

export const exportToCSV = (
  paymentDetails: PaymentDetail[],
  monthlyOverpayments: { [month: number]: number },
  filename: string = 'payment-schedule'
): void => {
  const exportData = convertPaymentDetailsToExportData(paymentDetails, monthlyOverpayments);
  
  const csv = Papa.unparse(exportData, {
    header: true
  });
  
  // Add BOM for proper Thai character display in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (
  paymentDetails: PaymentDetail[],
  monthlyOverpayments: { [month: number]: number },
  filename: string = 'payment-schedule'
): void => {
  const exportData = convertPaymentDetailsToExportData(paymentDetails, monthlyOverpayments);
  
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths for better display
  const colWidths = [
    { wch: 10 }, // เดือนที่
    { wch: 8 },  // ปีที่
    { wch: 15 }, // เงินต้นคงเหลือ
    { wch: 12 }, // ยอดผ่อน
    { wch: 12 }, // เงินต้น
    { wch: 12 }, // ดอกเบี้ย
    { wch: 10 }, // จ่ายเกิน
    { wch: 15 }, // ดอกเบี้ยรวม
    { wch: 15 }, // เงินต้นรวม
    { wch: 12 }  // วันที่
  ];
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'ตารางการผ่อนชำระ');
  
  // Write file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export type ExportFormat = 'csv' | 'xlsx';

export const exportPaymentSchedule = (
  format: ExportFormat,
  paymentDetails: PaymentDetail[],
  monthlyOverpayments: { [month: number]: number },
  filename?: string
): void => {
  const defaultFilename = `payment-schedule-${new Date().toISOString().split('T')[0]}`;
  const finalFilename = filename || defaultFilename;
  
  if (format === 'csv') {
    exportToCSV(paymentDetails, monthlyOverpayments, finalFilename);
  } else if (format === 'xlsx') {
    exportToExcel(paymentDetails, monthlyOverpayments, finalFilename);
  }
};
