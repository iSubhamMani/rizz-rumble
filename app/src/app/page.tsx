import HeroTextAnimation from "@/components/hero-text-anim";
import JoinButton from "@/components/JoinButton";
import { RetroGrid } from "@/components/magicui/retro-grid";

export default function Home() {
  return (
    <main className="min-h-screen text-white relative bg-black">
      {/*<GridBackground />*/}
      <RetroGrid />

      <div className="flex items-center justify-center px-6 pt-4 sm:pt-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-anton tracking-wider">
          Prompt Brawl
        </h1>
      </div>

      {/* Example content to show the grid background in action */}
      <div className="container mx-auto px-6 py-20 text-center">
        <HeroTextAnimation />

        <div className="max-w-2xl mx-auto">
          <div className="relative w-full max-w-xl mx-auto text-center text-white p-4">
            {/* Top Left Corner */}
            <div className="absolute top-0 left-0 size-2 sm:size-3 border-t border-l border-gray-400"></div>
            {/* Top Right Corner */}
            <div className="absolute top-0 right-0 size-2 sm:size-3 border-t border-r border-gray-400"></div>
            {/* Bottom Left Corner */}
            <div className="absolute bottom-0 left-0 size-2 sm:size-3 border-b border-l border-gray-400"></div>
            {/* Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 size-2 sm:size-3 border-b border-r border-gray-400"></div>

            {/* Text Content */}
            <p className="fade-pullup sm:text-base text-sm tracking-wide uppercase">
              Face off in intense 1v1 real-time duels where quick wit, fast
              fingers, and clever comebacks lead to victory. Battle against
              other players or AI.
            </p>
          </div>
          <JoinButton />
        </div>
      </div>
    </main>
  );
}
