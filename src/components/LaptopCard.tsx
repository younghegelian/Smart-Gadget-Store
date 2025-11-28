import { Laptop } from "@/data/laptops";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, GitCompare, TrendingUp, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompare } from "@/contexts/CompareContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface LaptopCardProps {
  laptop: Laptop;
}

export const LaptopCard = ({ laptop }: LaptopCardProps) => {
  const { isLoggedIn } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const inCompare = isInCompare(laptop.id);

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
    } else {
      // In real app, navigate to purchase flow
      alert(`Proceeding to buy ${laptop.name}`);
    }
  };

  const handleCompareToggle = () => {
    if (inCompare) {
      removeFromCompare(laptop.id);
    } else {
      addToCompare(laptop);
    }
  };

  const priceRangeColors = {
    budget: "bg-green-500/10 text-green-700 border-green-500/20",
    mid: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    premium: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-card rounded-xl border shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col h-full group"
      >
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
              {laptop.name}
            </h3>
            <p className="text-sm text-muted-foreground">{laptop.brand}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {laptop.trending && (
              <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            )}
            <Badge
              variant="outline"
              className={priceRangeColors[laptop.priceRange]}
            >
              {laptop.priceRange.charAt(0).toUpperCase() + laptop.priceRange.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="space-y-2 mb-4 flex-1">
          <SpecRow label="CPU" value={laptop.cpu} />
          <SpecRow label="GPU" value={laptop.gpu} />
          <SpecRow label="RAM" value={laptop.ram} />
          <SpecRow label="Storage" value={laptop.storage} />
          <SpecRow
            label="Display"
            value={`${laptop.displaySize}${laptop.refreshRate ? ` @ ${laptop.refreshRate}` : ""}`}
          />
          <SpecRow label="Weight" value={laptop.weight} />
          <SpecRow label="Battery" value={laptop.batteryLife} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {laptop.suitableFor.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs capitalize">
              {tag.replace("-", " ")}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={inCompare ? "default" : "outline"}
            size="sm"
            onClick={handleCompareToggle}
            className={inCompare ? "gradient-primary text-white flex-1" : "flex-1"}
          >
            {inCompare ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                In Compare
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4 mr-1" />
                Compare
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleBuyClick}
            className="gradient-primary text-white shadow-button flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Buy
          </Button>
        </div>
      </motion.div>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in or register before proceeding to buy.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/login" onClick={() => setShowLoginDialog(false)}>
                Login
              </Link>
            </Button>
            <Button asChild className="flex-1 gradient-primary text-white">
              <Link to="/register" onClick={() => setShowLoginDialog(false)}>
                Register
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);
