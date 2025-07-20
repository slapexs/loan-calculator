import ExcelJS from 'exceljs';
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

export const exportToExcel = async (
  paymentDetails: PaymentDetail[],
  monthlyOverpayments: { [month: number]: number },
  filename: string = 'payment-schedule'
): Promise<void> => {
  const exportData = convertPaymentDetailsToExportData(paymentDetails, monthlyOverpayments);
  
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ตารางการผ่อนชำระ');
  
  // Define column headers
  const headers = [
    'เดือนที่', 'ปีที่', 'เงินต้นคงเหลือ', 'ยอดผ่อน', 'เงินต้น', 
    'ดอกเบี้ย', 'จ่ายเกิน', 'ดอกเบี้ยรวม', 'เงินต้นรวม', 'วันที่'
  ];
  
  // Add headers
  worksheet.addRow(headers);
  
  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6E6FA' }
  };
  
  // Add data rows
  exportData.forEach(row => {
    worksheet.addRow([
      row.เดือนที่,
      row.ปีที่,
      row.เงินต้นคงเหลือ,
      row.ยอดผ่อน,
      row.เงินต้น,
      row.ดอกเบี้ย,
      row.จ่ายเกิน,
      row.ดอกเบี้ยรวม,
      row.เงินต้นรวม,
      row.วันที่
    ]);
  });
  
  // Set column widths
  worksheet.columns = [
    { width: 10 }, // เดือนที่
    { width: 8 },  // ปีที่
    { width: 18 }, // เงินต้นคงเหลือ
    { width: 15 }, // ยอดผ่อน
    { width: 15 }, // เงินต้น
    { width: 15 }, // ดอกเบี้ย
    { width: 12 }, // จ่ายเกิน
    { width: 18 }, // ดอกเบี้ยรวม
    { width: 18 }, // เงินต้นรวม
    { width: 15 }  // วันที่
  ];
  
  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });
  
  // Generate buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export type ExportFormat = 'csv' | 'xlsx';

export const exportPaymentSchedule = async (
  format: ExportFormat,
  paymentDetails: PaymentDetail[],
  monthlyOverpayments: { [month: number]: number },
  filename?: string
): Promise<void> => {
  const defaultFilename = `payment-schedule-${new Date().toISOString().split('T')[0]}`;
  const finalFilename = filename || defaultFilename;
  
  if (format === 'csv') {
    exportToCSV(paymentDetails, monthlyOverpayments, finalFilename);
  } else if (format === 'xlsx') {
    await exportToExcel(paymentDetails, monthlyOverpayments, finalFilename);
  }
};
