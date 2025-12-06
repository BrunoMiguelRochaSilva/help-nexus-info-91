import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMainPage = location.pathname === '/';

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed-navbar sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            {isMainPage ? (
              <button
                onClick={() => scrollToSection('hero')}
                className="navbar-logo text-xl font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                {t('hero.title')}
              </button>
            ) : (
              <Link
                to="/"
                className="navbar-logo text-xl font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                {t('hero.title')}
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isMainPage ? (
              <>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="navbar-link text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => scrollToSection('chat')}
                  className="navbar-link text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {t('nav.chat')}
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="navbar-link text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {t('nav.about')}
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="navbar-link text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {t('nav.home')}
              </Link>
            )}
            <Link
              to="/dashboard"
              className="navbar-link text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              {t('nav.dashboard') || 'Dashboard'}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{i18n.language === 'en' ? 'EN' : 'PT'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                  Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-3">
              {isMainPage ? (
                <>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="navbar-link text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {t('nav.home')}
                  </button>
                  <button
                    onClick={() => scrollToSection('chat')}
                    className="navbar-link text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {t('nav.chat')}
                  </button>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="navbar-link text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    {t('nav.about')}
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="navbar-link text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
              )}
              <Link
                to="/dashboard"
                className="navbar-link text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.dashboard') || 'Dashboard'}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
