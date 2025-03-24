"use client";

import Herosection from "@/components/Hero/hero";
import { Button } from "@/components/ui/button";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const wildFade = {
  initial: { opacity: 0, scale: 0.8, rotate: 5 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  transition: { duration: 0.8, ease: "backOut" }
};
// Staggered entrance for that irresistible allure
const velvetContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};


// Seductive animation variants
const sultryFade = {
  initial: { opacity: 0, y: 20, rotateX: -10 },
  animate: { opacity: 1, y: 0, rotateX: 0 },
  transition: { duration: 0.9, ease: [0.6, -0.05, 0.01, 0.99] }
};


const cardColors = [
  "bg-gradient-to-br from-rose-600 to-rose-800 border-rose-900 shadow-rose-600/40",
  "bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-900 shadow-indigo-600/40",
  "bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-900 shadow-emerald-600/40",
  "bg-gradient-to-br from-amber-600 to-amber-800 border-amber-900 shadow-amber-600/40",
  "bg-gradient-to-br from-violet-600 to-violet-800 border-violet-900 shadow-violet-600/40",
  "bg-gradient-to-br from-fuchsia-600 to-fuchsia-800 border-fuchsia-900 shadow-fuchsia-600/40",
];


const chaosContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-200 to-yellow-400 overflow-hidden">
      <Herosection />

      {/* Stats Section: Neon Explosion */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/3px-tile.png')] opacity-20 animate-pulse"></div>
        <motion.div
          className="container mx-auto px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={chaosContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsData.map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-gray-500 rounded-3xl shadow-[0_0_15px_neon] border-2 border-electric-pink transform skew-y-2 hover:skew-y-0 transition-all duration-300"
                variants={wildFade}
                whileHover={{ scale: 1.1, rotate: -2 }}
              >
                <div className="lg:text-5xl md:text-2xl font-extrabold text-white mb-3 animate-bounce">
                  {item.value}
                </div>
                <div className="text-yellow-300 font-mono uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section: Cyberpunk Madness */}
      <section className="py-24 bg-[radial-gradient(circle_at_top,#ff00cc,#333399)] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        <motion.div
          className="container mx-auto px-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={chaosContainer}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold text-center mb-8 text-neon-yellow drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]"
            variants={wildFade}
          >
            FINANCE ON
            <span className="block text-8xl text-electric-pink animate-pulse">STERIODS</span>
          </motion.h2>
          <motion.p
            className="text-white text-center max-w-3xl mx-auto mb-16 text-xl font-mono"
            variants={wildFade}
          >
            JACK INTO THE MONEY MATRIX
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuresData.map((item, index) => (
              <motion.div
                key={index}
                variants={wildFade}
                whileHover={{ y: -20, rotate: 5 }}
              >
                <Card className={`p-6 ${cardColors[index % cardColors.length]} border-4 rounded-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300`}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="w-16 h-16 bg-electric-pink rounded-full flex items-center justify-center text-3xl text-black animate-spin-slow">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-neon-yellow">{item.title}</h3>
                    <p className="text-white font-mono leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works: Glitchcore */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] opacity-40 animate-glitch"></div>
        <motion.div
          className="container mx-auto px-8 relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={chaosContainer}
        >
          <motion.h2
            className="text-6xl font-extrabold text-center mb-8 text-gray-700 border-black glitch-text"
            variants={wildFade}
            data-text="HOW IT BLASTS"
          >
            HOW IT BLASTS
          </motion.h2>
          <motion.p
            className="text-neon-green text-center max-w-2xl mx-auto mb-16 text-lg font-mono"
            variants={wildFade}
          >
            PLUG IN & BLOW UP
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((item, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                variants={wildFade}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 bg-neon-yellow rounded-[20%] shadow-[0_0_15px_rgba(255,255,0,0.7)] flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold transform rotate-12">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-widest">{item.title}</h3>
                <p className="text-neon-green font-mono leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials: Acid Trip */}
{/* Testimonials: Sultry Spotlight */}
<section className="py-32 bg-gradient-to-tr from-teal-800 to-rose-900">
        <motion.div
          className="container mx-auto px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={velvetContainer}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-extrabold text-center mb-12 text-gray-100 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            variants={sultryFade}
          >
            VOICES OF VICTORY
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonialsData.map((item, index) => (
              <motion.div
                key={index}
                variants={sultryFade}
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                <Card className="p-8 bg-gray-900/90 border-2 border-teal-500 rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.3)]">
                  <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="rounded-full object-cover border-2 border-rose-500"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-xl text-gray-100">{item.name}</div>
                        <div className="text-gray-400 font-mono">{item.role}</div>
                      </div>
                    </div>
                    <p className="text-teal-400 font-mono leading-relaxed italic">“{item.quote}”</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA: Nuclear Launch */}
      <section className="py-32 bg-[conic-gradient(at_center,#ff00cc,#333399,#00ffcc,#ff00cc)] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/metal.png')] opacity-25"></div>
        <motion.div
          className="container mx-auto px-8 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={chaosContainer}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 animate-bounce tracking-wider"
            variants={wildFade}
          >
            LAUNCH YOUR
            <span className="block text-neon-yellow text-8xl">MONEY ROCKET</span>
          </motion.h2>
          <motion.p
            className="text-white text-2xl max-w-3xl mx-auto mb-12 font-mono"
            variants={wildFade}
          >
            BLAST OFF TO WEALTH CITY
          </motion.p>
          <motion.div variants={wildFade}>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-neon-green text-black text-2xl font-bold px-12 py-8 rounded-full border-4 border-black shadow-[0_0_20px_rgba(0,255,0,0.8)] hover:bg-electric-pink hover:text-white transition-all duration-300 animate-pulse"
              >
                IGNITE NOW
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}