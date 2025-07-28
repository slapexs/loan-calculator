import { LoanInputForm } from "./components/LoanInputForm";
import { InterestPeriodEditor } from "./components/InterestPeriodEditor";
import { SummaryCards } from "./components/SummaryCards";
import { PaymentScheduleTable } from "./components/PaymentScheduleTable";
import { Footer } from "./components/Footer";
import { useLoanCalculator } from "./hooks/useLoanCalculator";
import { SparklesText } from "./components/magicui/sparkles-text";
import { FloatingDock } from "./components/FloatingDock";
import { LoanCharts } from "./components/LoanCharts";
import { useState } from "react";
// Simple modal implementation to replace dialog

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
    getAvailableYears,
  } = useLoanCalculator();

  const [isChartOpen, setIsChartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <SparklesText className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
              เครื่องมือคำนวณสินเชื่อบ้าน
            </SparklesText>
            <p className="text-sm sm:text-base text-gray-600">
              คำนวณการผ่อนชำระและวางแผนการเงินของคุณ
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Input Section - Stack on mobile, 2 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-6 md:gap-4 gap-y-4">
            <div className="col-span-2 space-y-2">
              <LoanInputForm
                loanAmount={loanAmount}
                loanYears={loanYears}
                onLoanAmountChange={setLoanAmount}
                onLoanYearsChange={setLoanYears}
              />
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 text-xs text-yellow-800">
                <strong>ข้อจำกัดความรับผิดชอบ:</strong>{" "}
                ข้อมูลทั้งหมดเป็นการคำนวณคร่าวๆ เท่านั้น
                ไม่ใช่ข้อมูลจริงจากธนาคาร
                กรุณาติดต่อธนาคารโดยตรงเพื่อข้อมูลที่แม่นยำ
              </div>
            </div>

            <div className="col-span-4">
              <InterestPeriodEditor
                interestPeriods={interestPeriods}
                loanYears={loanYears}
                onAddPeriod={addInterestPeriod}
                onRemovePeriod={removeInterestPeriod}
                onUpdatePeriod={updateInterestPeriod}
                getAvailableYears={getAvailableYears}
              />
            </div>
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
            onShowChart={() => setIsChartOpen(true)}
          />
        </div>
      </main>

      {/* Modern Glass Effect Modal for Chart */}
      {isChartOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setIsChartOpen(false)}
        >
          {/* Backdrop with blur */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Glass effect container */}
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white">
            {/* Glass header */}
            <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">กราฟแสดงการผ่อนชำระ</h3>
              <button 
                onClick={() => setIsChartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100/50 transition-colors text-gray-600 hover:text-gray-800"
                aria-label="ปิด"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Glass content */}
            <div className="flex-1 overflow-auto bg-white/60 backdrop-blur-sm">
              <div className="p-6">
                <div className="min-h-[500px] w-full">
                  <LoanCharts paymentDetails={paymentDetails} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Dock */}
      <FloatingDock
        paymentDetails={paymentDetails}
        monthlyOverpayments={monthlyOverpayments}
        onShowChart={() => setIsChartOpen(true)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeLoanCalculator;
