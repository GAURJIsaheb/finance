"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isSignedIn } = useAuth();

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "#pricing" },
    { name: "Resources", href: "#resources" },
  ];

  return (
    <header className="fixed w-full bg-gradient-to-r from-blue-700 to-purple-500 backdrop-blur-md z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">FinanceAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            {/* SignedIn / SignedOut Logic */}
            <SignedOut>
            <div className="px-4 py-2">
              <Link href="/sign-in" className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Sign In
              </Link>
            </div>
          </SignedOut>

            <SignedIn>
              <div className="px-4 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <Link
              href="/register"
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-white hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth */}
              <SignedOut>
                <div className="px-3 py-2">
                  <SignInButton mode="modal" />
                </div>
              </SignedOut>
              <SignedIn>
                <div className="px-3 py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <Link
                href="/register"
                className="block px-3 py-2 bg-white text-blue-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
