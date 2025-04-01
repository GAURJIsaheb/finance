"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Brain, LayoutDashboard, PenBox } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { isSignedIn } = useUser(); // Clerk's built-in authentication check

  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/checkuser"); // Your API route
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    if (isSignedIn) {
      fetchUser();
    }
  }, [isSignedIn]); // Re-run when sign-in state changes

  return (
    <header className="fixed w-full left-0 bg-gradient-to-r from-blue-700 to-black backdrop-blur-md z-50 border-b border-gray-100">
  <nav className="w-full px-4 md:px-8"> {/* Full width & controlled padding */}
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
        <SignedIn>
          <Link href="/transactions/createTransaction">
            <Button variant="outline" className="flex bg-black items-center hover:bg-black hover:scale-105">
              <PenBox className="text-white" size={18} />
              <span className="mr-2 text-white">Transactions</span>
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="flex bg-yellow-400 items-center hover:bg-yellow-400 hover:scale-105">
              <LayoutDashboard size={18} />
              <span className="mr-2">Dashboard</span>
            </Button>
          </Link>

          {/* Display fetched user data */}
          {user && (
            <div className="text-white font-medium">
              Welcome, {user.name || "User"}
            </div>
          )}

          {/* User Profile */}
          <UserButton fallbackRedirectUrl="/" />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" />
        </SignedOut>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-gray-300">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden bg-blue-700">
        <div className="px-4 pt-2 pb-4 space-y-2">
          <SignedIn>
            <Link href="/transactions/createTransaction">
              <Button variant="outline" className="flex bg-black items-center hover:bg-green-500 hover:scale-105">
                <PenBox className="text-white" size={18} />
                <span className="mr-[4vh] text-white">Transactions</span>
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" className="flex mt-[2vh] bg-yellow-400 items-center hover:bg-green-500 hover:scale-105">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Button>
            </Link>

            {/* Display fetched user data */}
            {user && (
              <div className="text-white font-medium mt-2">
                Welcome, {user.name || "User"}
              </div>
            )}

            {/* User Profile */}
            <div className="mt-2">
              <UserButton fallbackRedirectUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" />
          </SignedOut>
        </div>
      </div>
    )}
  </nav>
</header>

  );
};

export default Header;