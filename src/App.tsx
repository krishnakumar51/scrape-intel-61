import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import CreateAgent from "./pages/CreateAgent";
import AgentSetup from "./pages/AgentSetup";
import AgentInteraction from "./pages/AgentInteraction";
import ScrapingStatus from "./pages/ScrapingStatus";
import CompletedScraping from "./pages/CompletedScraping";
import Dashboard from "./pages/Dashboard";
import Metrics from "./pages/Metrics";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ProjectMetrics from "./pages/ProjectMetrics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-agent" element={<CreateAgent />} />
            <Route path="/agent-setup" element={<AgentSetup />} />
            <Route path="/agent-interaction" element={<AgentInteraction />} />
            <Route path="/scraping-status" element={<ScrapingStatus />} />
            <Route path="/scraping-complete" element={<CompletedScraping />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/metrics/:projectName" element={<ProjectMetrics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
