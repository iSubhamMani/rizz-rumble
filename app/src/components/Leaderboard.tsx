import { Trophy } from "lucide-react";

const Leaderboard = () => {
  return (
    <div className="flex-1 my-auto h-[90%] sm:h-[80%]">
      <div
        className={`
                 h-full
           group relative px-6 py-4 
           bg-transparent/40
           border-4 border-amber-900 
           rounded-none
           font-secondary text-sm sm:text-lg md:text-xl text-amber-100
           shadow-lg
         `}
      >
        {/* Wood grain overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-800/20 to-amber-900/40 rounded-none" />
        {/* Metal corner brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-yellow-600" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-yellow-600" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-yellow-600" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-yellow-600" />
        Leaderboard <Trophy className="inline -mt-1 mx-2 size-5" />
      </div>
    </div>
  );
};

export default Leaderboard;
