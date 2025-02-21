import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calculator, MessageSquare, PiggyBank } from "lucide-react"

const features = [
  {
    title: "AI-Powered Loan Advisor",
    description:
      "Get personalized loan recommendations and financial advice from our advanced AI assistant.",
    icon: MessageSquare,
    color: "text-blue-500",
  },
  {
    title: "Loan Comparison",
    description:
      "Compare different loan options side by side to find the best rates and terms for your needs.",
    icon: PiggyBank,
    color: "text-green-500",
  },
  {
    title: "Affordability Calculator",
    description:
      "Calculate your loan affordability based on your income and expenses.",
    icon: Calculator,
    color: "text-purple-500",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Make smarter loan decisions
              <span className="block text-blue-600">with AI guidance</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
              Get personalized loan recommendations, compare options, and make
              informed financial decisions with our AI-powered advisor.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="gap-2">
                  Talk to AI Advisor
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/loans">
                <Button variant="outline" size="lg">
                  Compare Loans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to make the right choice
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our comprehensive tools help you understand and compare loan
              options.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`p-3 rounded-xl bg-gray-50 w-fit ${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to find your perfect loan?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start chatting with our AI advisor and get personalized
            recommendations.
          </p>
          <div className="mt-8">
            <Link href="/chat">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
