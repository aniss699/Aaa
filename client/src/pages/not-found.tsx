import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function NotFound() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 - Page introuvable</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            La page "{location}" n'existe pas ou a été déplacée.
          </p>

          <div className="mt-6 flex gap-2">
            <Button asChild variant="default">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500">
              Pages disponibles :
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {['/missions', '/marketplace', '/create-mission', '/profile', '/dashboard'].map(path => (
                <Button key={path} asChild variant="link" size="sm" className="h-auto p-1 text-xs">
                  <Link href={path}>{path}</Link>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
