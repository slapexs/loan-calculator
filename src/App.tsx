import { LoanInputForm } from './components/LoanInputForm';
import { InterestPeriodEditor } from './components/InterestPeriodEditor';
import { SummaryCards } from './components/SummaryCards';
import { PaymentScheduleTable } from './components/PaymentScheduleTable';
import { useLoanCalculator } from './hooks/useLoanCalculator';
import { SparklesText } from './components/magicui/sparkles-text';

const HomeLoanCalculator = () => {
  const {
    loanAmount,
    loanYears,
    interestPeriods,
    paymentDetails,
    monthlyOverpayments,
    setLoanAmount,
    setLoanYears,
    addInterestPeriod,
    removeInterestPeriod,
    updateInterestPeriod,
    updateMonthlyOverpayment,
    getAvailableYears
  } = useLoanCalculator();

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="text-center mb-4 sm:mb-8">
          <SparklesText className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            เครื่องมือคำนวณสินเชื่อบ้าน
          </SparklesText>
          <p className="text-sm sm:text-base text-gray-600">คำนวณการผ่อนชำระและวางแผนการเงินของคุณ</p>
        </div>

        {/* Input Section - Stack on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <LoanInputForm
            loanAmount={loanAmount}
            loanYears={loanYears}
            onLoanAmountChange={setLoanAmount}
            onLoanYearsChange={setLoanYears}
          />

          <InterestPeriodEditor
            interestPeriods={interestPeriods}
            loanYears={loanYears}
            onAddPeriod={addInterestPeriod}
            onRemovePeriod={removeInterestPeriod}
            onUpdatePeriod={updateInterestPeriod}
            getAvailableYears={getAvailableYears}
          />
        </div>

        {/* Summary Section */}
        <SummaryCards
          paymentDetails={paymentDetails}
          interestPeriods={interestPeriods}
          loanYears={loanYears}
        />

        {/* Payment Schedule Table */}
        <PaymentScheduleTable
          paymentDetails={paymentDetails}
          monthlyOverpayments={monthlyOverpayments}
          onUpdateMonthlyOverpayment={updateMonthlyOverpayment}
        />
      </div>
    </div>
  );
};

export default HomeLoanCalculator;