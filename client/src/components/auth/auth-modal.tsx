import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    email: '',
    password: '',
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
      if (!formData.email.trim() || !formData.password.trim()) {
        toast({
          title: 'Champs requis',
          description: 'Veuillez remplir tous les champs',
          variant: 'destructive',
        });
        return;
      }

      loginMutation.mutate({
        email: formData.email.trim(),
        password: formData.password,
      });
    } else {
      // Validation pour l'inscription
      if (!formData.email.trim()) {
        toast({
          title: 'Email requis',
          description: 'Veuillez saisir votre adresse email',
          variant: 'destructive',
        });
        return;
      }

      // Validation email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast({
          title: 'Email invalide',
          description: 'Veuillez saisir un email valide',
          variant: 'destructive',
        });
        return;
      }

      if (!formData.password.trim() || formData.password.length < 6) {
        toast({
          title: 'Mot de passe invalide',
          description: 'Le mot de passe doit contenir au moins 6 caractères',
          variant: 'destructive',
        });
        return;
      }

      registerMutation.mutate({
        name: formData.email.split('@')[0], // Utilise la partie avant @ comme nom
        email: formData.email.trim(),
        password: formData.password,
        type: 'client', // Par défaut client
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
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
        <DialogTitle className="sr-only">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </DialogTitle>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 text-center">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </DialogTitle>
          <DialogDescription className="text-center text-blue-600">
            {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte avec votre email'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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