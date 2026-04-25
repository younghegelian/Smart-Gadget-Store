import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, GitCompare, ExternalLink, Plus } from "lucide-react";

export const LaptopCardRecommendation = ({ laptop }: any) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="w-full bg-white border p-5 rounded-xl shadow-sm hover:shadow-md flex gap-7 transition-all"
    >

      {/* IMAGE LEFT - large + prominent */}
      <div className="w-72 h-52 flex justify-center items-center">
        <img src={laptop.image || "/noimg.png"} className="w-full h-full object-contain" />
      </div>

      {/* DETAILS RIGHT */}
      <div className="flex-1 flex flex-col justify-between">
        <h2 className="font-bold text-lg truncate">{laptop.name_url}</h2>

        <p className="text-blue-600 font-bold mt-1">
          {laptop.currency || "₹"} {laptop.price ? laptop.price.toLocaleString("en-IN") : "N/A"}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          {laptop.ram || "?"}GB RAM • {laptop.internal_storage || "?"}GB SSD
        </p>

        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline"><GitCompare size={16} /> Compare</Button>

          <Button size="sm" variant="outline" asChild>
            <a href={laptop.amazon_link} target="_blank"><ExternalLink size={16} /> Browse</a>
          </Button>

          <Button size="sm" className="bg-blue-600 text-white">
            <ShoppingCart size={15} /> Buy
          </Button>

          <Button size="sm" variant="outline">
            <Plus size={15} /> Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
