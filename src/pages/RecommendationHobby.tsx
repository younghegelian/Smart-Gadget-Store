import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaptopCard } from "@/components/LaptopCard";
import axiosInstance from "@/utils/axiosInstance";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Sparkles } from "lucide-react";

// 💛 Backend Provided Hobby Mapping (Grouped UI)
const HOBBY_CATEGORY = {
  coding: ["web development","app development","competitive programming","python automation"],
  data: ["machine learning","deep learning","ai research","data science","data analysis","big data processing"],
  creative: ["graphic designing","ui/ux","digital illustration","3d modelling","animation","video editing"],
  infra: ["cybersecurity","ethical hacking","networking","cloud computing","devops","devops automation"],
  gaming: ["gaming","game development","streaming"]
};

// 🎨 UI Labels
const CATEGORY_LABEL: Record<string, string> = {
  coding: "💻 Coding & Development",
  data: "📊 Data / AI / ML",
  creative: "🎨 Creative & Design",
  infra: "🛠 DevOps / Cybersecurity / Cloud",
  gaming: "🎮 Gaming / Streaming"
};

// Helper to make title from slug / name_url
const toTitle = (s?: string) =>
  (s || "")
    .split("-")
    .map(w => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

export default function RecommendationHobby() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [result, setResult] = useState<any>(null);

  const toggleSelect = (hobby: string) => {
    setSelected(prev =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  };

  // 🚀 SEND TO BACKEND
  const generateRecommendations = async () => {
    if (selected.length === 0) return alert("Select at least 1 hobby");

    setLoading(true);
    setFailed(false);

    // TIMEOUT FAIL
    const timeout = setTimeout(() => {
      setLoading(false);
      setFailed(true);
    }, 20000);

    try {
      const res = await axiosInstance.post("/hobby/get-laptops-by-hobby", selected);
      console.log("🤖 Hobby Recommendation Result:", res.data);
      clearTimeout(timeout);

      setResult(res.data);
      setLoading(false);
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      setFailed(true);
      console.log("❌ Backend Failed:", err);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* HEADER */}
        <motion.h1
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          AI-Based Hobby Recommendations
        </motion.h1>

        <p className="text-muted-foreground mb-10 text-lg">
          Select your interests — AI will calculate hardware requirements & pick best laptops for you.
        </p>

        {/* ---------------- HOBBY SELECT GRID ---------------- */}
        <Card className="p-7 mb-8">
          <h2 className="text-xl font-bold mb-5">Select Your Hobbies</h2>

          <div className="space-y-6">
            {Object.keys(HOBBY_CATEGORY).map((catKey) => (
              <div key={catKey}>
                <h3 className="font-semibold text-lg mb-3">
                  {CATEGORY_LABEL[catKey] ?? catKey}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {HOBBY_CATEGORY[catKey].map((hobby) => {
                    const active = selected.includes(hobby);
                    return (
                      <Button
                        key={hobby}
                        variant={active ? "default" : "outline"}
                        className={`rounded-full px-4 ${
                          active ? "bg-primary text-white shadow" : ""
                        }`}
                        onClick={() => toggleSelect(hobby)}
                      >
                        {active && <CheckCircle size={14} className="mr-1" />}
                        {hobby}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              disabled={loading}
              className="gradient-primary text-white"
              onClick={generateRecommendations}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "⚡"}
              Generate Recommendations
            </Button>
          </div>
        </Card>

        {/* ---------------- LOADING UI ---------------- */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center pt-10"
          >
            <Loader2 className="animate-spin mx-auto mb-3" size={45} />
            <p className="text-lg font-medium">
              Analyzing your hobbies... Fetching best laptops 🔍
            </p>
            <p className="text-muted-foreground">
              This may take up to <b>20 seconds</b>.
            </p>
          </motion.div>
        )}

        {/* ---------------- TIMEOUT FAIL ---------------- */}
        {failed && !loading && (
          <Card className="p-10 text-center text-red-500 text-lg font-semibold">
            ❌ Failed to fetch response. Try again!
          </Card>
        )}

        {/* ---------------- FINAL RESULT ---------------- */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">

            {/* 🔥 Recommended Specs */}
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
                <Sparkles className="text-yellow-500" /> Recommended Specs For You
              </h2>

              <Card className="p-6 text-base bg-gradient-to-r from-primary/5 to-secondary/10 border-primary/20 space-y-1">
                {Object.entries(result.recommendations).map(([k, v]) => (
                  <p key={k}>
                    <b>{k}:</b> {String(v)}
                  </p>
                ))}
              </Card>
            </div>

            {/* 💻 Best Matched Laptops */}
            <div>
              <h2 className="text-2xl font-bold mb-5">Best Matching Laptops</h2>

              {result.matching_laptops?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {result.matching_laptops.map((lap: any, i: number) => (
                    <motion.div
                      key={lap.slug || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <LaptopCard
                        laptop={{
                          id: lap.slug,                                      // for compare context
                          slug: lap.slug,                                   // for /laptop/:slug route
                          name: toTitle(lap.name_url || lap.slug),         // human readable
                          image: lap.image,
                          ram: lap.ram,
                          internal_storage: lap.internal_storage,
                          currency: lap.currency || "₹",
                          price: lap.price,
                          url: lap.amazon_link,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-10 text-center">
                  No matching laptops found.
                </Card>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
