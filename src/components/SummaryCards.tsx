import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetail, InterestPeriod } from '../types';

interface SummaryCardsProps {
  paymentDetails: PaymentDetail[];
  interestPeriods: InterestPeriod[];
  loanYears: number;
}

export const SummaryCards = ({ paymentDetails, interestPeriods, loanYears }: SummaryCardsProps) => {
  // Calculate summary statistics
  const first3YearPayments = paymentDetails.filter(p => p.year <= 3);
  const avgFirst3YearRate = first3YearPayments.length > 0 ? 
    first3YearPayments.reduce((sum, p) => sum + (p.interestPayment / p.remainingPrincipal * 12 * 100), 0) / first3YearPayments.length : 0;
  
  const floatingRatePeriod = interestPeriods.find(p => p.endYear === loanYears);
  const floatingRate = floatingRatePeriod ? floatingRatePeriod.rate : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            ฿{paymentDetails[0]?.monthlyPayment.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">ยอดผ่อนต่อเดือนเริ่มต้น</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {avgFirst3YearRate.toFixed(2)}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600">อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">
            {floatingRate.toFixed(2)}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600">อัตราดอกเบี้ยลอยตัวหลังหมดโปร</div>
        </CardContent>
      </Card>
    </div>
  );
};
