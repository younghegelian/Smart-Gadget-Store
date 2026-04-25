// src/components/CompareFloatingButton.tsx
import React from "react";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, GitCompare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CompareFloatingButton: React.FC = () => {
  const { selectedLaptops } = useCompare();
  const navigate = useNavigate();

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 60 }}>
      <div className="flex flex-col items-end gap-2">
        {/* small clear button */}
        {selectedLaptops.length > 0 && (
          <div className="text-right text-xs text-muted-foreground mb-1">
            {selectedLaptops.length} selected
          </div>
        )}

        <Button
          className="rounded-full px-4 py-3 shadow-xl"
          onClick={() => navigate("/compare")}
        >
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            {selectedLaptops.length > 0 && (
              <span className="ml-2 bg-destructive text-white rounded-full px-2 py-0.5 text-xs">
                {selectedLaptops.length}
              </span>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};
