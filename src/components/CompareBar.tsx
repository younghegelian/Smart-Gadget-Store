import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const CompareBar = () => {
  const { selectedLaptops, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (selectedLaptops.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-card-hover z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <span className="text-sm font-semibold">
                Compare ({selectedLaptops.length}/3)
              </span>
              {selectedLaptops.map((laptop) => (
                <div
                  key={laptop.id}
                  className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg text-sm"
                >
                  <span className="font-medium">{laptop.name}</span>
                  <button
                    onClick={() => removeFromCompare(laptop.id)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearCompare}>
                Clear All
              </Button>
              <Button
                size="sm"
                className="gradient-primary text-white shadow-button"
                onClick={() => navigate("/compare")}
                disabled={selectedLaptops.length < 2}
              >
                Compare Now
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
