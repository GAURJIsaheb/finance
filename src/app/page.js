"use client";

import Herosection from "@/components/Hero/hero";
import { Button } from "@/components/ui/button";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Herosection />

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,_rgba(59,130,246,0.1)_12%,_transparent_12.5%,_transparent_87%,_rgba(59,130,246,0.1)_87.5%,_rgba(59,130,246,0.1))] opacity-70"></div>
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeIn}
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
                  {item.value}
                </div>
                <div className="text-gray-700 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6"
            variants={fadeIn}
          >
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> manage your finances</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center max-w-2xl mx-auto mb-16"
            variants={fadeIn}
          >
            Powerful tools and insights to help you take control of your financial future
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
              >
                <Card className="p-6 h-full bg-white hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                  <CardContent className="space-y-4 pt-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(59,130,246,0.1)_25%,_transparent_25%,_transparent_50%,_rgba(59,130,246,0.1)_50%,_rgba(59,130,246,0.1)_75%,_transparent_75%,_transparent)] bg-[length:64px_64px] opacity-30"></div>
        <motion.div 
          className="container mx-auto px-4 relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6"
            variants={fadeIn}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center max-w-2xl mx-auto mb-16"
            variants={fadeIn}
          >
            Get started in minutes with our simple three-step process
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center relative"
                variants={fadeIn}
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                {index < howItWorksData.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%_-_2rem)] w-16 border-t-2 border-dashed border-blue-200"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <motion.div 
          className="container mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-6"
            variants={fadeIn}
          >
            What Our Users Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
              >
                <Card className="p-8 h-full bg-white hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                  <CardContent className="pt-4 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{item.name}</div>
                        <div className="text-gray-600">{item.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">"{item.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>












      {/*Last Start Button */}
      <section className="py-24 bg-blue-600">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            variants={fadeIn}
          >
            Ready to Take Control of Your Finances?
          </motion.h2>
          <motion.p 
            className="text-white text-center max-w-2xl mx-auto mb-16"
            variants={fadeIn}
          >
            Join thousands of satisfied customers who trust us with their finances
          </motion.p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-green-400 animate-bounce">Start here!</Button>
          </Link>

        </motion.div>
      </section>
    </div>
  );
}