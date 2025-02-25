import { NextRequest, NextResponse } from "next/server"
import { scrapeAllBankLoanData } from "@/server/services/loanScraper"
import { compareLoanOffers } from "@/server/services/loanComparison"
import { LoanOffer } from "@/types/loans"
import { db } from "@/server/db"
import { loanComparisons } from "@/server/db/schema"
import { auth } from "@clerk/nextjs/server"

// Cache loan offers for 1 hour to avoid excessive scraping
let cachedLoanOffers: LoanOffer[] | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Define the expected request body type
interface CompareLoansRequestBody {
  loanAmount: number
  loanDuration: number
  includeAmortizationSchedule?: boolean
}

/**
 * POST handler for /api/loans/compare
 * Compares loan offers based on the provided parameters
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    // Parse and validate request body
    const body = (await req.json()) as unknown

    // Type guard to validate the request body
    const isValidBody = (data: unknown): data is CompareLoansRequestBody => {
      return (
        typeof data === "object" &&
        data !== null &&
        "loanAmount" in data &&
        typeof (data as any).loanAmount === "number" &&
        "loanDuration" in data &&
        typeof (data as any).loanDuration === "number"
      )
    }

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request body. Loan amount and duration are required and must be numbers.",
        },
        { status: 400 }
      )
    }

    const {
      loanAmount,
      loanDuration,
      includeAmortizationSchedule = false,
    } = body

    if (!loanAmount || !loanDuration) {
      return NextResponse.json(
        { success: false, error: "Loan amount and duration are required" },
        { status: 400 }
      )
    }

    // Check if we have cached loan offers and they're still valid
    const currentTime = Date.now()
    if (!cachedLoanOffers || currentTime - lastFetchTime >= CACHE_DURATION) {
      // Fetch fresh loan data
      cachedLoanOffers = await scrapeAllBankLoanData()
      lastFetchTime = currentTime
    }

    // Compare loan offers
    const comparisonResult = compareLoanOffers(
      cachedLoanOffers,
      loanAmount,
      loanDuration,
      includeAmortizationSchedule
    )

    // Save comparison to database if user is authenticated
    if (userId) {
      try {
        // Extract the basic results for storage
        const results = comparisonResult.offers.map((offer) => ({
          bankId: offer.offer.id,
          interestRate: offer.offer.interestRate,
          monthlyPayment: offer.calculation.monthlyPayment,
          totalPayment: offer.calculation.totalPayment,
        }))

        // Store in database
        await db.insert(loanComparisons).values({
          userId: Number(userId),
          loanAmount: loanAmount.toString(),
          duration: loanDuration,
          results,
        })
      } catch (dbError) {
        console.error("Error saving loan comparison to database:", dbError)
        // Continue with the response even if database save fails
      }
    }

    return NextResponse.json({
      success: true,
      data: comparisonResult,
      cached: currentTime !== lastFetchTime,
      lastUpdated: new Date(lastFetchTime).toISOString(),
    })
  } catch (error) {
    console.error("Error comparing loan offers:", error)
    return NextResponse.json(
      { success: false, error: "Failed to compare loan offers" },
      { status: 500 }
    )
  }
}
