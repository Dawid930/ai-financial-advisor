"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  Info,
  ArrowRight,
  Filter,
  RefreshCw,
  Star,
} from "lucide-react"
import Link from "next/link"

// Types for loan data
interface LoanOffer {
  id: string
  bankName: string
  logoUrl: string
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

// Mock data for initial development
const mockLoanOffers: LoanOffer[] = [
  {
    id: "1",
    bankName: "First National Bank",
    logoUrl: "https://placehold.co/100x50/4F46E5/FFFFFF?text=FNB",
    interestRate: 5.99,
    minAmount: 5000,
    maxAmount: 50000,
    minDuration: 12,
    maxDuration: 60,
    fees: {
      establishment: 150,
      monthly: 10,
      early_repayment: 0,
    },
    requirements: {
      min_income: 30000,
      min_credit_score: 650,
      employment_status: ["Full-time", "Part-time", "Self-employed"],
    },
    affiliateLink: "https://example.com/fnb",
    featured: true,
  },
  {
    id: "2",
    bankName: "City Credit Union",
    logoUrl: "https://placehold.co/100x50/10B981/FFFFFF?text=CCU",
    interestRate: 6.49,
    minAmount: 2000,
    maxAmount: 30000,
    minDuration: 6,
    maxDuration: 48,
    fees: {
      establishment: 100,
      monthly: 5,
      early_repayment: 1,
    },
    requirements: {
      min_income: 25000,
      min_credit_score: 600,
      employment_status: ["Full-time", "Part-time"],
    },
    affiliateLink: "https://example.com/ccu",
  },
  {
    id: "3",
    bankName: "Global Finance",
    logoUrl: "https://placehold.co/100x50/F59E0B/FFFFFF?text=GF",
    interestRate: 7.25,
    minAmount: 10000,
    maxAmount: 100000,
    minDuration: 24,
    maxDuration: 84,
    fees: {
      establishment: 200,
      monthly: 15,
      early_repayment: 2,
    },
    requirements: {
      min_income: 40000,
      min_credit_score: 700,
      employment_status: ["Full-time"],
    },
    affiliateLink: "https://example.com/gf",
  },
]

// Function to calculate monthly payment
const calculateMonthlyPayment = (
  amount: number,
  interestRate: number,
  durationMonths: number
) => {
  const monthlyRate = interestRate / 100 / 12
  return (
    (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1)
  )
}

// Function to calculate total payment
const calculateTotalPayment = (
  monthlyPayment: number,
  durationMonths: number
) => {
  return monthlyPayment * durationMonths
}

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState<number>(10000)
  const [loanDuration, setLoanDuration] = useState<number>(36)
  const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sortBy, setSortBy] = useState<string>("interestRate")
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Function to fetch loan offers from our API
  const fetchLoanOffers = async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = forceRefresh ? "/api/loans?refresh=true" : "/api/loans"

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch loan offers: ${response.status}`)
      }

      const data = (await response.json()) as {
        success: boolean
        data: LoanOffer[]
        lastUpdated: string
        error?: string
      }

      if (data.success) {
        setLoanOffers(data.data)
        setLastUpdated(data.lastUpdated)
      } else {
        throw new Error(data.error || "Failed to fetch loan offers")
      }
    } catch (error) {
      console.error("Error fetching loan offers:", error)
      setError("Failed to fetch loan offers. Please try again later.")
      // Fallback to mock data if API fails
      setLoanOffers(mockLoanOffers)
    } finally {
      setIsLoading(false)
    }
  }

  // Sort loan offers based on selected criteria
  const sortedLoanOffers = [...loanOffers].sort((a, b) => {
    if (sortBy === "interestRate") {
      return a.interestRate - b.interestRate
    } else if (sortBy === "bankName") {
      return a.bankName.localeCompare(b.bankName)
    } else if (sortBy === "maxAmount") {
      return b.maxAmount - a.maxAmount
    }
    return 0
  })

  // Filter loan offers based on amount and duration
  const filteredLoanOffers = sortedLoanOffers.filter(
    (offer) =>
      loanAmount >= offer.minAmount &&
      loanAmount <= offer.maxAmount &&
      loanDuration >= offer.minDuration &&
      loanDuration <= offer.maxDuration
  )

  // Load loan offers on initial render
  useEffect(() => {
    fetchLoanOffers()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Compare Loan Offers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find the best loan offers from top financial institutions. Customize
          your loan amount and duration to see personalized rates.
        </p>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      {/* Loan Calculator */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Loan Calculator
          </CardTitle>
          <CardDescription>
            Adjust the loan amount and duration to see available offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Loan Amount: ${loanAmount.toLocaleString()}
              </label>
              <Input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$1,000</span>
                <span>$100,000</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Loan Duration: {loanDuration} months
              </label>
              <Input
                type="range"
                min="6"
                max="84"
                step="6"
                value={loanDuration}
                onChange={(e) => setLoanDuration(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>6 months</span>
                <span>84 months</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setSortBy("interestRate")}
              className={sortBy === "interestRate" ? "bg-primary/10" : ""}
            >
              Interest Rate
            </Button>
            <Button
              variant="outline"
              onClick={() => setSortBy("bankName")}
              className={sortBy === "bankName" ? "bg-primary/10" : ""}
            >
              Bank Name
            </Button>
            <Button
              variant="outline"
              onClick={() => setSortBy("maxAmount")}
              className={sortBy === "maxAmount" ? "bg-primary/10" : ""}
            >
              Max Amount
            </Button>
          </div>
          <Button onClick={() => fetchLoanOffers(true)} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Offers
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="mb-8 border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <Info className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && loanOffers.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary/70" />
            <p className="text-muted-foreground">Loading loan offers...</p>
          </div>
        </div>
      )}

      {/* Loan Offers */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-6">
          {filteredLoanOffers.length > 0 ? (
            filteredLoanOffers.map((offer) => {
              const monthlyPayment = calculateMonthlyPayment(
                loanAmount,
                offer.interestRate,
                loanDuration
              )
              const totalPayment = calculateTotalPayment(
                monthlyPayment,
                loanDuration
              )

              return (
                <Card
                  key={offer.id}
                  className={`overflow-hidden ${
                    offer.featured ? "border-primary/50 shadow-lg" : ""
                  }`}
                >
                  {offer.featured && (
                    <div className="bg-primary text-primary-foreground py-1 px-4 text-xs font-medium text-center">
                      Featured Offer
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 flex flex-col justify-center items-center border-r">
                      <div className="mb-4">
                        <img
                          src={offer.logoUrl}
                          alt={offer.bankName}
                          className="h-12 object-contain"
                        />
                      </div>
                      <h3 className="font-medium text-center">
                        {offer.bankName}
                      </h3>
                    </div>

                    <div className="p-6 flex flex-col justify-center items-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {offer.interestRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Interest Rate
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-center items-center">
                      <div className="text-2xl font-bold mb-1">
                        ${monthlyPayment.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Monthly Payment
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Total: ${totalPayment.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col justify-center items-center">
                      <Button asChild className="w-full mb-2">
                        <Link href={offer.affiliateLink || "#"} target="_blank">
                          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Info className="mr-2 h-4 w-4" /> Details
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 px-6 py-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-background">
                        ${offer.minAmount.toLocaleString()} - $
                        {offer.maxAmount.toLocaleString()}
                      </Badge>
                      <Badge variant="outline" className="bg-background">
                        {offer.minDuration} - {offer.maxDuration} months
                      </Badge>
                      {offer.fees.establishment &&
                        offer.fees.establishment > 0 && (
                          <Badge variant="outline" className="bg-background">
                            ${offer.fees.establishment} establishment fee
                          </Badge>
                        )}
                      {offer.fees.monthly && offer.fees.monthly > 0 && (
                        <Badge variant="outline" className="bg-background">
                          ${offer.fees.monthly}/month fee
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-8 text-center">
              <div className="mb-4 flex justify-center">
                <Filter className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                No matching loan offers
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your loan amount or duration to see more offers.
              </p>
              <Button
                onClick={() => {
                  setLoanAmount(10000)
                  setLoanDuration(36)
                }}
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Loan Data Source Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Our Loan Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We collect real-time loan data from multiple financial institutions
            to provide you with accurate and up-to-date information. Our data is
            refreshed daily to ensure you get the most current rates and offers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Real-Time Updates
              </h4>
              <p className="text-sm text-muted-foreground">
                Our system automatically fetches the latest loan offers and
                rates from financial institutions daily.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" /> Verified Partners
              </h4>
              <p className="text-sm text-muted-foreground">
                We partner directly with banks and lenders to ensure the
                accuracy of our loan information.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4" /> Accurate Calculations
              </h4>
              <p className="text-sm text-muted-foreground">
                Our loan calculator uses the same formulas that banks use to
                calculate your payments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
