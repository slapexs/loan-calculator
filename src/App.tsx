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

      {/* Simple Modal for Chart */}
      {isChartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">กราฟแสดงการผ่อนชำระ</h3>
              <button 
                onClick={() => setIsChartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-auto">
              <div className="min-h-[500px] w-full">
                <LoanCharts paymentDetails={paymentDetails} />
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
