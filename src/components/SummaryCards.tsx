import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetail, InterestPeriod } from '../types';
import { NumberTicker } from './magicui/number-ticker';

interface SummaryCardsProps {
  paymentDetails: PaymentDetail[];
  interestPeriods: InterestPeriod[];
  loanYears: number;
}

export const SummaryCards = ({ paymentDetails, interestPeriods, loanYears }: SummaryCardsProps) => {
  // Calculate summary statistics
  
  // Calculate average interest rate for first 3 years based on configured rates
  const first3YearRates = interestPeriods
    .filter(period => period.startYear <= 3 && period.endYear >= 1)
    .map(period => {
      const startYear = Math.max(period.startYear, 1);
      const endYear = Math.min(period.endYear, 3);
      const yearCount = endYear - startYear + 1;
      return { rate: period.rate, yearCount };
    });
  
  const totalYearWeights = first3YearRates.reduce((sum, item) => sum + item.yearCount, 0);
  const avgFirst3YearRate = totalYearWeights > 0 ?
    first3YearRates.reduce((sum, item) => sum + (item.rate * item.yearCount), 0) / totalYearWeights : 0;

  const floatingRatePeriod = interestPeriods.find(p => p.endYear === loanYears);
  const floatingRate = floatingRatePeriod ? floatingRatePeriod.rate : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            <NumberTicker className="text-green-600 font-bold" value={paymentDetails[0]?.monthlyPayment} decimalPlaces={2} />฿
          </div>
          <div className="text-xs sm:text-sm text-gray-600">ยอดผ่อนต่อเดือนเริ่มต้น</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            <NumberTicker className="text-blue-600 font-bold" value={avgFirst3YearRate} decimalPlaces={2} />%
          </div>
          <div className="text-xs sm:text-sm text-gray-600">อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">
            <NumberTicker className="text-orange-600 font-bold" value={floatingRate} decimalPlaces={2} />%

          </div>
          <div className="text-xs sm:text-sm text-gray-600">อัตราดอกเบี้ยลอยตัวหลังหมดโปร</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            <NumberTicker className="text-purple-600 font-bold" value={paymentDetails.reduce((sum, p) => sum + p.interestPayment, 0)} />฿
          </div>
          <div className="text-xs sm:text-sm text-gray-600">ดอกเบี้ยรวมตลอดอายุเงินกู้</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            <NumberTicker className="text-red-600 font-bold" value={paymentDetails.length} /> <small>({(paymentDetails.length/12).toFixed(2)} ปี)</small>
          </div>
            
          <div className="text-xs sm:text-sm text-gray-600">จำนวนงวดทั้งหมด</div>
        </CardContent>
      </Card>
    </div >
  );
};
