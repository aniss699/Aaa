import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Missions from "@/pages/missions";
import Legal from '@/pages/legal';
import Features from '@/pages/features';
import Profile from '@/pages/profile';
import Messages from '@/pages/messages';
import AvailableProviders from './pages/available-providers';
import NotFound from "@/pages/not-found";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/missions" component={Missions} />
      <Route path="/legal" component={Legal} />
      <Route path="/cgv" component={Legal} />
      <Route path="/mentions-legales" component={Legal} />
      <Route path="/features" component={Features} />
      <Route path="/profile" component={Profile} />
      <Route path="/messages" component={Messages} />
      <Route path="/available-providers" component={AvailableProviders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/marketplace', element: <Marketplace /> },
    { path: '/available-providers', element: <AvailableProviders /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/missions', element: <Missions /> },
    { path: '/profile', element: <Profile /> },
    { path: '/messages', element: <Messages /> },
    { path: '/features', element: <Features /> },
    { path: '/legal', element: <Legal /> },
    { path: '*', element: <NotFound /> },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <RouterProvider router={router} />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;