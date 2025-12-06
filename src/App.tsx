import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language === 'pt' ? 'pt' : 'en';

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <Toaster />
        <Sonner />
        <AccessibilityToolbar language={currentLanguage} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
};

export default App;
