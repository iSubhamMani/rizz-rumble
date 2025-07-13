import React from "react";
import JoinButton from "@/components/JoinButton";
import { Particles } from "@/components/magicui/particles";
import { Swords } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Particles
        className="absolute inset-0 z-0"
        quantity={80}
        ease={80}
        color={"#f59e0b"}
        refresh
      />

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        {/* Game title */}
        <div className="mb-8">
          <h2 className="font-tertiary uppercase text-amber-400 text-2xl md:text-3xl mb-4 tracking-widest opacity-90">
            PROMPT
            <span>
              <Swords className="inline -mt-1 mx-2" />
            </span>
            BRAWL
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
        </div>

        {/* Main headline */}
        <h1 className="font-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="block text-amber-100 mb-2">ENTER THE</span>
          <span className="block text-amber-200 mb-2">ULTIMATE</span>
          <span className="block text-amber-300 western-glow">
            PROMPT BATTLE
          </span>
          <span className="block text-amber-400">EXPERIENCE</span>
        </h1>

        {/* Decorative separator */}
        <div className="flex items-center justify-center my-6 max-w-md mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600" />
          <div className="px-4">
            <div className="w-3 h-3 bg-amber-500 transform rotate-45 border border-amber-400" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600" />
        </div>

        {/* Call to action */}
        <div className="flex flex-col items-center gap-6">
          <JoinButton />
          {/* Additional flavor text */}
          <p className="font-tertiary text-amber-400/80 text-base tracking-wider">
            * Draw your swords, soldier *
          </p>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-12">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <div
              className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div
              className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </div>
      </div>

      {/* Side decorative elements */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-30">
        <div className="w-1 h-32 bg-gradient-to-b from-transparent via-amber-600 to-transparent" />
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-30">
        <div className="w-1 h-32 bg-gradient-to-b from-transparent via-amber-600 to-transparent" />
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2" // Center the sphere horizontally
        style={{
          width: "min(100vw, 800px)", // Max width to ensure it doesn't get too big on ultra-wide screens
          height: "min(100vw, 800px)", // Make height equal to width for a perfect circle
          bottom: "-min(100vw, 800px) / 2", // Adjust this to control how much of the sphere is visible (e.g., half its height)
          // You might need to fine-tune the bottom value based on how much of the glow you want showing.
          // For example, if you want only the top 20% of the sphere visible, bottom: '-80%'
        }}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-70"
            style={{ backgroundColor: "#34495e", filter: "blur(400px)" }} // Increased blur for a stronger glow
          ></div>
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-60"
            style={{ backgroundColor: "#2c3e50", filter: "blur(150px)" }} // Even more blur for depth
          ></div>
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-70"
            style={{ backgroundColor: "#4a6d7c", filter: "blur(400px)" }} // Widest blur for the outer glow
          ></div>
          {/* Inner, brighter glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-60"
            style={{ backgroundColor: "#2d403c", filter: "blur(100px)" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
