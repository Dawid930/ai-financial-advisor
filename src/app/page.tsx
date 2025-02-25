import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Calculator,
  MessageSquare,
  PiggyBank,
  Shield,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    title: "AI-Powered Loan Advisor",
    description:
      "Get personalized loan recommendations and financial advice from our advanced AI assistant.",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Loan Comparison",
    description:
      "Compare different loan options side by side to find the best rates and terms for your needs.",
    icon: PiggyBank,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Affordability Calculator",
    description:
      "Calculate your loan affordability based on your income and expenses.",
    icon: Calculator,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Financial Security",
    description:
      "Make confident decisions with secure, data-driven insights and recommendations.",
    icon: Shield,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Investment Planning",
    description:
      "Plan your investments alongside your loans to maximize your financial growth.",
    icon: TrendingUp,
    color: "bg-rose-100 text-rose-600",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-0" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm bg-white/80 backdrop-blur-sm border-blue-200"
              >
                <span className="text-blue-600 font-medium">
                  AI-Powered Financial Advice
                </span>
              </Badge>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                Make smarter{" "}
                <span className="text-blue-600">loan decisions</span> with AI
                guidance
              </h1>

              <p className="text-xl text-gray-600">
                Get personalized loan recommendations, compare options, and make
                informed financial decisions with our AI-powered advisor.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="gap-2 rounded-full shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 transition-all"
                  >
                    Talk to AI Advisor
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/loans">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-gray-300 hover:bg-gray-50"
                  >
                    Compare Loans
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-green-500" />
                <span>
                  Your data is secure and never shared with third parties
                </span>
              </div>
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        AI Financial Advisor
                      </h3>
                      <p className="text-xs text-blue-100">Online now</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-lg p-3 text-sm text-white">
                      How can I help with your loan decisions today?
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-white/80">
                      I'm looking for the best mortgage rates for a $350,000
                      home.
                    </div>
                    <div className="bg-white/20 rounded-lg p-3 text-sm text-white">
                      I can help you find the best mortgage rates. Let's start
                      by understanding your financial situation...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-sm border-blue-200"
            >
              <span className="text-blue-600 font-medium">Features</span>
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything you need to make the right choice
            </h2>
            <p className="text-xl text-gray-600">
              Our comprehensive tools help you understand and compare loan
              options with confidence and clarity.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:translate-y-[-5px] group"
              >
                <div
                  className={`p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge
              variant="outline"
              className="mb-4 px-3 py-1 text-sm border-blue-200"
            >
              <span className="text-blue-600 font-medium">Testimonials</span>
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What our users say
            </h2>
            <p className="text-xl text-gray-600">
              Thousands of people have made better financial decisions with our
              AI advisor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The AI advisor helped me find a mortgage with much better terms than I could find on my own. Saved me thousands!",
                author: "Sarah J.",
                role: "First-time homebuyer",
              },
              {
                quote:
                  "I was overwhelmed by loan options until I used this tool. The personalized advice made all the difference.",
                author: "Michael T.",
                role: "Small business owner",
              },
              {
                quote:
                  "The loan comparison feature is incredible. I could clearly see which option was best for my situation.",
                author: "Elena R.",
                role: "Refinancing homeowner",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to find your perfect loan?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Start chatting with our AI advisor and get personalized
            recommendations tailored to your financial situation.
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 shadow-lg"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
