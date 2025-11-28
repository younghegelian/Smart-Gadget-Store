import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { Navbar } from "@/components/Navbar";
import { CompareBar } from "@/components/CompareBar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Compare from "./pages/Compare";
import Recommendations from "./pages/Recommendations";
import RecommendationAcademics from "./pages/RecommendationAcademics";
import RecommendationHobby from "./pages/RecommendationHobby";
import RecommendationGrades from "./pages/RecommendationGrades";
import RecommendationSeniors from "./pages/RecommendationSeniors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CompareProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route
                    path="/recommendations/academics"
                    element={<RecommendationAcademics />}
                  />
                  <Route
                    path="/recommendations/hobby"
                    element={<RecommendationHobby />}
                  />
                  <Route
                    path="/recommendations/grades"
                    element={<RecommendationGrades />}
                  />
                  <Route
                    path="/recommendations/seniors"
                    element={<RecommendationSeniors />}
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <CompareBar />
            </div>
          </BrowserRouter>
        </CompareProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
