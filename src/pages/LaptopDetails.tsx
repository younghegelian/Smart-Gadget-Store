// src/pages/LaptopDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Star,
  MonitorSmartphone,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LaptopDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [laptop, setLaptop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/laptops/get-by-name/${slug}`);

      if (res.data.success) {
        setLaptop(res.data.laptop);
      } else {
        setError("Laptop not found");
      }
    } catch (err) {
      setError("Failed to load laptop details");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // fetch reviews when laptop loads (use laptop._id)
  useEffect(() => {
    const fetchReviews = async () => {
      if (!laptop) return;
      const laptopId = laptop._id ?? laptop.id ?? null;
      if (!laptopId) return;

      try {
        setReviewsLoading(true);
        const res = await axiosInstance.get(`/review/get-reviews/${laptopId}`);
        if (res.data?.success) {
          setReviews(res.data.reviews ?? []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [laptop]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p className="text-muted-foreground text-lg">
          Fetching laptop details...
        </p>
      </div>
    );

  if (!laptop)
    return (
      <p className="text-center mt-20 text-red-500 text-xl font-semibold">
        {error || "Laptop Not Found"}
      </p>
    );

  // ============================
  // Extract required fields
  // ============================
  const specs = laptop.specs || {};

  // Price extraction from backend
  const firstTag = laptop.pricetags?.[0] ?? null;

  const numericPrice =
    firstTag?.priceValue ??
    (firstTag?.roundedPrice
      ? Number(String(firstTag.roundedPrice).replace(/[^\d]/g, ""))
      : undefined);

  const priceDisplay =
    firstTag?.roundedPrice ?? numericPrice ?? "Price Not Available";

  const rating = "4.6 ★";

  // ============================
  // BUY NOW logic
  // ============================
  const handleBuyNow = () => {
    const laptopId = laptop._id ?? laptop.id ?? "";
    const priceValue = numericPrice ?? 0;

    if (!laptopId || !priceValue) {
      toast.error("Laptop ID or price missing");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login first to purchase");
      return;
    }

    // Navigate with both query params + state (reliable)
    navigate(
      `/purchase?laptopId=${encodeURIComponent(
        laptopId
      )}&price=${encodeURIComponent(priceValue)}`,
      {
        state: {
          laptopId: laptopId,
          price: priceValue,
          slug: slug ?? "",
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* HEADER */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {slug?.toUpperCase().replace(/-/g, " ")}
      </h1>

      {/* RATING + PRICE */}
      <div className="flex items-center gap-3 mt-2">
        <Badge className="bg-green-600 text-white text-base px-3 py-1">
          {rating}
        </Badge>
        <span className="text-3xl font-bold">₹ {priceDisplay}</span>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* IMAGE */}
        <div className="flex justify-center">
          <img
            src={firstTag?.image}
            className="rounded-xl shadow-lg border w-full max-w-md object-cover"
            alt={slug}
          />
        </div>

        {/* SPECS */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold mb-3">Technical Specifications</h2>

          <div className="space-y-3 text-lg">
            <Spec
              label="CPU Clock Speed"
              value={`${specs.cpu_clock_speed ?? "N/A"} GHz`}
              icon={<Cpu />}
            />
            <Spec
              label="GPU VRAM"
              value={`${specs.gpu_vram ?? "N/A"} GB`}
              icon={<MonitorSmartphone />}
            />
            <Spec
              label="RAM"
              value={`${specs.ram ?? "N/A"} GB`}
              icon={<MemoryStick />}
            />
            <Spec
              label="Storage"
              value={`${specs.internal_storage ?? "N/A"} GB SSD`}
              icon={<HardDrive />}
            />
            <Spec
              label="Resolution"
              value={specs.resolution ?? "N/A"}
              icon={<MonitorSmartphone />}
            />
            <Spec label="Weight" value={specs.weight ?? "N/A"} icon={<Star />} />
            <Spec
              label="Thickness"
              value={specs.thickness ?? "N/A"}
              icon={<Star />}
            />
          </div>

          {/* CTA BUTTONS */}
          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>

            {/* <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => toast("Feature coming soon!")}
            >
              Add to Compare
            </Button> */}
          </div>
        </div>
      </div>

      {/* STORE PRICES */}
      <h2 className="text-2xl font-bold mt-14 mb-5">Available Variants</h2>

      <div className="space-y-5 mb-8">
        {laptop.pricetags?.map((p: any, i: number) => (
          <div
            key={i}
            className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-center gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold text-lg">{p.name}</p>
              <p className="text-xl font-bold text-green-600 mt-1">{p.roundedPrice}</p>
            </div>

            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <a href={p.url} target="_blank" rel="noreferrer">
                View Offer
              </a>
            </Button>
          </div>
        ))}
      </div>

      {/* REVIEWS SECTION */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Reviews</h2>

      <div className="space-y-4">
        {reviewsLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="animate-spin h-5 w-5" /> Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-4 border rounded text-sm text-muted-foreground">No reviews yet</div>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="p-4 border rounded">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.user?.email ?? r.userId ?? "User"}</div>
                <div className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5" fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>

              <div className="mt-2 text-sm">{r.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Spec({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-3 border-b pb-2">
      <div className="text-primary">{icon}</div>
      <span className="font-semibold w-40">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
