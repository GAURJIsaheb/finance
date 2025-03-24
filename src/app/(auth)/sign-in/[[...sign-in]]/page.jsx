"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Brain } from "lucide-react";

// Clerk SignUp Component (Fixes SSR issue)
//const SignIn = dynamic(() => import("@clerk/nextjs").then(mod => mod.SignIn), { ssr: false });

// Floating Element Component
const FloatingElement = ({ className }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-multiply filter blur-2xl ${className}`}
    animate={{
      scale: [1, 1.4, 1],
      rotate: [0, 120, 240, 360],
      borderRadius: ["30%", "50%", "30%"],
      opacity: [0.5, 0.8, 0.5],
    }}
    transition={{
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
    }}
  />
);

export default function Page() {
  return (
    <motion.div
      
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#1b0d30] to-[#3dd928]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
      <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center ml-6">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-white" />
              <span className="flex text-xl font-bold text-white">FinanceAI</span>
            </Link>
            <h1 className=" text-4xl ml-[27vw] font-extrabold leading-none tracking-tight text-gray-100 md:text-3xl lg:text-4xl mt-12 dark:text-white">Sign In required !</h1> 
          </div>
          </div>
        <FloatingElement className="w-[400px] h-[400px] left-[-80px] top-[-80px] bg-blue-500/30" />
        <FloatingElement className="w-[500px] h-[500px] right-[-100px] bottom-[-100px] bg-purple-500/30" />
        <FloatingElement className="w-[350px] h-[350px] left-[50%] top-[40%] bg-pink-500/30" />

        {/* Grid Animation */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: "12px 12px",
          }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center bg-pink-300 mt-[20vh] mb-16 rounded-lg backdrop-blur-xl border border-gray-300 shadow-xl w-[250px]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SignIn routing="path" signUpUrl="/sign-up" forceRedirectUrl="/dashboard"/>
      </motion.div>
    </motion.div>
  );
}
