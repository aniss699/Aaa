
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: '',
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      onClose();
      toast({
        title: 'Connexion réussie !',
        description: 'Bienvenue sur AppelsPro',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Email ou mot de passe incorrect',
        variant: 'destructive',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; type: string }) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      onClose();
      toast({
        title: 'Compte créé avec succès !',
        description: 'Bienvenue sur AppelsPro',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur lors de l\'inscription',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.type) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs obligatoires',
          variant: 'destructive',
        });
        return;
      }
      
      registerMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.type,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', type: '' });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = (newMode: 'login' | 'register') => {
    resetForm();
    onSwitchMode(newMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 text-center">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-blue-800">
                Nom complet
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-blue-800">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-blue-800">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="mt-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-blue-800">
                Type de compte
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    formData.type === 'client' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-blue-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleInputChange('type', 'client')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.type === 'client' ? 'bg-blue-500' : 'bg-blue-100'
                      }`}>
                        <Briefcase className={`w-5 h-5 ${
                          formData.type === 'client' ? 'text-white' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">Client</h3>
                        <p className="text-sm text-blue-600">Je poste des missions et reçois des devis</p>
                      </div>
                      {formData.type === 'client' && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all border-2 ${
                    formData.type === 'provider' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-blue-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleInputChange('type', 'provider')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.type === 'provider' ? 'bg-blue-500' : 'bg-blue-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          formData.type === 'provider' ? 'text-white' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">Prestataire</h3>
                        <p className="text-sm text-blue-600">Je réponds aux missions et propose mes services</p>
                      </div>
                      {formData.type === 'provider' && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {loginMutation.isPending || registerMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Chargement...</span>
              </div>
            ) : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-blue-800 hover:text-blue-900 font-semibold underline"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-800 hover:text-blue-900 font-semibold underline"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
