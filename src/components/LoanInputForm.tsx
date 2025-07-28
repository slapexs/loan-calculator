import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoanInputFormProps {
  loanAmount: number;
  loanYears: number;
  onLoanAmountChange: (amount: number) => void;
  onLoanYearsChange: (years: number) => void;
}

export const LoanInputForm = ({
  loanAmount,
  loanYears,
  onLoanAmountChange,
  onLoanYearsChange
}: LoanInputFormProps) => {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-lg sm:text-xl">ข้อมูลสินเชื่อ</CardTitle>
        <CardDescription>ข้อมูลการกู้เงิน จำนวนเงินกู้ ระยะเวลาการกู้</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-3 sm:p-4">
        <div>
          <Label htmlFor="loanAmount" className="text-sm sm:text-base">จำนวนเงินกู้ (บาท)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={loanAmount === 0 ? '' : loanAmount}
            onChange={(e) => onLoanAmountChange(e.target.value === '' ? 0 : Number(e.target.value))}
            className="mt-1 h-10 sm:h-12"
          />
        </div>
        
        <div>
          <Label htmlFor="loanYears" className="text-sm sm:text-base">ระยะเวลาการกู้ (ปี)</Label>
          <Input
            id="loanYears"
            type="number"
            value={loanYears === 0 ? '' : loanYears}
            onChange={(e) => onLoanYearsChange(e.target.value === '' ? 0 : Number(e.target.value))}
            className="mt-1 h-10 sm:h-12"
            min="1"
            max="50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
