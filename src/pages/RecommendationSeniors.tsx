// src/pages/RecommendationSeniors.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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
import { Badge } from "@/components/ui/badge";
import { LaptopCard } from "@/components/LaptopCard";
import axiosInstance from "@/utils/axiosInstance";

import { Trophy, TrendingUp, Award, BarChart3 } from "lucide-react";

// === Fixed college enum list (NO mockColleges) ===
const COLLEGES = ["COEP", "VIT", "PICT", "VIIT", "Cummins", "Bhartiya Vidyapeeth"];

// Colors for charts
const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];

// Laptop type (compatible with LaptopCard expectations)
type Laptop = {
  id: string;
  name: string;
  slug: string;
  ram: number | null;
  internal_storage: number | null;
  price: number;
  currency: string;
  image: string;
  url: string;
};

type StatsResponse = {
  success: boolean;
  college: string;
  total_entries: number;
  top_5_laptops: { laptop: string; count: number }[];
  branch_wise: Record<string, string[]>;
  year_wise: Record<string, string[]>;
};

const slugToName = (slug: string): string => {
  if (!slug) return "Unknown Laptop";
  return slug
    .split("-")
    .map((w) => {
      if (w.length <= 2 && /[a-z]/i.test(w)) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
};

const RecommendationSeniors = () => {
  const [college, setCollege] = useState<string>("");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [allLaptops, setAllLaptops] = useState<Laptop[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingLaptops, setLoadingLaptops] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all laptops once (used to decorate slugs with details)
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoadingLaptops(true);
        const res = await axiosInstance.get("/laptops/get-all-laptops");
        const data = res.data as {
          success: boolean;
          laptops: Array<{
            slug: string;
            ram: number | null;
            internal_storage: number | null;
            price: number;
            currency: string;
            image: string;
            url: string;
          }>;
        };

        if (!data.success || !Array.isArray(data.laptops)) return;

        const mapped: Laptop[] = data.laptops.map((b) => ({
          id: b.slug,
          name: slugToName(b.slug),
          slug: b.slug,
          ram: b.ram ?? null,
          internal_storage: b.internal_storage ?? null,
          price: b.price,
          currency: b.currency || "₹",
          image: b.image,
          url: b.url,
        }));

        setAllLaptops(mapped);
      } catch (err) {
        console.error("Error fetching laptops:", err);
      } finally {
        setLoadingLaptops(false);
      }
    };

    fetchLaptops();
  }, []);

  // Fetch stats when college changes
  const fetchStats = async (selected: string) => {
    if (!selected) return;
    try {
      setLoadingStats(true);
      setError(null);
      setStats(null);

      const res = await axiosInstance.post("/stats/get-college-wise", {
        college: selected,
      });

      if (!res.data?.success) {
        setError(res.data?.message || "Failed to fetch stats");
        return;
      }

      setStats(res.data as StatsResponse);
    } catch (err: any) {
      console.error("Stats API error:", err);
      setError(err?.message || "Something went wrong while fetching stats.");
    } finally {
      setLoadingStats(false);
    }
  };

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    fetchStats(value);
  };

  const findLaptop = (slug: string): Laptop | null => {
    return allLaptops.find((l) => l.slug === slug) || null;
  };

  // Top 5 laptops with attached laptop details
  const topLaptopsDetailed = useMemo(() => {
    if (!stats) return [];
    return stats.top_5_laptops.map((item) => {
      const lap = findLaptop(item.laptop);
      return {
        slug: item.laptop,
        count: item.count,
        laptop: lap,
        displayName: lap?.name || slugToName(item.laptop),
      };
    });
  }, [stats, allLaptops]);

  // Branch-wise chart data
  const branchChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.branch_wise).map(([branch, list]) => ({
      branch,
      count: list.length,
    }));
  }, [stats]);

  // Year-wise chart data
  const yearChartData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.year_wise).map(([year, list]) => ({
      year: `Year ${year}`,
      count: list.length,
    }));
  }, [stats]);

  const mostPopularLaptop = topLaptopsDetailed[0] || null;

  // Most active branch (by count)
  const topBranch = useMemo(() => {
    if (!stats) return null;
    let best: { branch: string; count: number } | null = null;
    for (const [branch, list] of Object.entries(stats.branch_wise)) {
      const c = list.length;
      if (!best || c > best.count) best = { branch, count: c };
    }
    return best;
  }, [stats]);

  const hasData = !!stats && stats.total_entries > 0;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            What Your Seniors Buy (College Wise)
          </h1>
          <p className="text-muted-foreground text-lg">
            See real laptop choices of seniors from your college. Understand
            trends by branch, year, and top models before you decide.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div className="space-y-2">
              <Label className="font-semibold">Select College</Label>
              <Select value={college} onValueChange={handleCollegeChange}>
                <SelectTrigger className="w-72 bg-background">
                  <SelectValue placeholder="Choose your college" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {COLLEGES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground md:text-right">
              Data is based on{" "}
              <span className="font-semibold">actual student entries</span> per
              college.
            </div>
          </div>
        </Card>

        {/* Loading / Error / Empty states */}
        {loadingStats && (
          <Card className="p-10 text-center">
            <p className="font-medium text-lg">Fetching stats for {college}…</p>
            <p className="text-muted-foreground mt-2">
              Analyzing what your seniors are buying.
            </p>
          </Card>
        )}

        {error && !loadingStats && (
          <Card className="p-10 text-center text-red-500 font-semibold">
            {error}
          </Card>
        )}

        {!loadingStats && !stats && !error && (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground text-lg">
              Select a college to see senior purchase statistics.
            </p>
          </Card>
        )}

        {stats && !loadingStats && hasData && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Total Entries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card className="p-6 gradient-card border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Recorded Purchases
                      </p>
                      <p className="font-bold text-2xl">
                        {stats.total_entries}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Across all branches & years in {stats.college}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Most Popular Laptop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 gradient-card border-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-secondary/10">
                      <Trophy className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        #1 Most Popular Laptop
                      </p>
                      <p className="font-bold text-lg">
                        {mostPopularLaptop
                          ? mostPopularLaptop.displayName
                          : "—"}
                      </p>
                      {mostPopularLaptop && (
                        <Badge variant="secondary" className="mt-2">
                          {mostPopularLaptop.count} seniors bought this
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Top Branch */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="p-6 gradient-card border-accent/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Most Active Branch
                      </p>
                      <p className="font-bold text-lg">
                        {topBranch ? topBranch.branch : "—"}
                      </p>
                      {topBranch && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {topBranch.count} purchases recorded
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart: Top 5 laptops */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">
                  Top 5 Laptops in {stats.college}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topLaptopsDetailed.map((x) => ({
                      name: x.displayName,
                      purchases: x.count,
                    }))}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={80}
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

              {/* Pie Chart: Branch distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">
                  Branch-wise Purchase Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={branchChartData}
                      dataKey="count"
                      nameKey="branch"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {branchChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Year-wise bar chart */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">
                Year-wise Purchase Trends
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yearChartData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top 5 laptop cards */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Top Laptops Your Seniors Are Buying
              </h2>
              <p className="text-muted-foreground mb-6">
                Based on purchase counts across all branches and years at{" "}
                <span className="font-semibold">{stats.college}</span>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topLaptopsDetailed.map((entry, index) => (
                  <motion.div
                    key={entry.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div className="relative">
                      {index === 0 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <Badge className="gradient-primary text-white shadow-button">
                            #1 Choice
                          </Badge>
                        </div>
                      )}

                      {entry.laptop ? (
                        <LaptopCard laptop={entry.laptop} />
                      ) : (
                        <Card className="p-4">
                          <p className="font-semibold">
                            {entry.displayName}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Detailed specs not available in local cache, but
                            this is one of the most purchased laptops.
                          </p>
                        </Card>
                      )}

                      <Card className="mt-3 p-3 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                        <p className="text-sm font-semibold text-center">
                          {entry.count} seniors bought this model
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {stats && !loadingStats && !hasData && (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground text-lg">
              No stats available for {stats.college} yet. Try another college.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecommendationSeniors;
