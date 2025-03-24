"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Brain, LayoutDashboard, PenBox } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";


const Header =() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData,setUserData]=useState(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/checkuser");
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  







  return (
    <header className="fixed w-full bg-gradient-to-r from-blue-700 to-black backdrop-blur-md z-50 border-b border-gray-100">
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
                  <UserButton afterSignOutUrl="/" />
                </Button>
              </Link>




            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </SignedOut>

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
              

              <SignedIn>
              <Link href="/transactions">
                <Button variant="outline" className="flex bg-black items-center hover:bg-green-500 hover:scale-105">
                  <PenBox className="text-white" size={18} />
                  <span className="mr-[4vh] text-white">Transactions</span>

                </Button>
              </Link>



                <Link
                  href="/dashboard"
                  // className=" px-3 py-2 rounded-lg bg-yellow-400 text-white flex items-center space-x-2 hover:scale-105"
                  // onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="flex mt-[2vh] bg-yellow-400 items-center hover:bg-green-500 hover:scale-105">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                  <UserButton afterSignOutUrl="/" />{/*Iski vjh se aa rha hai shyd vo Google Sign ka logo */}
                  </Button>


                </Link>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>

            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
