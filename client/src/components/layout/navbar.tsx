import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import { User, LogOut, Menu, X, Briefcase, Users } from 'lucide-react';

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
                <a className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center hover:scale-105 transition-transform duration-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  AppelsPro
                </a>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {desktopItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className={`text-sm font-medium transition-colors cursor-pointer px-3 py-2 rounded-lg ${
                      location === item.href
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
                <Link 
                  href="/ai-test"
                  className={`text-sm font-medium transition-colors cursor-pointer px-3 py-2 rounded-lg ${
                    location === '/ai-test'
                      ? 'text-green-600 bg-green-50 font-semibold'
                      : 'text-green-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  🧪 Test IA
                </Link>
                <Link 
                  href="/ai-features"
                  className={`text-sm font-medium transition-colors cursor-pointer px-3 py-2 rounded-lg ${
                    location === '/ai-features'
                      ? 'text-purple-600 bg-purple-50 font-semibold'
                      : 'text-purple-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  🧠 IA Features
                </Link>
                <Link 
                  href="/features"
                  className={`text-sm font-medium transition-colors cursor-pointer px-3 py-2 rounded-lg ${
                    location === '/features'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-blue-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  📋 Fonctionnalités
                </Link>
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
                        <Badge variant="premium" className="text-xs font-bold mt-1">
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-700 focus:text-gray-900"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm">
            <div className="px-3 pt-4 pb-3 space-y-4">
              {navigationItems.map((item) => (
                <div
                    className={`flex items-center px-4 py-3 text-base font-medium cursor-pointer rounded-xl transition-all duration-200 ${
                      location === item.href
                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setLocation(item.href);
                      setShowMobileMenu(false);
                    }}
                    key={item.href}
                  >
                    {item.label}
                  </div>
              ))}

              <div className="border-t border-gray-200 mt-4 pt-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-3 shadow-inner">
                      {userTypeInfo && (
                        <div className={`w-8 h-8 ${userTypeInfo.color} rounded-full flex items-center justify-center animate-bounce`}>
                          <userTypeInfo.icon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 leading-tight">{user.name}</span>
                        {userTypeInfo && (
                          <Badge variant="premium" className="text-xs font-bold mt-1">
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
                      className="w-full justify-center text-red-500 hover:text-red-700 font-semibold py-2 px-4 rounded-full border-red-300 hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
                  >
                    Se connecter
                  </Button>
                )}
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