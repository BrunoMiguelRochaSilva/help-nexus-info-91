import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border/50 py-8">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              {t('footer.contact')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
