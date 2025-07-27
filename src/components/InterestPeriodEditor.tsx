import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { InterestPeriod } from '../types';

interface InterestPeriodEditorProps {
  interestPeriods: InterestPeriod[];
  loanYears: number;
  onAddPeriod: () => void;
  onRemovePeriod: (index: number) => void;
  onUpdatePeriod: (index: number, field: keyof InterestPeriod, value: number | undefined) => void;
  getAvailableYears: (index: number, isEndYear: boolean) => number[];
}

export const InterestPeriodEditor = ({
  interestPeriods,
  loanYears,
  onAddPeriod,
  onRemovePeriod,
  onUpdatePeriod,
  getAvailableYears
}: InterestPeriodEditorProps) => {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-4">
        <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
           อัตราดอกเบี้ย
          <Button
            variant="default"
            size="sm"
            onClick={onAddPeriod}
            disabled={interestPeriods[interestPeriods.length - 1]?.endYear >= loanYears}
            className="h-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>สามารถกำหกับอัตราดอกเบี้ยได้หลายช่วง และสามารถกำหนดเงินงวดคงที่ได้</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-3 sm:p-4">
        {interestPeriods.map((period, index) => (
          <div key={index} className="md:grid md:grid-cols-10 flex gap-2 items-end">
            <div className="col-span-2">
              <Label className="text-xs">ปีที่เริ่ม</Label>
              <Select
                value={period.startYear.toString()}
                onValueChange={(value) => onUpdatePeriod(index, 'startYear', Number(value))}
              >
                <SelectTrigger className="h-8 w-full text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableYears(index, false).map(year => (
                    <SelectItem key={year} value={year.toString()} className="text-xs sm:text-sm">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label className="text-xs">ปีที่สิ้นสุด</Label>
              <Select
                value={period.endYear.toString()}
                onValueChange={(value) => onUpdatePeriod(index, 'endYear', Number(value))}
              >
                <SelectTrigger className="h-8 w-full text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableYears(index, true).map(year => (
                    <SelectItem key={year} value={year.toString()} className="text-xs sm:text-sm">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label className="text-xs">อัตราดอกเบี้ย (%)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={period.rate === 0 ? '' : period.rate}
                onChange={(e) => onUpdatePeriod(index, 'rate', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                className="h-8 w-full text-xs sm:text-sm"
              />
            </div>
            
            <div className="col-span-3">
              <Label className="text-xs">เงินงวดคงที่ (บาท)</Label>
              <Input
                type="number"
                placeholder="คำนวณอัตโนมัติ"
                value={period.fixedPayment || ''}
                onChange={(e) => onUpdatePeriod(index, 'fixedPayment', e.target.value ? Number(e.target.value) : undefined)}
                className="h-8 w-full text-xs sm:text-sm"
              />
            </div>
            
            <div className="col-span-1 flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemovePeriod(index)}
                disabled={interestPeriods.length === 1}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
