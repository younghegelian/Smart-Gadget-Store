// src/components/ProfileSidebar.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type OrderSummary = {
  purchaseId: string;
  purchaseDate: string;
  pricePaid: number;
  paymentMethod: string;
  warrantyYears?: number;
  laptop?: any | null;
};

export default function ProfileSidebar({
  open,
  onOpenChange,
  onOpenOrder,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenOrder?: (order: OrderSummary) => void;
}) {
  const { isLoggedIn, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!isLoggedIn) {
      toast.error("Please login to view profile");
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, oRes] = await Promise.all([
          axiosInstance.get("/auth/profile"),
          axiosInstance.get("/purchase/my-orders"),
        ]);
        
        console.log("Profile fetch response:", pRes.data);
        if (pRes.data?.success) setProfile(pRes.data.user ?? pRes.data);
        if (oRes.data?.success) setOrders(oRes.data.orders ?? []);
      } catch (err: any) {
        console.error("Profile/Orders fetch error:", err?.response?.data || err.message);
        toast.error("Failed to load profile/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [open, isLoggedIn]);

  const handleClose = () => onOpenChange(false);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={handleClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        aria-hidden={!open}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-[70] transform transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={handleClose}
      >
        <div
          className="h-full bg-card shadow-2xl overflow-auto p-6"
          onClick={stop}
          style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold">Profile</h3>
            <Button variant="ghost" onClick={handleClose}>✕</Button>
          </div>

          <div className="space-y-5">
            {/* User Details */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/10 border border-primary/10">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : profile ? (
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt={profile.name || profile.email}
                        className="w-20 h-20 rounded-xl object-cover border border-primary/20"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                        {((profile.name ?? profile.email ?? "U").charAt(0) || "U").toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-primary">{profile.name ?? profile.email}</div>
                        <div className="text-sm text-muted-foreground">{profile.email}</div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-primary/10 text-primary">{profile.collegeName ?? "—"}</Badge>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                      <div><strong>Joined:</strong> {new Date(profile.createdAt ?? Date.now()).toLocaleDateString()}</div>
                      <div><strong>Last Updated:</strong> {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "—"}</div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="gradient-primary text-white">Edit Profile</Button>
                      <Button size="sm" variant="outline" onClick={() => { logout(); handleClose(); }}>Logout</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No profile data</p>
              )}
            </div>

            {/* Orders */}
            <div className="p-3 rounded-lg bg-muted/5">
              <h4 className="text-lg font-medium mb-2">My Orders ({orders.length})</h4>

              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                  {orders.map((o) => (
                    <div key={o.purchaseId} className="p-3 border rounded flex justify-between items-center">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">Order: {o.purchaseId}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {o.laptop?.name ?? "Laptop"} • ₹{o.pricePaid}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            onOpenChange(false); // close drawer
                            // give the drawer a moment to start closing, then open modal
                            setTimeout(() => onOpenOrder?.(o), 120);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
