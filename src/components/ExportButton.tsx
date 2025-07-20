import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { PaymentDetail } from '../types';
import { exportPaymentSchedule, ExportFormat } from '../utils/exportUtils';

interface ExportButtonProps {
  paymentDetails: PaymentDetail[];
  monthlyOverpayments: { [month: number]: number };
}

export const ExportButton = ({ paymentDetails, monthlyOverpayments }: ExportButtonProps) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xlsx');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (paymentDetails.length === 0) {
      alert('ไม่มีข้อมูลสำหรับการ Export');
      return;
    }

    setIsExporting(true);
    try {
      exportPaymentSchedule(selectedFormat, paymentDetails, monthlyOverpayments);
    } catch (error) {
      console.error('Export error:', error);
      alert('เกิดข้อผิดพลาดในการ Export ข้อมูล');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedFormat}
        onValueChange={(value: ExportFormat) => setSelectedFormat(value)}
      >
        <SelectTrigger className="h-8 w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xlsx">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        onClick={handleExport}
        disabled={isExporting || paymentDetails.length === 0}
        size="sm"
        className="h-8 gap-1"
      >
        <Download className="h-3 w-3" />
        {isExporting ? 'กำลัง Export...' : 'Download'}
      </Button>
    </div>
  );
};
