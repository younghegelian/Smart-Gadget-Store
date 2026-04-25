// src/pages/Index.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LaptopCard } from "@/components/LaptopCard";
import axiosInstance from "@/utils/axiosInstance";

// Backend se aane wala shape
type BackendLaptop = {
  slug: string;
  ram: number | null;
  internal_storage: number | null;
  price: number;
  currency: string;
  image: string;
  url: string;
};

// UI me use hone wala laptop (CompareContext ke liye id + name bhi add kiya)
export type Laptop = {
  id: string;              // slug ko hi id use karenge
  name: string;            // slug se human readable
  slug: string;
  ram: number | null;
  internal_storage: number | null;
  price: number;
  currency: string;
  image: string;
  url: string;
};

const slugToName = (slug: string): string => {
  if (!slug) return "Unknown Laptop";
  return slug
    .split("-")
    .map((word) => {
      if (word.length <= 2 && /[a-z]/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const Index = () => {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLaptops = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get("/laptops/get-all-laptops");
      const data = res.data as {
        success: boolean;
        laptops: BackendLaptop[];
      };

      if (!data.success || !Array.isArray(data.laptops)) {
        setError("Failed to load laptops from server.");
        return;
      }

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

      setLaptops(mapped);
    } catch (err: any) {
      console.error("Error fetching laptops:", err);
      setError(err?.message || "Something went wrong while fetching laptops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  // Safe search (no toLowerCase crash)
  const filteredLaptops = laptops.filter((lap) => {
    const name = lap.name?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query);
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

            <h1 className="text-4xl md:text-6xl py-1.5 font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
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

              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8"
              >
                <a href="#browse">
                  Browse Laptops
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Browse All Laptops */}
      <section id="browse" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse All Laptops</h2>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by laptop name (slug)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-card"
              />
            </div>
          </div>

          {/* Loading / Error / Results */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Loading laptops from server...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">{error}</p>
            </div>
          ) : filteredLaptops.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredLaptops.map((laptop) => (
                <LaptopCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-lg">
              <p className="text-muted-foreground text-lg">
                No laptops found. Try a different search keyword.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
