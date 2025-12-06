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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background dashboard-content">
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
