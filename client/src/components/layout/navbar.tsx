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

              {/* Desktop Navigation - Show burger menu on all sizes */}
              <div className="flex items-center space-x-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-gray-700 focus:text-gray-900">
                      {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-6">
                      <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/missions" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <Target className="h-4 w-4" />
                        <span>Missions</span>
                      </Link>
                      <Link href="/available-providers" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <Users className="h-4 w-4" />
                        <span>Prestataires</span>
                      </Link>
                      <Link href="/ai-test" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <Brain className="h-4 w-4" />
                        <span>Test IA</span>
                      </Link>
                      <Link href="/ai-dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard IA</span>
                      </Link>
                      <Link href="/messages" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <MessageSquare className="h-4 w-4" />
                        <span>Messages</span>
                      </Link>
                      <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                      </Link>
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

        {/* Burger Menu - Works on all screen sizes */}
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