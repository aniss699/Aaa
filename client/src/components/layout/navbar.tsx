
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import { User, LogOut, Menu, X, Briefcase, Users, BarChart3, Target, Brain, MessageSquare, Search, Zap, TrendingUp } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const NavLink = ({ href, children, className = "" }: { href: string, children: React.ReactNode, className?: string }) => (
    <button
      onClick={() => setLocation(href)}
      className={`text-gray-700 hover:text-primary transition-colors ${className} ${
        location === href ? 'text-primary font-medium' : ''
      }`}
    >
      {children}
    </button>
  );

  const MobileNavLink = ({ href, children, icon: Icon }: { href: string, children: React.ReactNode, icon: any }) => (
    <button
      onClick={() => setLocation(href)}
      className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
        location === href ? 'text-primary bg-blue-50 border-r-2 border-primary' : 'text-gray-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </button>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => setLocation('/')}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">AppelsPro</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/marketplace">Missions</NavLink>
            <NavLink href="/available-providers">Prestataires</NavLink>
            
            {/* AI Features Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-primary transition-colors bg-transparent">
                    <Brain className="w-4 h-4 mr-2" />
                    IA Features
                    <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                      NOUVEAU
                    </Badge>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <button
                            onClick={() => setLocation('/ai-dashboard')}
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-blue-600 p-6 no-underline outline-none focus:shadow-md text-left"
                          >
                            <Brain className="h-6 w-6 text-white" />
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              Tableau de Bord IA
                            </div>
                            <p className="text-sm leading-tight text-purple-100">
                              Dashboard centralisé avec toutes les fonctionnalités IA
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </div>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation('/ai-features')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                        >
                          <Zap className="h-4 w-4 mb-2 text-yellow-500" />
                          <div className="text-sm font-medium leading-none">Fonctionnalités IA</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Découvrez tous nos outils d'intelligence artificielle
                          </p>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button
                          onClick={() => setLocation('/ai-test')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                        >
                          <Search className="h-4 w-4 mb-2 text-green-500" />
                          <div className="text-sm font-medium leading-none">Test IA</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Zone de test pour les algorithmes IA
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavLink href="/features">Fonctionnalités</NavLink>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Desktop User Menu */}
                <div className="hidden lg:flex items-center space-x-4">
                  <button
                    onClick={() => setLocation('/missions')}
                    className="text-gray-700 hover:text-primary transition-colors"
                  >
                    Mes missions
                  </button>
                  <button
                    onClick={() => setLocation('/messages')}
                    className="text-gray-700 hover:text-primary transition-colors relative"
                  >
                    Messages
                  </button>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden sm:block text-gray-700">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => setLocation('/profile')}
                        className="flex items-center w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profil
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => setLocation('/dashboard')}
                        className="flex items-center w-full"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Tableau de bord
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => setLocation('/missions')}
                        className="flex items-center w-full lg:hidden"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Mes missions
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => setLocation('/messages')}
                        className="flex items-center w-full lg:hidden"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-red-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => handleAuthClick('login')}
                  className="hidden sm:flex"
                >
                  Se connecter
                </Button>
                <Button
                  onClick={() => handleAuthClick('register')}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Créer un compte
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="py-6">
                  <div className="px-6 pb-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  </div>
                  
                  <div className="py-4">
                    <MobileNavLink href="/marketplace" icon={Target}>
                      Missions
                    </MobileNavLink>
                    <MobileNavLink href="/available-providers" icon={Users}>
                      Prestataires
                    </MobileNavLink>
                    <MobileNavLink href="/ai-dashboard" icon={Brain}>
                      <div className="flex items-center justify-between w-full">
                        <span>IA Dashboard</span>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">NOUVEAU</Badge>
                      </div>
                    </MobileNavLink>
                    <MobileNavLink href="/ai-features" icon={Zap}>
                      Fonctionnalités IA
                    </MobileNavLink>
                    <MobileNavLink href="/features" icon={BarChart3}>
                      Fonctionnalités
                    </MobileNavLink>

                    {!user && (
                      <div className="px-4 py-4 border-t border-gray-200 mt-4">
                        <div className="space-y-3">
                          <Button
                            onClick={() => handleAuthClick('login')}
                            variant="outline"
                            className="w-full"
                          >
                            Se connecter
                          </Button>
                          <Button
                            onClick={() => handleAuthClick('register')}
                            className="w-full bg-primary hover:bg-primary-dark"
                          >
                            Créer un compte
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </nav>
  );
}
