import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, TrendingUp } from "lucide-react";
import { LaptopCard } from "@/components/LaptopCard";
import { mockLaptops } from "@/data/laptops";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const RecommendationGrades = () => {
  const [uploaded, setUploaded] = useState(false);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [futureSubjects, setFutureSubjects] = useState<string[]>([]);

  const handleUpload = () => {
    // Simulate upload and analysis
    setUploaded(true);
    setStrengths([
      "Machine Learning (A+)",
      "Data Structures (A)",
      "Algorithms (A)",
    ]);
    setFutureSubjects([
      "Deep Learning",
      "Neural Networks",
      "Big Data Analytics",
      "AI Systems",
      "Computer Vision",
    ]);
  };

  // Recommend high-spec laptops for ML/DL based on predicted subjects
  const recommendedLaptops = uploaded
    ? mockLaptops.filter(
        (l) =>
          l.suitableFor.includes("ml-dl") ||
          (l.suitableFor.includes("programming") && l.priceRange !== "budget")
      )
    : [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Recommendations Based on Grades & Future Scope
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your grade sheet and we'll predict advanced subjects you might
            take, recommending laptops that can handle them.
          </p>
        </div>

        {!uploaded ? (
          /* Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 text-center border-dashed border-2 hover:border-primary/50 transition-colors">
              <div className="max-w-md mx-auto">
                <div className="inline-flex p-6 rounded-2xl gradient-card mb-6">
                  <Upload className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Upload Your Grade Sheet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload your last semester grade sheet. We'll analyze your
                  strengths and predict what advanced courses you're likely to
                  pursue.
                </p>
                <Button
                  onClick={handleUpload}
                  className="gradient-primary text-white shadow-button"
                  size="lg"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Upload Grade Sheet
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supports PDF, JPG, PNG (Max 5MB)
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            {/* Analysis Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Detected Strengths */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6 h-full gradient-card border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-3">
                        Detected Strengths
                      </h3>
                      <div className="space-y-2">
                        {strengths.map((strength) => (
                          <div
                            key={strength}
                            className="bg-background/50 rounded-lg px-3 py-2 text-sm font-medium"
                          >
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Future Predictions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6 h-full gradient-card border-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-3">
                        Likely Future Subjects
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {futureSubjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
              <p className="text-sm">
                <strong className="font-semibold">Based on your analysis:</strong>{" "}
                We recommend laptops with dedicated GPUs, 16GB+ RAM, and powerful
                processors to handle ML/DL frameworks, data processing, and AI
                development tools.
              </p>
            </Card>

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Future-Ready Laptop Recommendations
                  </h2>
                  <p className="text-muted-foreground">
                    Laptops that can handle your predicted advanced coursework
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setUploaded(false)}
                  size="sm"
                >
                  Upload Different File
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedLaptops.slice(0, 9).map((laptop, index) => (
                  <motion.div
                    key={laptop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="h-full flex flex-col">
                      <LaptopCard laptop={laptop} />
                      {/* Why recommended */}
                      <Card className="mt-3 p-3 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/10">
                        <p className="text-xs font-medium">
                          <strong className="text-foreground">Why this?</strong>{" "}
                          {laptop.gpu.includes("RTX") || laptop.gpu.includes("Radeon")
                            ? "Dedicated GPU with CUDA support for ML/DL. "
                            : ""}
                          {laptop.ram.includes("32GB") || laptop.ram.includes("16GB")
                            ? "Sufficient RAM for running multiple models and IDEs. "
                            : ""}
                          Perfect for Deep Learning and AI development.
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationGrades;
