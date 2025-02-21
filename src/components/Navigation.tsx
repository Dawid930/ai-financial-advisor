import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Home, Calculator } from "lucide-react";

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              AI Financial Advisor
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </Link>
            <Link href="/loans">
              <Button variant="ghost" size="sm" className="gap-2">
                <Calculator className="h-4 w-4" />
                Loans
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
} 