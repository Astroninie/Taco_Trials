import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import confetti from "canvas-confetti";
import { Rocket, Flame, ShieldCheck, Leaf } from "lucide-react";

const PRIME_RANKS = [
  { count: 1, rank: "Unranked" },
  { count: 2, rank: "E" },
  { count: 3, rank: "D" },
  { count: 5, rank: "C" },
  { count: 8, rank: "B" },
  { count: 13, rank: "A" },
  { count: 21, rank: "S" },
  { count: 32, rank: "S+" },
  { count: 53, rank: "Tacocat, God of Tacos" }
];

const getRank = (count) => {
  let current = PRIME_RANKS[0].rank;
  for (const tier of PRIME_RANKS) {
    if (count >= tier.count) current = tier.rank;
    else break;
  }
  return current;
};

// Register service worker
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(registration => console.log("ServiceWorker registered: ", registration))
      .catch(err => console.log("ServiceWorker registration failed: ", err));
  });
}

export default function TacoTrialsApp() {
  const [tacoCount, setTacoCount] = useState(() => {
    const saved = localStorage.getItem("tacoCount");
    return saved ? parseInt(saved) : 0;
  });
  const [rank, setRank] = useState(getRank(tacoCount));
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem("achievements");
    return saved ? JSON.parse(saved) : [];
  });

  const [hardcore, setHardcore] = useState(false);
  const [fireTrial, setFireTrial] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);
  const [veganMode, setVeganMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("tacoCount", tacoCount);
    const newRank = getRank(tacoCount);
    if (newRank !== rank) {
      setRank(newRank);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const newAchievements = [...achievements];
    if (tacoCount >= 21 && !newAchievements.includes("Tacoclysm")) newAchievements.push("Tacoclysm");
    if (tacoCount === 53 && !newAchievements.includes("Tacocat")) newAchievements.push("Tacocat");
    setAchievements(newAchievements);
    localStorage.setItem("achievements", JSON.stringify(newAchievements));
  }, [tacoCount]);

  const incrementTacos = () => setTacoCount((c) => c + 1);
  const resetTacos = () => {
    setTacoCount(0);
    setAchievements([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-50 p-6 max-w-md mx-auto space-y-6 rounded-xl shadow-lg">
      <Card className="border-2 border-yellow-400">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <h1 className="text-4xl font-extrabold text-yellow-700 drop-shadow">Taco Trials 🌮</h1>
          <p className="text-sm text-gray-600">Built with ❤️ by Leif + ChatGPT</p>
          <div className="text-2xl font-mono">Tacos Eaten: {tacoCount}</div>
          <div className="text-lg font-semibold text-orange-700">Rank: {rank}</div>
          {rank === "Tacocat, God of Tacos" && (
            <div className="text-pink-500 text-center font-bold text-lg animate-pulse">✨ You have ascended. All kneel before Tacocat. ✨</div>
          )}
          <div className="flex gap-4 w-full">
            <Button onClick={incrementTacos} className="w-full bg-yellow-500 hover:bg-yellow-600">+1 Taco</Button>
            <Button variant="outline" onClick={resetTacos} className="w-full">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-orange-300">
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-bold text-orange-600">🌶️ Modifiers</h2>
          <label className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <input type="checkbox" checked={hardcore} onChange={() => setHardcore(!hardcore)} />
            Hard Shell (Hardcore Mode)
          </label>
          <label className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600" />
            <input type="checkbox" checked={fireTrial} onChange={() => setFireTrial(!fireTrial)} />
            Diablo Sauce (Fire Trial)
          </label>
          <label className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-purple-500" />
            <input type="checkbox" checked={leftHanded} onChange={() => setLeftHanded(!leftHanded)} />
            Left-Handed Mode
          </label>
          <label className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-500" />
            <input type="checkbox" checked={veganMode} onChange={() => setVeganMode(!veganMode)} />
            Vegan Taco (Ascetic’s Path)
          </label>
        </CardContent>
      </Card>

      <Card className="border border-yellow-300">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">🏆 Achievements</h2>
          {achievements.length === 0 ? (
            <div className="italic text-gray-500">No achievements yet. Keep chomping!</div>
          ) : (
            <ul className="list-disc list-inside text-yellow-900">
              {achievements.includes("Tacoclysm") && <li>🌮 Tacoclysm – Reached S-Rank or higher</li>}
              {achievements.includes("Tacocat") && <li>👑 Tacocat – Consumed 53 tacos in one session</li>}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
