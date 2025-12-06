import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, ClipboardList } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SurveyModal } from '@/components/survey';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
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
    <header className="fixed-navbar sticky top-4 mx-auto max-w-7xl z-50 transition-all duration-300">
      <div className="mx-4 sm:mx-6 lg:mx-8 bg-white/70 backdrop-blur-lg border border-white/40 shadow-sm rounded-full px-6 py-2 transition-all hover:bg-white/80 hover:shadow-md">
        <nav className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            {isMainPage ? (
              <button
                onClick={() => scrollToSection('hero')}
                className="navbar-logo text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark hover:opacity-80 transition-opacity"
              >
                {t('hero.title')}
              </button>
            ) : (
              <Link
                to="/"
                className="navbar-logo text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark hover:opacity-80 transition-opacity"
              >
                {t('hero.title')}
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isMainPage ? (
              <>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  {t('nav.about')}
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                {t('nav.home')}
              </Link>
            )}
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-200"
            >
              {t('nav.dashboard') || 'Dashboard'}
            </Link>

            {/* Survey Button */}
            <div className="ml-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => setSurveyOpen(true)}
                className="rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 gap-2 px-6"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden lg:inline font-medium">Tell us more about you</span>
                <span className="lg:hidden">Survey</span>
              </Button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">{i18n.language === 'en' ? 'EN' : 'PT'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel rounded-xl">
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="rounded-lg focus:bg-primary/10 cursor-pointer">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('pt')} className="rounded-lg focus:bg-primary/10 cursor-pointer">
                  Português
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/20 mt-2 space-y-2 animate-accordion-down">
            {isMainPage ? (
              <>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-colors"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-colors"
                >
                  {t('nav.about')}
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
            )}
            <Link
              to="/dashboard"
              className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.dashboard') || 'Dashboard'}
            </Link>

            {/* Mobile Survey Button */}
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                setSurveyOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-full bg-primary hover:bg-primary-dark mt-4 shadow-lg hover:shadow-cyan-500/20"
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Tell us more about you
            </Button>
          </div>
        )}
      </div>

      {/* Survey Modal */}
      <SurveyModal isOpen={surveyOpen} onClose={() => setSurveyOpen(false)} />
    </header>
  );
};
