import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import { User, LogOut, Menu, X, Briefcase, Users, BarChart3, Target, Brain, MessageSquare } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/available-providers', label: 'Prestataires Disponibles' },
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/missions', label: 'Mes Missions' },
    { href: '/messages', label: 'Messages' },
    { href: '/profile', label: 'Mon Profil' },
    { href: '/features', label: 'Fonctionnalités' },
    { href: '/ai-test', label: '🧪 Test IA' },
    { href: '/ai-features', label: '🧠 IA Features' },
    { href: '/ai-dashboard', label: 'Dashboard IA' },
  ];

  const desktopItems = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/available-providers', label: 'Prestataires Disponibles' },
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/missions', label: 'Mes Missions' },
    { href: '/messages', label: 'Messages' },
    { href: '/profile', label: 'Mon Profil' },
    { href: '/features', label: 'Fonctionnalités' },
  ];


  const getUserTypeInfo = () => {
    if (!user) return null;

    return user.type === 'client'
      ? { icon: Briefcase, label: 'Client', color: 'bg-blue-600' }
      : { icon: Users, label: 'Prestataire', color: 'bg-blue-500' };
  };

  const userTypeInfo = getUserTypeInfo();

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-2">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  AppelsPro
                </div>
              </Link>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden lg:flex items-center space-x-4">
                <NavigationMenuList>
                  {desktopItems.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <div className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                          <Link href={item.href}>{item.label}</Link>
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                      Plus
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:grid-cols-2 ">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <Briefcase className="h-6 w-6 text-blue-500" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                AppelsPro
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Votre plateforme de mise en relation pour les missions freelance.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <ListItem href="/ai-test" title="Test IA">
                          Expérimentez avec nos fonctionnalités IA.
                        </ListItem>
                        <ListItem href="/ai-features" title="IA Features">
                          Découvrez les capacités avancées de notre IA.
                        </ListItem>
                        <ListItem href="/ai-dashboard" title="Dashboard IA">
                          Visualisez les performances de l'IA.
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Burger Menu */}
              <div className="flex items-center md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-700 focus:text-gray-900">
                      {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-6">
                      {navigationItems.map((item) => (
                        <Link href={item.href} key={item.href} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                          {/* Icon placeholder, you might want to map icons to labels */}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2 shadow-sm border">
                    {userTypeInfo && (
                      <div className={`w-8 h-8 ${userTypeInfo.color} rounded-full flex items-center justify-center animate-pulse`}>
                        <userTypeInfo.icon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 leading-tight">{user.name}</span>
                      {userTypeInfo && (
                        <Badge variant="secondary" className="text-xs font-bold mt-1">
                          {userTypeInfo.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-red-500 hover:text-red-700 font-semibold border-red-300 hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal(true)}
                    className="font-semibold border-blue-300 text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Commencer
                  </Button>
                </div>
              )}
            </div>


          </div>
        </div>

        {/* Mobile Menu (when sheet is open) */}
        {showMobileMenu && (
          <div className="border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm fixed left-0 right-0 top-[72px] bottom-0 z-40 overflow-hidden">
            <div className="h-full overflow-y-auto px-3 pt-4 pb-4">
              <div className="space-y-2 max-h-full">
                {navigationItems.map((item) => (
                  <div
                    key={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium cursor-pointer rounded-lg transition-all duration-200 ${
                      location === item.href
                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setShowMobileMenu(false);
                      setLocation(item.href);
                    }}
                  >
                    {item.label}
                  </div>
                ))}

                <div className="border-t border-gray-200 mt-4 pt-4">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        {userTypeInfo && (
                          <div className={`w-7 h-7 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                            <userTypeInfo.icon className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{user.name}</span>
                          {userTypeInfo && (
                            <Badge variant="secondary" className="text-xs mt-1 w-fit">
                              {userTypeInfo.label}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout();
                          setShowMobileMenu(false);
                        }}
                        className="w-full justify-center text-red-500 hover:text-red-700 font-medium py-2 px-3 rounded-lg border-red-200 hover:border-red-400 text-sm"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm"
                    >
                      Se connecter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

// Helper component for ListItem
function ListItem({ className, title, children, ...props }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-tight text-muted-foreground">
            {children}
          </p>
        </div>
      </NavigationMenuLink>
    </li>
  );
}