export interface LoanOffer {
  id: string
  bankName: string
  logoUrl?: string
  interestRate: number
  minAmount: number
  maxAmount: number
  minDuration: number
  maxDuration: number
  fees: {
    establishment?: number
    monthly?: number
    early_repayment?: number
  }
  requirements: {
    min_income?: number
    min_credit_score?: number
    employment_status?: string[]
  }
  affiliateLink?: string
  featured?: boolean
}

export interface LoanCalculation {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  amortizationSchedule?: Array<{
    month: number
    payment: number
    principal: number
    interest: number
    remainingBalance: number
  }>
}

export interface LoanComparisonResult {
  loanAmount: number
  duration: number
  offers: Array<{
    offer: LoanOffer
    calculation: LoanCalculation
  }>
}
