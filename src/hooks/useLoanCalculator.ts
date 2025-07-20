import { useState, useEffect } from 'react';
import { InterestPeriod, PaymentDetail } from '../types';

export const useLoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanYears, setLoanYears] = useState(30);
  const [interestPeriods, setInterestPeriods] = useState<InterestPeriod[]>([
    { startYear: 1, endYear: 3, rate: 3.0, fixedPayment: undefined },
    { startYear: 4, endYear: 30, rate: 5.0, fixedPayment: undefined }
  ]);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const [monthlyOverpayments, setMonthlyOverpayments] = useState<{[month: number]: number}>({});

  // Calculate monthly payment and payment schedule
  const calculatePaymentSchedule = () => {
    if (!loanAmount || !loanYears || interestPeriods.length === 0) return;

    const monthlyDetails: PaymentDetail[] = [];
    let remainingPrincipal = loanAmount;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;
    
    const totalMonths = loanYears * 12;

    for (let month = 1; month <= totalMonths; month++) {
      const currentYear = Math.ceil(month / 12);
      
      const applicablePeriod = interestPeriods.find(period => 
        currentYear >= period.startYear && currentYear <= period.endYear
      );
      
      if (!applicablePeriod) continue;
      
      const monthlyRate = applicablePeriod.rate / 100 / 12;
      const remainingMonths = totalMonths - month + 1;
      
      let monthlyPayment = 0;
      if (applicablePeriod.fixedPayment) {
        monthlyPayment = applicablePeriod.fixedPayment;
      } else {
        if (monthlyRate > 0) {
          monthlyPayment = remainingPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                           (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        } else {
          monthlyPayment = remainingPrincipal / remainingMonths;
        }
      }
      
      const interestPayment = remainingPrincipal * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      
      const monthlyOverpayment = monthlyOverpayments[month] || 0;
      principalPayment += monthlyOverpayment;
      monthlyPayment += monthlyOverpayment;
      
      let overpayment = 0;
      
      if (principalPayment > remainingPrincipal) {
        overpayment = principalPayment - remainingPrincipal;
        principalPayment = remainingPrincipal;
        monthlyPayment = principalPayment + interestPayment;
      }
      
      remainingPrincipal -= principalPayment;
      totalInterestPaid += interestPayment;
      totalPrincipalPaid += principalPayment;
      
      const paymentDate = new Date();
      paymentDate.setMonth(paymentDate.getMonth() + month - 1);
      
      monthlyDetails.push({
        month,
        year: currentYear,
        remainingPrincipal: remainingPrincipal,
        monthlyPayment,
        principalPayment,
        interestPayment,
        overpayment: monthlyOverpayment,
        totalInterestPaid,
        totalPrincipalPaid,
        lastPaymentDate: paymentDate.toLocaleDateString('th-TH')
      });
      
      if (remainingPrincipal <= 0) break;
    }
    
    setPaymentDetails(monthlyDetails);
  };

  useEffect(() => {
    calculatePaymentSchedule();
  }, [loanAmount, loanYears, interestPeriods, monthlyOverpayments]);

  const addInterestPeriod = () => {
    const lastPeriod = interestPeriods[interestPeriods.length - 1];
    const nextStartYear = lastPeriod ? lastPeriod.endYear + 1 : 1;
    
    if (nextStartYear <= loanYears) {
      setInterestPeriods([...interestPeriods, {
        startYear: nextStartYear,
        endYear: loanYears,
        rate: 5.0,
        fixedPayment: undefined
      }]);
    }
  };

  const removeInterestPeriod = (index: number) => {
    if (interestPeriods.length > 1) {
      setInterestPeriods(interestPeriods.filter((_, i) => i !== index));
    }
  };

  const updateInterestPeriod = (index: number, field: keyof InterestPeriod, value: number | undefined) => {
    const newPeriods = [...interestPeriods];
    newPeriods[index] = { ...newPeriods[index], [field]: value };
    
    if (field === 'endYear' && typeof value === 'number' && index < newPeriods.length - 1) {
      for (let i = index + 1; i < newPeriods.length; i++) {
        if (newPeriods[i].startYear <= value) {
          newPeriods[i].startYear = value + 1;
        }
      }
    }
    
    setInterestPeriods(newPeriods);
  };

  const updateMonthlyOverpayment = (month: number, amount: number) => {
    setMonthlyOverpayments(prev => ({
      ...prev,
      [month]: amount
    }));
  };

  const getAvailableYears = (index: number, isEndYear: boolean) => {
    const years = [];
    const minYear = isEndYear ? interestPeriods[index].startYear : 
                   (index > 0 ? interestPeriods[index - 1].endYear + 1 : 1);
    const maxYear = isEndYear ? loanYears : 
                   (index < interestPeriods.length - 1 ? interestPeriods[index + 1].startYear - 1 : loanYears);
    
    for (let i = minYear; i <= maxYear; i++) {
      years.push(i);
    }
    return years;
  };

  return {
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
  };
};
