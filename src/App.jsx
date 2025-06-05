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

const TACO_FACTS = [
  "Tacos were first mentioned in the U.S. in 1905.",
  "The word 'taco' means 'plug' or 'wad' in Spanish.",
  "October 4th is National Taco Day!",
  "The largest taco ever made weighed over 1,600 lbs.",
  "Taco Bell was founded in 1962 in California.",
  "In Mexico, tacos are traditionally served without cheese.",
  "The taco predates the arrival of Europeans in Mexico."
];

const getRank = (count) => {
  let current = PRIME_RANKS[0].rank;
  for (const tier of PRIME_RANKS) {
    if (count >= tier.count) current = tier.rank;
    else break;
  }
  return current;
};

const getRandomTacoFact = () => {
  const index = Math.floor(Math.random() * TACO_FACTS.length);
  return TACO_FACTS[index];
};

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
  const [dailyDate, setDailyDate] = useState(() => {
    const saved = localStorage.getItem("tacoDate");
    return saved ? saved : new Date().toDateString();
  });
  const [fact, setFact] = useState("");

  const [hardcore, setHardcore] = useState(false);
  const [fireTrial, setFireTrial] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);
  const [veganMode, setVeganMode] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyDate !== today) {
      setTacoCount(0);
      setAchievements([]);
      setDailyDate(today);
      localStorage.setItem("tacoDate", today);
    }
  }, [dailyDate]);

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
    if (tacoCount === 53 && !newAchievements.includes("Tacocat")) {
      newAchievements.push("Tacocat");

      setTimeout(() => {
        const audio = new Audio("/sounds/sizzle.mp3");
        audio.volume = 0.8;
        audio.play();

        const variations = [
          "TAAACO!!!", "TAaaAAcoooOOO!!!", "🌮🌮🌮 TAAAAACOOOO!!! 🌮🌮🌮",
          "TACO-RRRRUMBLE!!!", "THE TACO HAS SPOKEN!!!"
        ];
        const shout = new SpeechSynthesisUtterance(
          variations[Math.floor(Math.random() * variations.length)]
        );
        shout.pitch = 1.6;
        shout.rate = 0.75;
        shout.volume = 1;
        speechSynthesis.speak(shout);

        confetti({
          particleCount: 300,
          spread: 120,
          origin: { y: 0.4 },
          colors: ["#FFD700", "#FFA500", "#FF4500", "#FFFFFF"]
        });

        for (let i = 0; i < 20; i++) {
          const taco = document.createElement("div");
          taco.textContent = "🌮";
          taco.style.position = "fixed";
          taco.style.left = Math.random() * 100 + "%";
          taco.style.top = "-2em";
          taco.style.fontSize = "2rem";
          taco.style.transition = "top 2s ease-in";
          document.body.appendChild(taco);
          setTimeout(() => {
            taco.style.top = "100%";
            setTimeout(() => taco.remove(), 2000);
          }, 100);
        }
      }, 400);
    }
    if (hardcore && tacoCount >= 8 && !newAchievements.includes("Iron Shell")) newAchievements.push("Iron Shell");
    if (fireTrial && tacoCount >= 8 && !newAchievements.includes("Firestarter")) newAchievements.push("Firestarter");
    if (leftHanded && tacoCount >= 21 && !newAchievements.includes("Inverted Legend")) newAchievements.push("Inverted Legend");
    if (veganMode && tacoCount >= 13 && !newAchievements.includes("Pure Bean")) newAchievements.push("Pure Bean");

    setAchievements(newAchievements);
    localStorage.setItem("achievements", JSON.stringify(newAchievements));

    setFact(getRandomTacoFact());
  }, [tacoCount, hardcore, fireTrial, leftHanded, veganMode]);

  const incrementTacos = () => setTacoCount((c) => c + 1);
  const resetTacos = () => {
    setTacoCount(0);
    setAchievements([]);
    localStorage.removeItem("tacoDate");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-50 p-6 max-w-md mx-auto space-y-6 rounded-xl shadow-lg ${leftHanded ? 'text-right' : ''}`}>
      <Card className="border-2 border-yellow-400">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <h1 className="text-4xl font-extrabold text-yellow-700 drop-shadow">Taco Trials 🌮</h1>
          <p className="text-sm text-gray-600">Built with ❤️ by Leif + ChatGPT</p>
          <div className="text-2xl font-mono">Tacos Eaten: {tacoCount}</div>
          <div className="text-lg font-semibold text-orange-700">Rank: {rank}</div>
          {fact && <div className="text-sm italic text-gray-500">🌮 {fact}</div>}
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
              {achievements.includes("Iron Shell") && <li>🛡 Iron Shell – 8 tacos with Hardcore Mode</li>}
              {achievements.includes("Firestarter") && <li>🔥 Firestarter – Rank B+ with Fire Trial</li>}
              {achievements.includes("Inverted Legend") && <li>🌀 Inverted Legend – Reach S-Rank Left-Handed</li>}
              {achievements.includes("Pure Bean") && <li>🌿 Pure Bean – 13 tacos as a Vegan</li>}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

