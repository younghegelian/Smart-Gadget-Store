// src/pages/RecommendationGrades.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LaptopCard } from "@/components/LaptopCard";
import axiosInstance from "@/utils/axiosInstance";
import { Upload, FileText, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// backend → LaptopCard map
const mapLaptop = (lap: any) => ({
  id: lap.slug,
  slug: lap.slug,
  name: lap.name_url?.replace(/-/g, " ").toUpperCase() ?? lap.slug,
  image: lap.image,
  ram: lap.ram,
  internal_storage: lap.internal_storage,
  currency: lap.currency ?? "₹",
  price: lap.price,
  url: lap.amazon_link,
});

export default function RecommendationGrades() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [bestOverall, setBestOverall] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [totalSubjects, setTotalSubjects] = useState<number | null>(null);
  const [overallSpecs, setOverallSpecs] = useState<any | null>(null);

  // Prefer overall specs from API; fallback to first bestOverall item's required_specs
  const specs = overallSpecs ?? (bestOverall.length > 0 ? bestOverall[0]?.required_specs ?? null : null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      await uploadGradeSheet(f);
    }
  };

  const uploadGradeSheet = async (rawFile: File) => {
    setLoading(true);
    setFailed(false);

    // optional: rename to file.pdf (same as curriculum API)
    const renamed = new File([rawFile], "file.pdf", { type: rawFile.type });

    const formData = new FormData();
    // 🔴 most important – must match: upload.fields([{ name:"file"}])
    formData.append("file", renamed);

    // agar tu image bhi bhejna chahta hai to:
    // formData.append("image", someImageFile);

    const timeout = setTimeout(() => {
      setLoading(false);
      setFailed(true);
      alert("Server took too long. Please try again.");
    }, 20000);

    try {
      const res = await axiosInstance.post(
        "/gradeSheet/get-grade-wise",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data)
      clearTimeout(timeout);
      setLoading(false);

      console.log("💾 GradeSheet API →", res.data);

      if (!res.data?.success) {
        setFailed(true);
        alert(res.data?.message || "Failed to analyze grade sheet");
        return;
      }

      setTotalSubjects(res.data.total_subjects ?? null);
      setSubjects(res.data.subjects ?? []);
      setBestOverall(res.data.bestlaptop ?? []);
      setOverallSpecs(res.data.overall_required_specs ?? null);
    } catch (err) {
      clearTimeout(timeout);
      setLoading(false);
      setFailed(true);
      console.error("Upload Error:", err);
      alert("Something went wrong while uploading / analyzing.");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Grade-Sheet Based Recommendations
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your grade sheet — we’ll analyze{" "}
            <b>previously studied subjects</b> and suggest laptops per subject,
            plus overall best picks.
          </p>
        </div>

        {/* --------- UPLOAD --------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-8 border-dashed border-2 hover:border-primary/60 transition-colors">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center text-center md:w-1/3">
                <div className="inline-flex p-6 rounded-2xl gradient-card mb-4">
                  <Upload className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Upload Your Grade Sheet
                </h3>
                <p className="text-sm text-muted-foreground">
                  We’ll auto-detect ML, AI, DS, CV, NLP etc. and match laptops
                  that can handle those subjects.
                </p>
              </div>

              <div className="md:w-2/3 flex flex-col gap-4">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="block w-full cursor-pointer border rounded-lg p-2 bg-background"
                  onChange={handleFileChange}
                />
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    disabled={!file || loading}
                    onClick={() => file && uploadGradeSheet(file)}
                    className="gradient-primary text-white"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Analyze Grade Sheet
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Key: <code>file</code> • multipart/form-data • PDF / Image
                  </span>
                </div>
                {failed && (
                  <p className="text-sm text-red-500">
                    Failed to process grade sheet. Please try again or check
                    backend logs.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* --------- LOADING STATE --------- */}
        {loading && (
          <Card className="p-10 text-center mb-8">
            <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin" />
            <p className="font-medium">
              Analyzing your grades, predicting future subjects...
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Fetching the best ML / AI / Data-ready laptops for you.
            </p>
          </Card>
        )}

        {/* --------- RESPONSE UI --------- */}
        {!loading && subjects.length > 0 && (
          <div className="space-y-10">
            {/* Overall best laptops */}
            {bestOverall.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-yellow-500" />
                  <h2 className="text-2xl font-bold">
                    Overall Best Laptops for Your Track
                  </h2>
                  {totalSubjects && (
                    <Badge variant="secondary">
                      Analyzed {totalSubjects} subjects
                    </Badge>
                  )}
                </div>
                  {/* Overall required specs */}
                  <Card className="p-6 text-base bg-gradient-to-r from-primary/5 to-secondary/10 border-primary/20 space-y-1 mb-6">
                    <p className="font-semibold text-lg mb-3">
                      Recommended Specs Based on All Analyzed Subjects
                    </p>
                    {specs ? (
                      <>
                        <p><b>CPU:</b> ≥ {specs?.cpu ?? "N/A"} GHz</p>
                        <p><b>RAM:</b> ≥ {specs?.ram ?? "N/A"} GB</p>
                        <p><b>GPU VRAM:</b> ≥ {specs?.gpu_vram ?? 0} GB</p>
                        <p><b>Storage:</b> ≥ {specs?.storage ?? "N/A"} GB</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground italic">Specs not available from backend</p>
                    )}
                  </Card>

                <div className="flex flex-wrap gap-6">
                  {bestOverall.map((lap, idx) => (
                    <motion.div
                      key={lap.slug || idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <Badge className="mb-2 px-3 py-1 text-xs bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                        #{idx + 1} OVERALL PICK
                      </Badge>
                      <LaptopCard laptop={mapLaptop(lap)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Subject-wise recommendations removed: showing only overall specs and overall best laptops per request */}
          </div>
        )}

        {/* Empty state when nothing uploaded yet and no loading */}
        {!loading && subjects.length === 0 && !failed && (
          <Card className="p-10 text-center mt-6">
            <p className="text-muted-foreground">
              Upload a grade sheet to see laptops for each advanced subject you
              are likely to study.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
