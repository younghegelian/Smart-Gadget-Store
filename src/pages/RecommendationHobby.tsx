import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaptopCard } from "@/components/LaptopCard";
import { mockLaptops } from "@/data/laptops";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const hobbies = [
  { id: "art", label: "Art / Illustration", category: "art" },
  { id: "gaming", label: "Gaming", category: "gaming" },
  { id: "video-editing", label: "Video Editing / Content Creation", category: "video-editing" },
  { id: "programming", label: "Programming / Development", category: "programming" },
  { id: "ml-dl", label: "ML / Data Science", category: "ml-dl" },
  { id: "3d-modeling", label: "3D Modeling / CAD", category: "3d-modeling" },
];

const RecommendationHobby = () => {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const toggleHobby = (hobbyId: string) => {
    if (selectedHobbies.includes(hobbyId)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h !== hobbyId));
    } else {
      setSelectedHobbies([...selectedHobbies, hobbyId]);
    }
  };

  const recommendedLaptops = mockLaptops.filter((laptop) =>
    selectedHobbies.some((hobby) => laptop.suitableFor.includes(hobby))
  );

  const getHobbyBadge = (hobbyId: string) => {
    const hobby = hobbies.find((h) => h.id === hobbyId);
    return hobby?.label || hobbyId;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Recommendations Based on Your Hobby
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your hobbies and interests to find laptops optimized for what
            you love to do.
          </p>
        </div>

        {/* Hobby Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Select Your Hobbies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hobbies.map((hobby) => {
                const isSelected = selectedHobbies.includes(hobby.id);
                return (
                  <Button
                    key={hobby.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`justify-start h-auto py-4 px-4 ${
                      isSelected ? "gradient-primary text-white" : ""
                    }`}
                    onClick={() => toggleHobby(hobby.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? "bg-white border-white"
                            : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary" />}
                      </div>
                      <span className="font-medium">{hobby.label}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        {selectedHobbies.length > 0 ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Perfect Laptops for Your Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedHobbies.map((hobbyId) => (
                  <Badge key={hobbyId} variant="secondary" className="px-3 py-1">
                    Great for {getHobbyBadge(hobbyId)}
                  </Badge>
                ))}
              </div>
            </div>

            {recommendedLaptops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedLaptops.map((laptop, index) => (
                  <motion.div
                    key={laptop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-full">
                      <LaptopCard laptop={laptop} />
                      {/* Why recommended */}
                      <Card className="mt-3 p-3 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                        <p className="text-xs font-medium text-muted-foreground">
                          <strong className="text-foreground">Why this?</strong>{" "}
                          {selectedHobbies.includes("gaming") &&
                          laptop.suitableFor.includes("gaming")
                            ? "High refresh rate display and powerful GPU for smooth gaming. "
                            : ""}
                          {selectedHobbies.includes("video-editing") &&
                          laptop.suitableFor.includes("video-editing")
                            ? "Strong CPU and GPU for fast video rendering. "
                            : ""}
                          {selectedHobbies.includes("ml-dl") &&
                          laptop.suitableFor.includes("ml-dl")
                            ? "Dedicated GPU with good RAM for ML/DL workloads. "
                            : ""}
                          {selectedHobbies.includes("art") &&
                          laptop.suitableFor.includes("art")
                            ? "Color-accurate display perfect for creative work. "
                            : ""}
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No laptops match your selected hobbies. Try selecting different
                  options.
                </p>
              </Card>
            )}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Select at least one hobby to see recommendations
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecommendationHobby;
