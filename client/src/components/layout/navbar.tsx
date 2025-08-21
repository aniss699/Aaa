import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import { User, LogOut, Menu, X, Briefcase, Users } from 'lucide-react';

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Accueil' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/missions', label: 'Mes Missions' },
  ];

  const getUserTypeInfo = () => {
    if (!user) return null;

    return user.type === 'client' 
      ? { icon: Briefcase, label: 'Client', color: 'bg-blue-500' }
      : { icon: Users, label: 'Prestataire', color: 'bg-green-500' };
  };

  const userTypeInfo = getUserTypeInfo();

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">AppelsPro</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`text-sm font-medium transition-colors cursor-pointer hover:scale-105 transform ${
                      location === item.href
                        ? 'text-primary border-b-2 border-primary pb-1'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-2">
                    {userTypeInfo && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                          <userTypeInfo.icon className="w-3 h-3 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {userTypeInfo.label}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} className="hover:scale-105 transform transition-all">
                  Se connecter
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`block px-3 py-2 text-base font-medium cursor-pointer rounded-lg transition-all ${
                      location === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}

              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                      {userTypeInfo && (
                        <div className={`w-6 h-6 ${userTypeInfo.color} rounded-full flex items-center justify-center`}>
                          <userTypeInfo.icon className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                      {userTypeInfo && (
                        <Badge variant="outline" className="text-xs">
                          {userTypeInfo.label}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full justify-start text-gray-600 hover:text-red-600"
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
                    className="w-full"
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