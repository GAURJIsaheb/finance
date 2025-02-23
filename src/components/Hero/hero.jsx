"use client"
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button';
import Image from 'next/image';
import image1 from '../../../public/ai.jpeg'

function Herosection() {

  //image ka Til vaala Transition aa rha hai is se scroll hote hue
  const imageRef=useRef();
  useEffect(()=>{
    const imageElement=imageRef.current//Reference of the image element

    const handlescroll=()=>{
      const scrollPosition=window.scrollY;
      const scrollThreshold=100;
      
      if(scrollPosition>scrollThreshold){
        imageElement.classList.add("scrolled");//Tilt back krega ye
      }
      else {imageElement.classList.remove("scrolled")}

    };

    window.addEventListener("scroll",handlescroll);
    return ()=>window.removeEventListener("scroll",handlescroll)
  },[])

  return (
    <div className="pt-[15vh] pb-[10vh]">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:[105px] pb-6 text-transparent bg-gradient-to-r from-green-700 via-blue-500 to-black bg-clip-text">
          Manage Your Finances <br/>with Intelligence
        </h1>
        <p className="text-2xl mx-auto">
          An Ai-powered financial management platform that helps you to track,analyse,and optimize your spendings with real-time insights.
        </p>
        <div>
          <Link href="/dashboard">
            <Button size="lg" className="px-8 mt-[2vh]">Get Started</Button>
          </Link>
        </div>
        <div className="hero-image-wrapper">
          <div ref={imageRef} className="hero-image">
          <Image src={image1} width alt="Dashboard image " priority className="rounded-lg shadow-2xl mt-[4vh] border mx-auto w-full sm:w-3/4 md:w-1/2 lg:w-[70vw]
              sm:h-64 md:h-80 lg:h-[70vh] object-cover"/>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Herosection;