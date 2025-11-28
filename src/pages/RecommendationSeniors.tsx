import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockColleges, branches, mockSeniorStats } from "@/data/colleges";
import { mockLaptops } from "@/data/laptops";
import { LaptopCard } from "@/components/LaptopCard";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

const RecommendationSeniors = () => {
  const { user, isLoggedIn } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState(
    isLoggedIn && user ? user.collegeId : ""
  );
  const [selectedBranch, setSelectedBranch] = useState(
    isLoggedIn && user ? user.branch : ""
  );

  const stats =
    selectedCollege && selectedBranch
      ? mockSeniorStats.find(
          (s) => s.collegeId === selectedCollege && s.branch === selectedBranch
        )
      : null;

  const popularLaptopsData = stats
    ? stats.popularLaptops
        .map((pl) => {
          const laptop = mockLaptops.find((l) => l.id === pl.laptopId);
          return laptop
            ? {
                laptop,
                count: pl.count,
              }
            : null;
        })
        .filter(Boolean)
    : [];

  // Chart data
  const barChartData = popularLaptopsData.map((data) => ({
    name: data!.laptop.name,
    purchases: data!.count,
  }));

  const pieChartData = popularLaptopsData.slice(0, 5).map((data, idx) => ({
    name: data!.laptop.brand,
    value: data!.count,
    fill: COLORS[idx % COLORS.length],
  }));

  const mostPopular = popularLaptopsData[0];
  const topBrand = pieChartData.length > 0 ? pieChartData[0].name : null;
  const avgPriceRange =
    popularLaptopsData.length > 0 ? popularLaptopsData[0]!.laptop.priceRange : null;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">What Your Seniors Buy</h1>
          <p className="text-muted-foreground text-lg">
            Real purchase data from seniors in your college and branch. See what
            worked for them to make an informed decision.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Select Your Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>College</Label>
              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your college" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {mockColleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {stats && popularLaptopsData.length > 0 ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 gradient-card border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Most Popular Laptop
                      </p>
                      <p className="font-bold text-lg">
                        {mostPopular!.laptop.brand} {mostPopular!.laptop.name}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {mostPopular!.count} seniors bought this
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 gradient-card border-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Top Brand
                      </p>
                      <p className="font-bold text-lg">{topBrand}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Most preferred among seniors
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 gradient-card border-accent/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Average Price Range
                      </p>
                      <p className="font-bold text-lg capitalize">
                        {avgPriceRange}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Most common budget tier
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Purchase Statistics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="purchases" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Brand Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Popular Laptops List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Most Popular Laptops in {stats.branch} @ {stats.collegeName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularLaptopsData.map((data, index) => (
                  <motion.div
                    key={data!.laptop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <Badge className="gradient-primary text-white shadow-button">
                            #1 Choice
                          </Badge>
                        </div>
                      )}
                      <LaptopCard laptop={data!.laptop} />
                      <Card className="mt-3 p-3 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                        <p className="text-sm font-semibold text-center">
                          {data!.count} seniors in {stats.branch} bought this
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {!selectedCollege || !selectedBranch
                ? "Please select your college and branch to see senior statistics"
                : "No data available for this combination. Try a different college or branch."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecommendationSeniors;
