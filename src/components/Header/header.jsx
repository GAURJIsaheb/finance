"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Brain, LayoutDashboard } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline" className="flex bg-yellow-400 items-center hover:bg-green-400">
                  <LayoutDashboard size={18} />
                  <span className="mr-2">Dashboard</span>
                  <UserButton afterSignOutUrl="/" />
                </Button>
              </Link>

            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </SignedOut>

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
            <div className="px-4 pt-2 pb-4 space-y-2">
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

              <SignedIn>
                <Link
                  href="/dashboard"
                  className=" px-3 py-2 rounded-lg bg-yellow-400 text-white flex items-center space-x-2 hover:text-green-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <UserButton afterSignOutUrl="/" />{/*Iski vjh se aa rha hai shyd vo Google Sign ka logo */}
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>

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
