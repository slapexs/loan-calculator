export interface InterestPeriod {
  startYear: number;
  endYear: number;
  rate: number;
  fixedPayment?: number;
}

export interface PaymentDetail {
  month: number;
  year: number;
  remainingPrincipal: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  overpayment: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  lastPaymentDate: string;
}
