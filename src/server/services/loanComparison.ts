import { LoanOffer, LoanCalculation, LoanComparisonResult } from "@/types/loans"

/**
 * Calculates the monthly payment for a loan
 * @param amount The loan amount
 * @param interestRate The annual interest rate (as a percentage)
 * @param durationMonths The loan duration in months
 * @returns The monthly payment amount
 */
export function calculateMonthlyPayment(
  amount: number,
  interestRate: number,
  durationMonths: number
): number {
  // Convert annual interest rate to monthly rate
  const monthlyRate = interestRate / 100 / 12

  // Calculate monthly payment using the loan formula
  // P = (r * PV) / (1 - (1 + r)^-n)
  // Where:
  // P = Monthly payment
  // r = Monthly interest rate
  // PV = Present value (loan amount)
  // n = Number of payments (loan duration in months)
  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1)
  )
}

/**
 * Calculates the total payment for a loan
 * @param monthlyPayment The monthly payment amount
 * @param durationMonths The loan duration in months
 * @returns The total payment amount
 */
export function calculateTotalPayment(
  monthlyPayment: number,
  durationMonths: number
): number {
  return monthlyPayment * durationMonths
}

/**
 * Calculates the total interest paid for a loan
 * @param totalPayment The total payment amount
 * @param loanAmount The original loan amount
 * @returns The total interest paid
 */
export function calculateTotalInterest(
  totalPayment: number,
  loanAmount: number
): number {
  return totalPayment - loanAmount
}

/**
 * Generates an amortization schedule for a loan
 * @param loanAmount The loan amount
 * @param interestRate The annual interest rate (as a percentage)
 * @param durationMonths The loan duration in months
 * @returns The amortization schedule
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  interestRate: number,
  durationMonths: number
): LoanCalculation["amortizationSchedule"] {
  const monthlyRate = interestRate / 100 / 12
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    interestRate,
    durationMonths
  )
  const schedule = []

  let remainingBalance = loanAmount

  for (let month = 1; month <= durationMonths; month++) {
    // Calculate interest for this month
    const interestPayment = remainingBalance * monthlyRate

    // Calculate principal for this month
    const principalPayment = monthlyPayment - interestPayment

    // Update remaining balance
    remainingBalance -= principalPayment

    // Add to schedule
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance), // Ensure balance doesn't go below 0
    })
  }

  return schedule
}

/**
 * Calculates loan details for a given loan offer
 * @param offer The loan offer
 * @param loanAmount The loan amount
 * @param durationMonths The loan duration in months
 * @param includeAmortizationSchedule Whether to include the amortization schedule
 * @returns The loan calculation
 */
export function calculateLoanDetails(
  offer: LoanOffer,
  loanAmount: number,
  durationMonths: number,
  includeAmortizationSchedule = false
): LoanCalculation {
  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    offer.interestRate,
    durationMonths
  )

  // Calculate total payment
  const totalPayment = calculateTotalPayment(monthlyPayment, durationMonths)

  // Calculate total interest
  const totalInterest = calculateTotalInterest(totalPayment, loanAmount)

  // Generate amortization schedule if requested
  const amortizationSchedule = includeAmortizationSchedule
    ? generateAmortizationSchedule(
        loanAmount,
        offer.interestRate,
        durationMonths
      )
    : undefined

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    amortizationSchedule,
  }
}

/**
 * Compares multiple loan offers for a given loan amount and duration
 * @param offers The loan offers to compare
 * @param loanAmount The loan amount
 * @param durationMonths The loan duration in months
 * @param includeAmortizationSchedule Whether to include the amortization schedule
 * @returns The loan comparison result
 */
export function compareLoanOffers(
  offers: LoanOffer[],
  loanAmount: number,
  durationMonths: number,
  includeAmortizationSchedule = false
): LoanComparisonResult {
  // Filter offers based on loan amount and duration
  const eligibleOffers = offers.filter(
    (offer) =>
      loanAmount >= offer.minAmount &&
      loanAmount <= offer.maxAmount &&
      durationMonths >= offer.minDuration &&
      durationMonths <= offer.maxDuration
  )

  // Calculate loan details for each eligible offer
  const comparisonResults = eligibleOffers.map((offer) => ({
    offer,
    calculation: calculateLoanDetails(
      offer,
      loanAmount,
      durationMonths,
      includeAmortizationSchedule
    ),
  }))

  // Sort by monthly payment (lowest first)
  comparisonResults.sort(
    (a, b) => a.calculation.monthlyPayment - b.calculation.monthlyPayment
  )

  return {
    loanAmount,
    duration: durationMonths,
    offers: comparisonResults,
  }
}
