import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LaptopCard } from "@/components/LaptopCard";
import { mockLaptops } from "@/data/laptops";
import { Search, ArrowRight, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const trendingLaptops = mockLaptops.filter((l) => l.trending);

  const filteredLaptops = mockLaptops.filter((laptop) => {
    const matchesSearch =
      laptop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      laptop.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceFilter === "all" || laptop.priceRange === priceFilter;
    const matchesCategory =
      categoryFilter === "all" || laptop.suitableFor.includes(categoryFilter);
    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Trusted by 50,000+ students
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Find the perfect laptop for your college journey
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Compare specs, analyze trends, and discover what your seniors are buying.
              Make an informed decision that lasts all 4 years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="gradient-primary text-white shadow-button text-lg px-8"
              >
                <Link to="/recommendations">
                  <Target className="mr-2 h-5 w-5" />
                  Get Recommendations
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <a href="#browse">
                  Browse Laptops
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">
                Most popular laptops among students this month
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingLaptops.map((laptop) => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section id="browse" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse All Laptops</h2>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid">Mid Range</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Best For" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academics">Academics</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="video-editing">Video Editing</SelectItem>
                  <SelectItem value="art">Art & Design</SelectItem>
                  <SelectItem value="ml-dl">ML/DL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {filteredLaptops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLaptops.map((laptop) => (
                <LaptopCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No laptops match your filters. Try adjusting your preferences.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
