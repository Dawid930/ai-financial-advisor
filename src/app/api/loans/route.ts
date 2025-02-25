import { NextRequest, NextResponse } from "next/server"
import { scrapeAllBankLoanData } from "@/server/services/loanScraper"
import { LoanOffer } from "@/types/loans"

// Cache loan offers for 1 hour to avoid excessive scraping
let cachedLoanOffers: LoanOffer[] | null = null
let lastFetchTime: number = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * GET handler for /api/loans
 * Fetches loan offers from financial institutions
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const forceRefresh = url.searchParams.get("refresh") === "true"

    // Check if we have cached data and it's still valid
    const currentTime = Date.now()
    if (
      !forceRefresh &&
      cachedLoanOffers &&
      currentTime - lastFetchTime < CACHE_DURATION
    ) {
      return NextResponse.json({
        success: true,
        data: cachedLoanOffers,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      })
    }

    // Fetch fresh loan data
    const loanOffers = await scrapeAllBankLoanData()

    // Update cache
    cachedLoanOffers = loanOffers
    lastFetchTime = currentTime

    return NextResponse.json({
      success: true,
      data: loanOffers,
      cached: false,
      lastUpdated: new Date(lastFetchTime).toISOString(),
    })
  } catch (error) {
    console.error("Error fetching loan offers:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch loan offers" },
      { status: 500 }
    )
  }
}
