import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const FloatingSignUpButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated, logOut } = useAuth();

  const handleLogOut = () => {
    logOut();
    toast.success('Logged out successfully');
  };

  if (isAuthenticated && user) {
    return (
      <div className="fixed top-3 right-4 z-[60]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full bg-card/90 backdrop-blur-sm border-border shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 px-4 py-2 h-auto gap-2"
            >
              <User className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium max-w-[120px] truncate">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem
              onClick={handleLogOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-3 right-4 z-[60]">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 px-6 py-2 h-auto font-medium"
        >
          Sign Up
        </Button>
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
