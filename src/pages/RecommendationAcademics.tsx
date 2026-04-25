import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LaptopCard } from "@/components/LaptopCard";

export default function RecommendationAcademics() {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [recommendationData, setRecommendationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* 🔥 Convert backend → LaptopCard format */
  const mapBackendToLaptopCard = (lap: any) => ({
    id: lap.slug,
    name: lap.slug.replace(/-/g, " ").toUpperCase(), // pretty Name
    image: lap.image,
    price: lap.price,
    ram: lap.ram,
    internal_storage: lap.internal_storage,
    currency: lap.currency || "₹",
    url: lap.amazon_link, // browse button
  });

  /* 🔥 Upload PDF to backend */
  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");

    setLoading(true);

    const renamed = new File([file], "file.pdf", { type: file.type });
    const formData = new FormData();
    formData.append("file", renamed);  // EXACT Postman format

    try {
      const res = await axiosInstance.post(
        "/curriculum/get-curriculum-wise",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setRecommendationData(res.data.data);
      setUploaded(true);
    } catch (err) {
      alert("Upload failed, verify backend URL.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-14">
      <div className="container mx-auto px-4 max-w-6xl">

        <h1 className="text-4xl font-bold mb-2">Academic-Based Laptop Recommendations</h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Upload your curriculum & get laptop suggestions tailored to your academic workload.
        </p>


        {/* -------------------------------- UPLOAD SCREEN -------------------------------- */}
        {!uploaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-12 text-center border-dashed border-2 hover:border-primary transition-all">

              <Upload className="mx-auto mb-6 h-14 w-14 text-primary" />
              <h2 className="text-xl font-semibold mb-3">Upload Your Curriculum</h2>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mb-4 w-full max-w-xs mx-auto text-sm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <Button size="lg" onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Analyzing..." : <><FileText className="mr-2" /> Upload Curriculum</>}
              </Button>

              <p className="text-sm text-muted-foreground mt-3">
                Supported: PDF • JPG • PNG
              </p>

            </Card>
          </motion.div>
        )}


        {/* -------------------------------- RESULT VIEW -------------------------------- */}
        {uploaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 space-y-10">

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommended Laptops For You</h2>
              <Button variant="outline" onClick={() => setUploaded(false)}>Upload Again</Button>
            </div>

            {recommendationData.map((block, i) => (
              <div key={i} className="space-y-5">

                {/* Subject title */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{block.subject}</h3>
                  <Badge variant="secondary">{block.laptops.length} options</Badge>
                </div>

                {/* LaptopList rendered using same LaptopCard */}
                <div className="flex flex-col gap-5">
                  {block.laptops.map((lap: any, index: number) => {
                    const formatted = mapBackendToLaptopCard(lap);

                    return (
                      <motion.div
                        key={lap.slug}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <LaptopCard laptop={formatted} />
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            ))}

          </motion.div>
        )}
      </div>
    </div>
  );
}
