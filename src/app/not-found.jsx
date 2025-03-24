"use client";

import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import webs from "../../public/webs.png"

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-red-600 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Spider Web Overlay */}
      <div className="absolute inset-12 bg-[url('/webs.png')] bg-cover bg-center opacity-20 animate-fade-in"></div>
      
      <div className="max-w-md w-full space-y-8 text-center relative z-10 animate-fade-in-slow">
        <div className="space-y-4">
          {/* Cracked and Glitchy 404 Text */}
          <h1 className="text-[10rem] font-extrabold text-red-700 tracking-widest broken-text animate-glitch transition-transform duration-500 hover:scale-110">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight animate-pulse text-red-500 transition-all duration-500 hover:text-red-300 hover:rotate-2">
              Lost in the Web?
            </h2>
            <p className="text-gray-400 text-lg animate-flicker transition-opacity duration-700 hover:opacity-50">
              This page has been devoured by the darkness...
            </p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-auto border-red-600 hover:bg-red-800 hover:text-black transition-all duration-500 transform hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-500 hover:-translate-x-2" />
            Escape Back
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-red-600 hover:bg-red-800 hover:text-black transition-all duration-500 transform hover:scale-105"
          >
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4 transition-transform duration-500 hover:rotate-12" />
              Return to Safety
            </Link>
          </Button>
        </div>

        {/* Creepy Cracks */}
        <div className="pt-8 relative animate-shake">
          <div className="h-1.5 w-full bg-red-900 overflow-hidden rounded-full animate-crack transition-all duration-700 hover:w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
