// src/components/OrderDetailsModal.tsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";

type OrderSummary = {
  purchaseId: string;
  purchaseDate: string;
  pricePaid: number;
  paymentMethod: string;
  warrantyYears?: number;
  laptop?: any | null;
};

export default function OrderDetailsModal({
  order,
  onClose,
  onOrderUpdated,
}: {
  order: OrderSummary;
  onClose: () => void;
  onOrderUpdated?: (o: OrderSummary) => void;
}) {
  const { isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const laptopId = order.laptop?._id ?? order.laptop?.id ?? null;

  useEffect(() => {
    if (!laptopId) return;
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/review/get-reviews/${laptopId}`);
        if (res.data?.success) setReviews(res.data.reviews ?? []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    fetchReviews();
  }, [laptopId]);

  const submitReview = async () => {
    if (!isLoggedIn) { toast.error("Login to submit review"); return; }
    if (!laptopId) { toast.error("Laptop info missing"); return; }
    if (rating <= 0) { toast.error("Please select a rating"); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("token") ?? "";
      const body = { laptopId, rating, comment };

      // send token in Authorization header (Bearer)
      const res = await axiosInstance.post("/review/add-review", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        toast.success("Review added");
        // refresh reviews
        const rres = await axiosInstance.get(`/review/get-reviews/${laptopId}`);
        if (rres.data?.success) setReviews(rres.data.reviews ?? []);
        onOrderUpdated?.(order);
        setComment("");
        setRating(0);
      } else {
        toast.error(res.data?.message || "Failed to add review");
      }
    } catch (err: any) {
      console.error("Add review err", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl p-0 rounded-xl overflow-hidden"
        style={{ marginTop: "32px", marginBottom: "32px" }}
      >
        {/* Sticky header + order summary */}
        <div
          className="bg-card border-b"
          style={{ position: "sticky", top: 0, zIndex: 30 }}
        >
          <DialogHeader>
            <div className="px-4 py-3">
              <DialogTitle>Order Details</DialogTitle>
            </div>
          </DialogHeader>

          {/* Order summary - keep visible (sticky under header) */}
          <div className="px-4 pb-4">
            <div className="p-3 border rounded bg-white">
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-medium break-all">{order.purchaseId}</div>

              <div className="text-sm mt-2">Date: {new Date(order.purchaseDate).toLocaleString()}</div>
              <div className="text-sm">Price: ₹{order.pricePaid}</div>
              <div className="text-sm">Payment: {order.paymentMethod}</div>
              <div className="text-sm">Warranty: {order.warrantyYears ?? "N/A"} years</div>

              {order.laptop && (
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">Laptop</div>
                  <div className="font-medium">{order.laptop.name}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content area (reviews + add-review) */}
        <div
          className="px-4"
          style={{
            // total modal height is 80vh, header+summary ~ 220px (approx) so reserve rest
            maxHeight: "calc(80vh - 200px)",
            overflowY: "auto",
            paddingBottom: 12,
          }}
        >
          {/* Reviews list */}
          <div className="p-3 border rounded mb-4 bg-white">
            <h4 className="font-medium mb-2">Reviews</h4>

            {reviews.length === 0 ? (
              <div className="text-sm text-muted-foreground">No reviews yet</div>
            ) : (
              <div className="space-y-3">
                {reviews.map((r: any) => (
                  <div key={r._id} className="border rounded p-2 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{r.user?.email ?? r.userId ?? "User"}</div>
                      <div className="text-sm text-muted-foreground">• {new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4" fill={i < r.rating ? "currentColor" : "none"} />
                      ))}
                    </div>

                    <div className="mt-2 text-sm">{r.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add review (also scrollable) */}
          <div className="p-3 border rounded mb-6 bg-white">
            <h4 className="font-medium mb-2">Add Review</h4>

            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => {
                const idx = i + 1;
                const selected = rating >= idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRating(idx)}
                    className={`p-1 ${selected ? "text-yellow-500" : "text-muted-foreground"}`}
                    aria-label={`${idx} star`}
                  >
                    <Star className="w-6 h-6" fill={selected ? "currentColor" : "none"} />
                  </button>
                );
              })}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded p-2"
              rows={4}
            />

            <div className="flex gap-2 mt-3">
              <Button onClick={submitReview} disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
              <Button variant="outline" onClick={() => { setComment(""); setRating(0); }}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky footer with Close (always visible) */}
        <div
          className="border-t bg-card px-4 py-3"
          style={{ position: "sticky", bottom: 0, zIndex: 30 }}
        >
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
