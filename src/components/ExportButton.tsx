import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PaymentDetail } from '../types';
import { exportPaymentSchedule, ExportFormat } from '../utils/exportUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportButtonProps {
  paymentDetails: PaymentDetail[];
  monthlyOverpayments: { [month: number]: number };
}

export const ExportButton = ({ paymentDetails, monthlyOverpayments }: ExportButtonProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xlsx');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format?: ExportFormat) => {
    if (paymentDetails.length === 0) {
      alert('ไม่มีข้อมูลสำหรับการ Export');
      return;
    }

    setIsExporting(true);
    try {
      // Use the provided format or fall back to the selected format
      const exportFormat = format || selectedFormat;
      await exportPaymentSchedule(exportFormat, paymentDetails, monthlyOverpayments);
    } catch (error) {
      console.error('Export error:', error);
      alert('เกิดข้อผิดพลาดในการ Export ข้อมูล');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWithFormat = async (format: ExportFormat) => {
    setSelectedFormat(format); // Update the selected format for next time
    await handleExport(format); // Use the selected format immediately
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          className="h-8 gap-1 pr-2 pl-3"
          disabled={isExporting || paymentDetails.length === 0}
        >
          <Download className="h-3.5 w-3.5" />
          {isExporting ? 'กำลัง Export...' : 'ดาวน์โหลด'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1 h-3 w-3"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem 
          onClick={() => handleExportWithFormat('xlsx')} 
          className="cursor-pointer flex items-center gap-2"
        >
          <span className="text-sm">Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExportWithFormat('csv')} 
          className="cursor-pointer flex items-center gap-2"
        >
          <span className="text-sm">CSV (.csv)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
