import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { MessagesModal, useUnreadMessages } from '@/components/messaging';

export const FloatingSignUpButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const { user, isAuthenticated, logOut } = useAuth();
  const { unreadCount, setUnreadCount } = useUnreadMessages();

  const handleLogOut = () => {
    logOut();
    toast.success('Logged out successfully');
  };

  const handleOpenMessages = () => {
    setIsMessagesOpen(true);
  };

  if (isAuthenticated && user) {
    return (
      <>
        <div className="fixed top-3 right-4 z-[60]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full bg-card/90 backdrop-blur-sm border-border shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 px-4 py-2 h-auto gap-2 relative"
              >
                <User className="h-4 w-4 text-primary" />
                <span className="text-foreground font-medium max-w-[120px] truncate">
                  {user.name}
                </span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem
                onClick={handleOpenMessages}
                className="cursor-pointer gap-2"
              >
                <Mail className="h-4 w-4" />
                Messages
                {unreadCount > 0 && (
                  <span className="ml-auto text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
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

        <MessagesModal
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
          onUnreadCountChange={setUnreadCount}
        />
      </>
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
