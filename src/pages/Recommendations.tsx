import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Gamepad2,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const recommendationModes = [
  {
    id: "academics",
    title: "Based on Your Academics",
    description:
      "Upload your curriculum and get recommendations that match your coursework and software needs",
    icon: BookOpen,
    path: "/recommendations/academics",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "hobby",
    title: "Based on Your Hobby",
    description:
      "Whether you game, edit videos, or create art - find laptops perfect for your passion",
    icon: Gamepad2,
    path: "/recommendations/hobby",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "grades",
    title: "Based on Grades & Future Scope",
    description:
      "Upload your grades to predict advanced subjects you'll take and get future-ready laptops",
    icon: TrendingUp,
    path: "/recommendations/grades",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "seniors",
    title: "What Your Seniors Buy",
    description:
      "See real purchase data from seniors in your college and branch to make informed decisions",
    icon: Users,
    path: "/recommendations/seniors",
    gradient: "from-orange-500 to-red-500",
  },
];

const Recommendations = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Find Your Perfect Laptop
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a recommendation mode that best fits your needs. Each approach
            analyzes different aspects to help you make the right decision.
          </p>
        </motion.div>

        {/* Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {recommendationModes.map((mode, index) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-card-hover transition-all group cursor-pointer border-2 hover:border-primary/20">
                  <Link to={mode.path}>
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${mode.gradient} mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {mode.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="group-hover:text-primary group-hover:translate-x-1 transition-all p-0"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
