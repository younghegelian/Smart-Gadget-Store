import { useCompare } from "@/contexts/CompareContext";
import { mockLaptops } from "@/data/laptops";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, X, Award } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Compare = () => {
  const { selectedLaptops, removeFromCompare } = useCompare();
  const { isLoggedIn } = useAuth();
  const [compareSlots, setCompareSlots] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    // Populate initial slots from selected laptops
    const initialSlots = [...compareSlots];
    selectedLaptops.forEach((laptop, idx) => {
      if (idx < 3) {
        initialSlots[idx] = laptop.id;
      }
    });
    setCompareSlots(initialSlots);
  }, []);

  const updateSlot = (index: number, laptopId: string | null) => {
    const newSlots = [...compareSlots];
    newSlots[index] = laptopId;
    setCompareSlots(newSlots);
  };

  const selectedForComparison = compareSlots
    .filter((id) => id !== null)
    .map((id) => mockLaptops.find((l) => l.id === id)!)
    .filter(Boolean);

  const handleBuy = (laptopName: string) => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
    } else {
      alert(`Proceeding to buy ${laptopName}`);
    }
  };

  // Determine best laptops
  const bestForGaming = selectedForComparison.find((l) =>
    l.suitableFor.includes("gaming")
  );
  const bestForBudget = selectedForComparison.reduce((prev, curr) => {
    if (!prev) return curr;
    const priceOrder = { budget: 1, mid: 2, premium: 3 };
    return priceOrder[curr.priceRange] < priceOrder[prev.priceRange]
      ? curr
      : prev;
  }, selectedForComparison[0]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Compare Laptops</h1>
          <p className="text-muted-foreground">
            Select up to 3 laptops to compare side-by-side
          </p>
        </div>

        {/* Laptop Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {compareSlots.map((slotId, index) => (
            <div key={index} className="space-y-2">
              <Label>Laptop {index + 1}</Label>
              <div className="flex gap-2">
                <Select
                  value={slotId || ""}
                  onValueChange={(value) => updateSlot(index, value || null)}
                >
                  <SelectTrigger className="bg-card flex-1">
                    <SelectValue placeholder="Select a laptop" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {mockLaptops.map((laptop) => (
                      <SelectItem key={laptop.id} value={laptop.id}>
                        {laptop.brand} {laptop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {slotId && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      updateSlot(index, null);
                      const laptop = mockLaptops.find((l) => l.id === slotId);
                      if (laptop) removeFromCompare(slotId);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedForComparison.length >= 2 ? (
          <>
            {/* Summary Cards */}
            {(bestForGaming || bestForBudget) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {bestForGaming && (
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">Best for Gaming</h3>
                    </div>
                    <p className="text-lg font-semibold">
                      {bestForGaming.brand} {bestForGaming.name}
                    </p>
                  </div>
                )}
                {bestForBudget && (
                  <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-accent" />
                      <h3 className="font-bold">Best for Budget</h3>
                    </div>
                    <p className="text-lg font-semibold">
                      {bestForBudget.brand} {bestForBudget.name}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Comparison Table */}
            <div className="bg-card rounded-xl border shadow-card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-semibold sticky left-0 bg-muted/50">
                      Specification
                    </th>
                    {selectedForComparison.map((laptop) => (
                      <th key={laptop.id} className="p-4 text-left min-w-[200px]">
                        <div className="font-bold">{laptop.name}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {laptop.brand}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareRow
                    label="Price Range"
                    values={selectedForComparison.map((l) =>
                      l.priceRange.charAt(0).toUpperCase() + l.priceRange.slice(1)
                    )}
                  />
                  <CompareRow
                    label="CPU"
                    values={selectedForComparison.map((l) => l.cpu)}
                  />
                  <CompareRow
                    label="GPU"
                    values={selectedForComparison.map((l) => l.gpu)}
                  />
                  <CompareRow
                    label="RAM"
                    values={selectedForComparison.map((l) => l.ram)}
                  />
                  <CompareRow
                    label="Storage"
                    values={selectedForComparison.map((l) => l.storage)}
                  />
                  <CompareRow
                    label="Display"
                    values={selectedForComparison.map(
                      (l) =>
                        `${l.displaySize}${l.refreshRate ? ` @ ${l.refreshRate}` : ""}`
                    )}
                  />
                  <CompareRow
                    label="Weight"
                    values={selectedForComparison.map((l) => l.weight)}
                  />
                  <CompareRow
                    label="Battery Life"
                    values={selectedForComparison.map((l) => l.batteryLife)}
                  />
                  <CompareRow
                    label="Best For"
                    values={selectedForComparison.map((l) =>
                      l.suitableFor.map((s) => s.replace("-", " ")).join(", ")
                    )}
                  />
                  <CompareRow
                    label="Recommended Branches"
                    values={selectedForComparison.map((l) =>
                      l.recommendedForBranches.join(", ")
                    )}
                  />
                  <tr className="border-b">
                    <td className="p-4 font-semibold sticky left-0 bg-card">
                      Actions
                    </td>
                    {selectedForComparison.map((laptop) => (
                      <td key={laptop.id} className="p-4">
                        <Button
                          onClick={() => handleBuy(laptop.name)}
                          className="w-full gradient-primary text-white shadow-button"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              Select at least 2 laptops to start comparing
            </p>
            <Button variant="outline" asChild>
              <Link to="/">Browse Laptops</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Login Dialog */}
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
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-sm font-medium">{children}</label>
);

const CompareRow = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => (
  <tr className="border-b hover:bg-muted/30 transition-colors">
    <td className="p-4 font-semibold sticky left-0 bg-card">{label}</td>
    {values.map((value, idx) => (
      <td key={idx} className="p-4">
        {value}
      </td>
    ))}
  </tr>
);

export default Compare;
