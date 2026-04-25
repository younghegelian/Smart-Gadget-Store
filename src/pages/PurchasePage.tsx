import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "NetBanking", "Cash"] as const;

function parsePriceValue(raw: any): number {
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  const cleaned = String(raw).replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function PurchasePage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, requireAuth } = useAuth();

  const qLaptopId = searchParams.get("laptopId");
  const qPrice = searchParams.get("price");

  const state = (location.state || {}) as { laptopId?: string; price?: any; slug?: string };

  const initialLaptopId = qLaptopId ?? state.laptopId ?? "";
  const initialPriceRaw = qPrice ?? state.price ?? "";
  const initialPrice = parsePriceValue(initialPriceRaw);

  const [laptopId] = useState<string>(initialLaptopId);
  const [pricePaid] = useState<number>(initialPrice);
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!laptopId || !pricePaid) {
      toast.error("Purchase data missing — redirecting to product page.");
      const returnUrl = state.slug ? `/laptop/${state.slug}` : "/";
      setTimeout(() => navigate(returnUrl), 900);
      return;
    }

    if (!isLoggedIn) {
      requireAuth(() => {}, `/purchase?laptopId=${encodeURIComponent(laptopId)}&price=${encodeURIComponent(pricePaid)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!laptopId) {
      toast.error("Laptop ID missing.");
      return;
    }
    if (!pricePaid || pricePaid <= 0) {
      toast.error("Invalid price.");
      return;
    }
    if (!isLoggedIn) {
      requireAuth(() => {}, `/purchase?laptopId=${encodeURIComponent(laptopId)}&price=${encodeURIComponent(pricePaid)}`);
      return;
    }

    setLoading(true);
    try {
      // body contains only laptopId, pricePaid and paymentMethod
      const body = {
        laptopId,
        pricePaid,
        paymentMethod,
      };

      // Prefer axiosInstance interceptor to attach Authorization header.
      // But as a safe fallback, read token and attach header explicitly.
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

      // Use the exact API path your backend expects
      const res = await axiosInstance.post("/purchase/buy-laptop", body, config);

      if (res.data?.success) {
        // Optionally show order id if returned: res.data.orderId
        toast.success("Purchase successful!");
        setTimeout(() => navigate("/"), 800);
      } else {
        toast.error(res.data?.message ?? "Purchase failed");
      }
    } catch (err: any) {
      console.error("Purchase error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Confirm Purchase</h1>

      <form onSubmit={handleConfirm} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Laptop ID</label>
          <input value={laptopId || "undefined"} readOnly className="w-full border rounded px-3 py-2 bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (INR)</label>
          <input value={pricePaid || 0} readOnly className="w-full border rounded px-3 py-2 bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="bg-blue-600 text-white flex-1">
            {loading ? "Processing..." : "Confirm Purchase"}
          </Button>

          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
