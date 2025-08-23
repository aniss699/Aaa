
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import { User, LogOut, Menu, X, Briefcase, Users, BarChart3, Target, Brain, MessageSquare, Search, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const navItems = [
    { href: '/marketplace', label: 'Missions', icon: Briefcase },
    { href: '/available-providers', label: 'Prestataires', icon: Users },
    { href: '/features', label: 'Fonctionnalités', icon: BarChart3 }
  ];

  const aiItems = [
    { href: '/ai-dashboard', label: 'Tableau de Bord IA', icon: Brain },
    { href: '/ai-test', label: 'Test IA', icon: Zap },
    { href: '/ai-features', label: 'Fonctionnalités IA', icon: TrendingUp }
  ];

  const NavigationLink = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href}>
      <span className={`cursor-pointer ${className}`}>
        {children}
      </span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavigationLink href="/" className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AppelsPro</span>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </NavigationLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavigationLink 
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors ${
                  location === item.href ? 'text-blue-600 font-medium' : ''
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavigationLink>
            ))}

            {/* AI Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Brain className="w-4 h-4" />
                  <span>IA</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {aiItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <NavigationLink href={item.href} className="flex items-center space-x-2 w-full">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavigationLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NavigationLink href="/messages">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                  </Button>
                </NavigationLink>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <NavigationLink href="/profile" className="flex items-center space-x-2 w-full">
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </NavigationLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <NavigationLink href="/dashboard" className="flex items-center space-x-2 w-full">
                        <BarChart3 className="w-4 h-4" />
                        <span>Tableau de bord</span>
                      </NavigationLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        setLocation(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}

                  {/* AI Items */}
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-500 mb-2">Intelligence Artificielle</div>
                    {aiItems.map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          setLocation(item.href);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                  </div>

                  {/* User Actions */}
                  {user ? (
                    <div className="border-t pt-4 space-y-2">
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => {
                          setLocation('/messages');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => {
                          setLocation('/profile');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profil
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        onClick={() => {
                          setLocation('/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Tableau de bord
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start w-full"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Connexion
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}
