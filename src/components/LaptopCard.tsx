// src/components/LaptopCard.tsx
import { motion } from "framer-motion";
import { GitCompare, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import type { Laptop } from "@/pages/Index";
import { useNavigate } from "react-router-dom";

interface LaptopCardProps {
  laptop: Laptop;
}

export const LaptopCard = ({ laptop }: LaptopCardProps) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const navigate = useNavigate();

  const inCompare = isInCompare(laptop.id);

  const stop = (e?: React.MouseEvent) => {
    e?.stopPropagation();
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    stop(e);
    inCompare ? removeFromCompare(laptop.id) : addToCompare(laptop);
  };

  const handleBrowseClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    stop(e);
    // anchor click will open external url
  };

  const ramLabel =
    laptop.ram != null ? `${laptop.ram} GB RAM` : "RAM info not available";
  const storageLabel =
    laptop.internal_storage != null
      ? `${laptop.internal_storage} GB Storage`
      : "Storage info not available";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="w-full bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-4 flex gap-5 cursor-pointer"
      onClick={() => navigate(`/laptop/${laptop.slug}`)}
    >
      {/* LEFT: big image */}
      <div className="w-44 flex items-center justify-center">
        <div className="w-40 h-40 bg-muted/30 rounded-lg overflow-hidden border flex items-center justify-center">
          {laptop.image ? (
            <img
              src={laptop.image}
              alt={laptop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground px-2 text-center">
              No image
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: text + buttons */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Top: Compare + Browse (kept Browse as small link if you still want it) */}
        <div className="flex justify-end gap-2 text-sm">
          <Button
            variant={inCompare ? "default" : "outline"}
            size="sm"
            className={`h-8 px-3 flex items-center gap-1 ${inCompare ? "bg-blue-600 text-white" : ""}`}
            onClick={handleCompareToggle}
          >
            {inCompare ? <CheckCircle2 className="h-3 w-3" /> : <GitCompare className="h-3 w-3" />}
            <span>Compare</span>
          </Button>

          {/* Small external browse link kept as non-intrusive option */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 px-3 flex items-center gap-1"
            onClick={(e) => stop(e)}
          >
            <a href={laptop.url} target="_blank" rel="noreferrer" onClick={handleBrowseClick}>
              <ExternalLink className="h-3 w-3" />
              <span>Browse</span>
            </a>
          </Button>
        </div>

        {/* Name */}
        <h2 className="text-base font-semibold leading-snug text-foreground line-clamp-2">
          {laptop.name}
        </h2>

        {/* Price */}
        <div className="text-xl font-bold text-blue-600">
          {laptop.currency}{" "}
          {typeof laptop.price === "number"
            ? laptop.price.toLocaleString("en-IN")
            : laptop.price ?? "—"}
        </div>

        {/* RAM + Storage */}
        <div className="mt-1 text-sm text-foreground">
          <div>{ramLabel}</div>
          <div>{storageLabel}</div>
        </div>

        {/* NOTE: Removed Buy, Add to cart buttons per request */}
      </div>
    </motion.div>
  );
};
