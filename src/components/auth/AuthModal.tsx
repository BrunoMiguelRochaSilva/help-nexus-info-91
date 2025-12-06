import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signup' | 'login';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, logIn } = useAuth();

  const resetForm = () => {
    setName('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    setMode('signup');
    onClose();
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  const validateFields = (): boolean => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) return;

    setIsLoading(true);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));

    if (mode === 'signup') {
      const result = signUp(name, password);
      if (result.success) {
        toast.success('Account created successfully!');
        handleClose();
      } else {
        setError(result.error || 'Failed to create account');
      }
    } else {
      const result = logIn(name, password);
      if (result.success) {
        toast.success(`Welcome back, ${name.trim()}!`);
        handleClose();
      } else {
        setError(result.error || 'Failed to log in');
      }
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {mode === 'signup' ? 'Create your Rare Help account' : 'Log in to Rare Help'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="auth-name" className="text-foreground">
              Name
            </Label>
            <Input
              id="auth-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              autoComplete="username"
              aria-required="true"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground pr-10"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-medium py-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {mode === 'signup' ? 'Creating account...' : 'Logging in...'}
              </span>
            ) : (
              mode === 'signup' ? 'Create account' : 'Log in'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
              >
                Create one
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
