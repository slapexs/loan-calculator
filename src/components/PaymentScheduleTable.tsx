import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaymentDetail } from '../types';
import { ExportButton } from './ExportButton';

interface PaymentScheduleTableProps {
  paymentDetails: PaymentDetail[];
  monthlyOverpayments: { [month: number]: number };
  onUpdateMonthlyOverpayment: (month: number, amount: number) => void;
}

export const PaymentScheduleTable = ({
  paymentDetails,
  monthlyOverpayments,
  onUpdateMonthlyOverpayment
}: PaymentScheduleTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Pagination logic
  const totalPages = Math.ceil(paymentDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = paymentDetails.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <Card>
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>ตารางการผ่อนชำระ</span>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <div className="text-xs sm:text-sm font-normal text-gray-600">
              ทั้งหมด {paymentDetails.length} เดือน
            </div>
            <ExportButton
              paymentDetails={paymentDetails}
              monthlyOverpayments={monthlyOverpayments}
            />
          </div>
        </CardTitle>
        <CardDescription>ตารางแสดงรายละเอียดการผ่อนชำระ รวมเงินต้น ดอกเบี้ย จ่ายเกิน</CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px] sm:min-w-full">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">เดือนที่</th>
                  <th className="text-left p-2">ปีที่</th>
                  <th className="text-right p-2">เงินต้นคงเหลือ</th>
                  <th className="text-right p-2">ยอดผ่อน</th>
                  <th className="text-right p-2">เงินต้น</th>
                  <th className="text-right p-2">ดอกเบี้ย</th>
                  <th className="text-right p-2">จ่ายเกิน</th>
                  <th className="text-right p-2">ดอกเบี้ยรวม</th>
                  <th className="text-right p-2">เงินต้นรวม</th>
                  <th className="text-left p-2">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((payment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{payment.month}</td>
                    <td className="p-2">{payment.year}</td>
                    <td className="p-2 text-right">
                      ฿{payment.remainingPrincipal.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-2 text-right">
                      ฿{payment.monthlyPayment.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-2 text-right">
                      ฿{payment.principalPayment.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-2 text-right">
                      ฿{payment.interestPayment.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end">
                        <Input
                          type="number"
                          placeholder="0"
                          value={monthlyOverpayments[payment.month] || ''}
                          onChange={(e) => onUpdateMonthlyOverpayment(payment.month, Number(e.target.value) || 0)}
                          className="h-6 w-20 sm:w-24 text-xs"
                        />
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      ฿{payment.totalInterestPaid.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-2 text-right">
                      ฿{payment.totalPrincipalPaid.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="p-2">{payment.lastPaymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 p-3 sm:p-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">แสดง</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs sm:text-sm text-gray-600">
                  รายการ (ทั้งหมด {paymentDetails.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs sm:text-sm">
                  หน้า {currentPage} จาก {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
