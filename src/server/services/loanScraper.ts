import { LoanOffer } from "@/types/loans"
import puppeteer from "puppeteer"
import { z } from "zod"

// Define the schema for loan data validation
const loanDataSchema = z.object({
  bankName: z.string(),
  logoUrl: z.string().url().optional(),
  interestRate: z.number().min(0),
  minAmount: z.number().min(0),
  maxAmount: z.number().min(0),
  minDuration: z.number().min(0),
  maxDuration: z.number().min(0),
  fees: z.object({
    establishment: z.number().optional(),
    monthly: z.number().optional(),
    early_repayment: z.number().optional(),
  }),
  requirements: z.object({
    min_income: z.number().optional(),
    min_credit_score: z.number().optional(),
    employment_status: z.array(z.string()).optional(),
  }),
  affiliateLink: z.string().url().optional(),
  featured: z.boolean().optional(),
})

// Configuration for different bank websites
const bankScraperConfigs = [
  {
    name: "First National Bank",
    url: "https://www.fnb.co.za/loans/personal-loan.html",
    logoUrl: "https://placehold.co/100x50/4F46E5/FFFFFF?text=FNB",
    scraper: async (): Promise<Partial<LoanOffer>> => {
      // In a real implementation, this would use Puppeteer to scrape the website
      // For now, we'll return mock data
      return {
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
      }
    },
  },
  {
    name: "City Credit Union",
    url: "https://www.citycu.com/loans.html",
    logoUrl: "https://placehold.co/100x50/10B981/FFFFFF?text=CCU",
    scraper: async (): Promise<Partial<LoanOffer>> => {
      return {
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
      }
    },
  },
  // Add more banks as needed
]

/**
 * Scrapes loan data from a specific bank's website
 * @param bankName The name of the bank to scrape
 * @returns The scraped loan data
 */
export async function scrapeBankLoanData(
  bankName: string
): Promise<LoanOffer | null> {
  try {
    const bankConfig = bankScraperConfigs.find(
      (config) => config.name === bankName
    )

    if (!bankConfig) {
      console.error(`No scraper configuration found for bank: ${bankName}`)
      return null
    }

    // In a real implementation, this would launch a browser and scrape the website
    // For now, we'll just call the mock scraper function
    const loanData = await bankConfig.scraper()

    // Validate the data using Zod
    const validatedData = loanDataSchema.parse(loanData)

    // Generate a unique ID for the loan offer
    const id = `${bankName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    return {
      id,
      ...validatedData,
    } as LoanOffer
  } catch (error) {
    console.error(`Error scraping loan data for ${bankName}:`, error)
    return null
  }
}

/**
 * Scrapes loan data from all configured banks
 * @returns An array of loan offers
 */
export async function scrapeAllBankLoanData(): Promise<LoanOffer[]> {
  const loanOffers: LoanOffer[] = []

  for (const bankConfig of bankScraperConfigs) {
    const loanOffer = await scrapeBankLoanData(bankConfig.name)
    if (loanOffer) {
      loanOffers.push(loanOffer)
    }
  }

  return loanOffers
}

/**
 * Implements a real web scraper using Puppeteer
 * This is a template for how to scrape a real bank website
 * @param url The URL of the bank's loan page
 * @returns The scraped loan data
 */
export async function realWebScraper(
  url: string
): Promise<Partial<LoanOffer> | null> {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Navigate to the bank's loan page
    await page.goto(url, { waitUntil: "networkidle2" })

    // Example: Extract interest rate
    // This is just an example and would need to be customized for each bank's website
    const interestRateElement = await page.$(".interest-rate")
    const interestRateText = interestRateElement
      ? await page.evaluate(
          (el: Element) => el.textContent,
          interestRateElement
        )
      : null
    const interestRate = interestRateText
      ? parseFloat(interestRateText.replace(/[^0-9.]/g, ""))
      : null

    // Example: Extract loan amount range
    const minAmountElement = await page.$(".min-amount")
    const minAmountText = minAmountElement
      ? await page.evaluate((el: Element) => el.textContent, minAmountElement)
      : null
    const minAmount = minAmountText
      ? parseFloat(minAmountText.replace(/[^0-9.]/g, ""))
      : null

    const maxAmountElement = await page.$(".max-amount")
    const maxAmountText = maxAmountElement
      ? await page.evaluate((el: Element) => el.textContent, maxAmountElement)
      : null
    const maxAmount = maxAmountText
      ? parseFloat(maxAmountText.replace(/[^0-9.]/g, ""))
      : null

    // Close the browser
    await browser.close()

    // Return the scraped data
    return {
      interestRate: interestRate || 0,
      minAmount: minAmount || 0,
      maxAmount: maxAmount || 0,
      // Add more fields as needed
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return null
  }
}

/**
 * Fetches loan data from an API
 * This is an alternative to web scraping if the bank provides an API
 * @param apiUrl The URL of the bank's API
 * @param apiKey The API key for authentication
 * @returns The loan data from the API
 */
export async function fetchLoanDataFromApi(
  apiUrl: string,
  apiKey: string
): Promise<Partial<LoanOffer> | null> {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Transform the API response to match our LoanOffer structure
    // Type assertion is used here as we trust the API to return the expected structure
    const typedData = data as {
      institution_name: string
      interest_rate: number
      min_loan_amount: number
      max_loan_amount: number
      min_term_months: number
      max_term_months: number
      establishment_fee: number
      monthly_fee: number
      early_repayment_fee: number
      min_income_requirement: number
      min_credit_score: number
      eligible_employment_statuses: string[]
      application_url: string
    }

    return {
      bankName: typedData.institution_name,
      interestRate: typedData.interest_rate,
      minAmount: typedData.min_loan_amount,
      maxAmount: typedData.max_loan_amount,
      minDuration: typedData.min_term_months,
      maxDuration: typedData.max_term_months,
      fees: {
        establishment: typedData.establishment_fee,
        monthly: typedData.monthly_fee,
        early_repayment: typedData.early_repayment_fee,
      },
      requirements: {
        min_income: typedData.min_income_requirement,
        min_credit_score: typedData.min_credit_score,
        employment_status: typedData.eligible_employment_statuses,
      },
      affiliateLink: typedData.application_url,
    }
  } catch (error) {
    console.error(`Error fetching loan data from API ${apiUrl}:`, error)
    return null
  }
}
