import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { branches, mockColleges } from "@/data/colleges";
import { Laptop2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Register = () => {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "",
    collegeId: "",
    branch: "",
    mobileNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.userId || !formData.password || !formData.name || 
        !formData.collegeId || !formData.branch || !formData.mobileNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const { password, ...profile } = formData;
    const success = await register(profile, password);
    setLoading(false);

    if (success) {
      toast.success("Registration successful! Welcome aboard!");
      navigate("/");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID *</Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Choose a unique ID"
                  value={formData.userId}
                  onChange={(e) => updateField("userId", e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="college">College *</Label>
                <Select
                  value={formData.collegeId}
                  onValueChange={(value) => updateField("collegeId", value)}
                  required
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {mockColleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select
                  value={formData.branch}
                  onValueChange={(value) => updateField("branch", value)}
                  required
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.mobileNumber}
                onChange={(e) => updateField("mobileNumber", e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your address (optional)"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                rows={3}
                className="bg-background resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white shadow-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Login here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
