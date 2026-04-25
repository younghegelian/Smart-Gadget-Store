import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { Laptop2 } from "lucide-react";

const colleges = ["COEP", "VIT", "PICT", "VIIT", "Cummins", "Bhartiya Vidyapeeth"];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    collegeName: "",
    profilePhoto: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, collegeName } = formData;

    // Validation
    if (!name || !email || !password || !collegeName) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/auth/register", formData);

      if (res.data.success) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="bg-card rounded-2xl shadow-card-hover p-8 border">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="gradient-primary rounded-xl p-3">
              <Laptop2 className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Join thousands of students making smart laptop decisions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Enter your email"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Create a password"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>College *</Label>
              <select
                className="bg-background border rounded-md px-3 py-2"
                value={formData.collegeName}
                onChange={(e) => updateField("collegeName", e.target.value)}
              >
                <option value="">Select your college</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Profile Photo (optional)</Label>
              <Input
                value={formData.profilePhoto}
                onChange={(e) => updateField("profilePhoto", e.target.value)}
                placeholder="Paste image URL"
                className="bg-background"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-white shadow-button"
            >
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
