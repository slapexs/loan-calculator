import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator, RotateCcwIcon } from 'lucide-react';
import { InterestPeriod } from '../types';
import { cn } from '@/lib/utils';

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              อัตราดอกเบี้ย
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              กำหนดอัตราดอกเบี้ยและเงินจ่ายเกินสำหรับแต่ละช่วงเวลา
            </CardDescription>
          </div>
          <div className="flex gap-2">
          <Button
              variant="default"
              size="sm"
              onClick={onAddPeriod}
              disabled={interestPeriods[interestPeriods.length - 1]?.endYear >= loanYears}
              className="h-8 gap-1 text-xs sm:text-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              เพิ่มช่วงเวลา
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="h-8 gap-1 text-xs sm:text-sm"
            >
              <RotateCcwIcon className="h-3.5 w-3.5" />
              รีเซ็ต
            </Button>
            
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-3 sm:p-4">
        <div className="relative">
          <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0">
            <div className="inline-block min-w-full px-4 sm:px-0">
              <div className="min-w-[800px] sm:min-w-0">
                <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <div>ช่วงเวลา (ปี)</div>
                  <div>อัตราดอกเบี้ย</div>
                  <div>เงินงวดคงที่ (บาท/เดือน)</div>
                  <div>จ่ายเกิน (บาท/ปี)</div>
                  <div></div>
                </div>
                
                <div className="space-y-3">
                  {interestPeriods.map((period, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "grid grid-cols-5 gap-2 items-center p-3 rounded-lg",
                        index % 2 === 0 ? "bg-muted/20" : ""
                      )}
                    >
                      <div className="col-span-1 flex items-center gap-2">
                        <Select
                          value={period.startYear.toString()}
                          onValueChange={(value) => onUpdatePeriod(index, 'startYear', Number(value))}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableYears(index, false).map(year => (
                              <SelectItem key={`start-${year}`} value={year.toString()} className="text-xs">
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="whitespace-nowrap text-xs">ถึง</span>
                        <Select
                          value={period.endYear.toString()}
                          onValueChange={(value) => onUpdatePeriod(index, 'endYear', Number(value))}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableYears(index, true).map(year => (
                              <SelectItem key={`end-${year}`} value={year.toString()} className="text-xs">
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          value={period.rate === 0 ? '' : period.rate}
                          onChange={(e) => onUpdatePeriod(index, 'rate', e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                          className="h-8 w-full text-sm text-right pr-6"
                          placeholder="0.0"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                      </div>
                      
                      <div className="col-span-1">
                        <Input
                          type="number"
                          placeholder="คำนวณอัตโนมัติ"
                          value={period.fixedPayment || ''}
                          onChange={(e) => onUpdatePeriod(index, 'fixedPayment', e.target.value ? Number(e.target.value) : undefined)}
                          className="h-8 w-full text-sm text-right"
                        />
                      </div>
                      
                      <div className="col-span-1">
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="0"
                            value={period.overpayment || ''}
                            onChange={(e) => onUpdatePeriod(index, 'overpayment', e.target.value ? Number(e.target.value) : 0)}
                            className="h-8 w-full text-sm text-right pr-8"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/ปี</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1 flex justify-start">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemovePeriod(index);
                          }}
                          disabled={interestPeriods.length === 1}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          title="ลบช่วงนี้"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 px-2">
          <p>• ปล่อยช่อง "เงินงวดคงที่" ว่างไว้เพื่อคำนวณอัตโนมัติตามอัตราดอกเบี้ย</p>
          <p>• ระบุ "จ่ายเกิน" เป็นจำนวนเงินที่ต้องการชำระเพิ่มเติมในแต่ละปี</p>
          <p className="sm:hidden text-blue-500 mt-1">• เลื่อนซ้าย-ขวาเพื่อดูข้อมูลเพิ่มเติม</p>
        </div>
      </CardContent>
    </Card>
  );
};
