import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Missions from '@/pages/missions';
import CreateMission from '@/pages/create-mission';
import Legal from '@/pages/legal';
import Features from '@/pages/features';
import Profile from '@/pages/profile';
import Messages from '@/pages/messages';
import AvailableProviders from './pages/available-providers';
import NotFound from "@/pages/not-found";
import Dashboard from "./pages/dashboard";
import AIFeatures from "./pages/ai-features";
import AITest from "./pages/ai-test";
import AIDashboard from "./pages/ai-dashboard";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/marketplace" component={Marketplace} />
              <Route path="/available-providers" component={AvailableProviders} />
              <Route path="/ai-features" component={AIFeatures} />
              <Route path="/ai-test" component={AITest} />
              <Route path="/features" component={Features} />
              <Route path="/profile" component={Profile} />
              <Route path="/missions/:id" component={Missions} />
              <Route path="/missions" component={Missions} />
              <Route path="/create-mission" component={CreateMission} />
              <Route path="/messages" component={Messages} />
              <Route path="/legal" component={Legal} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/ai-dashboard" component={AIDashboard} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;