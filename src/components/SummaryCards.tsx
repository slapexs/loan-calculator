import { Card, CardContent } from '@/components/ui/card';
import { PaymentDetail, InterestPeriod } from '../types';
import { NumberTicker } from './magicui/number-ticker';
import { PercentIcon } from 'lucide-react';

interface SummaryCardsProps {
  paymentDetails: PaymentDetail[];
  interestPeriods: InterestPeriod[];
  loanYears: number;
}

export const SummaryCards = ({ paymentDetails, interestPeriods, loanYears }: SummaryCardsProps) => {
  // Calculate average interest rate for first 3 years
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
  const totalInterest = paymentDetails.reduce((sum, p) => sum + p.interestPayment, 0);

  if (!paymentDetails.length) return null;

  return (
    <div className="space-y-4 mb-6">
      {/* Primary Cards - Highlighted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Payment */}
        <Card className="border-2 border-blue-100 bg-blue-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium mb-1">ยอดผ่อนต่อเดือน</p>
                <div className="text-3xl font-bold text-blue-700">
                  <NumberTicker value={paymentDetails[0]?.monthlyPayment} decimalPlaces={2} className="text-blue-700" />
                  <span className="text-base font-normal ml-1">บาท</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <h1 className="text-blue-700 text-2xl w-6 h-6 flex items-center justify-center">฿</h1>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Interest Rate First 3 Years */}
        <Card className="border-2 border-green-100 bg-green-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">อัตราดอกเบี้ยเฉลี่ย 3 ปีแรก</p>
                <div className="text-3xl font-bold text-green-700">
                  <NumberTicker value={avgFirst3YearRate} decimalPlaces={2} className="text-green-700" />
                  <span className="text-base font-normal ml-1">%</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <PercentIcon className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Cards - Less Prominent */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Floating Rate */}
        <Card className="bg-gray-50 border border-gray-100">
          <CardContent className="p-3 sm:p-4">
            <p className="text-sm text-gray-500 mb-1">อัตราดอกเบี้ยลอยตัว</p>
            <div className="text-xl font-bold text-gray-700">
              <NumberTicker value={floatingRate} decimalPlaces={2} />%
            </div>
          </CardContent>
        </Card>

        {/* Total Interest */}
        <Card className="bg-gray-50 border border-gray-100">
          <CardContent className="p-3 sm:p-4">
            <p className="text-sm text-gray-500 mb-1">ดอกเบี้ยรวม</p>
            <div className="text-lg font-bold text-gray-700">
              <NumberTicker value={totalInterest} decimalPlaces={0} />
              <span className="text-sm font-normal ml-1">บาท</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Installments */}
        <Card className="bg-gray-50 border border-gray-100">
          <CardContent className="p-3 sm:p-4">
            <p className="text-sm text-gray-500 mb-1">จำนวนงวดทั้งหมด</p>
            <div className="text-lg font-bold text-gray-700">
              <NumberTicker value={paymentDetails.length} />
              <span className="text-sm font-normal ml-1">งวด ({(paymentDetails.length/12).toFixed(1)} ปี)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
