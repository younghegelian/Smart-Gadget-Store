// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Laptop2, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileSidebar, { OrderSummary } from "./ProfileSidebar";
import OrderDetailsModal from "./OrderDetailsModal";
import axiosInstance from "@/utils/axiosInstance";

export const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // data shown in sidebar
  const [profileData, setProfileData] = useState<any>(null);
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  // active order for top-level modal
  const [activeOrder, setActiveOrder] = useState<OrderSummary | null>(null);

  // load profile + orders when drawer opens
  useEffect(() => {
    if (!profileOpen) return;

    const load = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          axiosInstance.get("/auth/profile"),
          axiosInstance.get("/purchase/my-orders"),
        ]);

        if (pRes.data?.success) setProfileData(pRes.data.user ?? pRes.data);
        if (oRes.data?.success) setOrders(oRes.data.orders ?? []);
      } catch (err) {
        console.error("Failed to load profile/orders", err);
      }
    };

    load();
  }, [profileOpen]);

  return (
    <>
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50 shadow-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            {/* LEFT - logo */}
            <div className="flex-1 flex items-center">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="gradient-primary rounded-lg p-2">
                  <Laptop2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bytex_Edu
                </span>
              </Link>
            </div>

            {/* CENTER - nav */}
            <div className="flex-1 hidden md:flex items-center justify-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link to="/recommendations" className="text-sm font-medium hover:text-primary transition-colors">Recommendations</Link>
              <Link to="/compare" className="text-sm font-medium hover:text-primary transition-colors">Comparison</Link>
            </div>

            {/* RIGHT - auth/avatar */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <div className="hidden md:flex items-center gap-3">
                {isLoggedIn && user ? (
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0" onClick={() => setProfileOpen(true)}>
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarFallback className="gradient-primary text-white font-semibold">
                        {user?.name ? String(user.name).charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="gradient-primary text-white shadow-button" asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>

              {isLoggedIn && user ? (
                <Button variant="ghost" className="md:hidden h-9 w-9 p-0" onClick={() => setProfileOpen(true)}>
                  <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarFallback className="gradient-primary text-white font-semibold">
                      {user?.name ? String(user.name).charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : null}

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t">
              <Link to="/" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/recommendations" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>Recommendations</Link>
              <Link to="/compare" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>Compare</Link>

              <div className="px-4 pt-2 space-y-2">
                {isLoggedIn && user ? (
                  <>
                    <div className="py-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.branch} • {user.collegeId}</p>
                    </div>
                    <Button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full">Log out</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="w-full gradient-primary text-white">
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar drawer */}
      <ProfileSidebar
        open={profileOpen}
        onOpenChange={(v: boolean) => setProfileOpen(v)}
        onOpenOrder={(o: OrderSummary) => setActiveOrder(o)}
      />

      {/* Top-level order modal (opens after drawer closed) */}
      {activeOrder && (
        <OrderDetailsModal
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onOrderUpdated={(u) => {
            // update local orders if needed
            setOrders((cur) => cur.map((it) => (it.purchaseId === u.purchaseId ? u : it)));
          }}
        />
      )}
    </>
  );
};

export default Navbar;
