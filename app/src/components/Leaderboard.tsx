import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Leaderboard = () => {
  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="pb-4 text-sm sm:text-base">
          <CardTitle className="flex items-center gap-2 border-b border-white/20 pb-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { rank: 1, name: "BattleMaster", score: "2,847", badge: "🥇" },
            { rank: 2, name: "QuickDraw", score: "2,691", badge: "🥈" },
            { rank: 3, name: "ShotCaller", score: "2,534", badge: "🥉" },
            { rank: 4, name: "FastBreak", score: "2,401", badge: "" },
            { rank: 5, name: "CourtKing", score: "2,298", badge: "" },
          ].map((player) => (
            <div
              key={player.rank}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs sm:text-sm md:text-base">
                  {player.badge || `#${player.rank}`}
                </span>
                <span className="font-medium text-xs sm:text-sm md:text-base">
                  {player.name}
                </span>
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm md:text-base">
                {player.score}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
