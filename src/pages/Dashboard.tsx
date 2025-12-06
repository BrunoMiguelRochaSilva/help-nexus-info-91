import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MotivationalSection } from '@/components/MotivationalSection';
import { DashboardSeparator } from '@/components/DashboardSeparator';
import { DashboardFeatures } from '@/components/DashboardFeatures';
import { MetricsOverview } from '@/components/MetricsOverview';
import { RecentFeedback } from '@/components/RecentFeedback';
import { SurveyAnalytics } from '@/components/dashboard/SurveyAnalytics';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Global Background Elements for Dashboard */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-40 pointer-events-none fixed"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none fixed"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none fixed"></div>

      <Header />
      <main className="flex-1 dashboard-content relative z-10">
        <DashboardHeader />
        <MotivationalSection />
        <DashboardSeparator />
        <SurveyAnalytics />
        <DashboardFeatures />
        <MetricsOverview />
        <RecentFeedback />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
