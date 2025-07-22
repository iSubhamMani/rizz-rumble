import JoinButton from "@/components/JoinButton";

export default function Home() {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="font-bebas text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight">
          Rizz
          <br />
          Rumble
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 font-medium tracking-wide">
          Out-Rizz Your Rival
        </p>

        <JoinButton />
      </div>
    </div>
  );
}
