import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "language": "Language",
      "nav.home": "Home",
      "nav.chat": "Chat",
      "nav.knowledge": "Knowledge Base",
      "nav.about": "About",
      "nav.dashboard": "Dashboard",
      
      // Admin
      "admin.title": "Admin Login",
      "admin.subtitle": "Access the admin dashboard",
      "admin.email": "Email",
      "admin.password": "Password",
      "admin.login": "Login",
      "admin.loggingIn": "Logging in...",
      "admin.backToHome": "Back to Home",
      "admin.loginSuccess": "Login successful",
      "admin.loginError": "Login failed. Please check your credentials.",
      "admin.notAuthorized": "You are not authorized to access this page",
      "admin.dashboard": "Admin Dashboard",
      "admin.logout": "Logout",
      "admin.logoutSuccess": "Logged out successfully",
      "admin.totalInteractions": "Total Interactions",
      "admin.totalFeedback": "Total Feedback",
      "admin.averageRating": "Average Rating",
      "admin.interactions": "Interactions",
      "admin.feedback": "Feedback",
      "admin.recentInteractions": "Recent Interactions",
      "admin.recentFeedback": "Recent Feedback",
      "admin.noInteractions": "No interactions yet",
      "admin.noFeedback": "No feedback yet",
      "admin.loading": "Loading...",
      "admin.fetchError": "Failed to load data",
      
      // Dashboard
      "dashboard.title": "Rare Help Community Insights",
      "dashboard.subtitle": "Together, we grow stronger — one question at a time.",
      "dashboard.totalUsers": "🌍 Total Users",
      "dashboard.totalConversations": "💬 Total Conversations",
      "dashboard.mostSearched": "🩺 Most Searched",
      "dashboard.mostActive": "🌎 Most Active Country",
      "dashboard.avgRating": "📊 Average Rating",
      "dashboard.noData": "N/A",
      "dashboard.communityHighlights": "Community Highlights",
      "dashboard.weeklyTrend": "Most Searched This Week",
      "dashboard.monthlyRating": "Average Rating This Month",
      "dashboard.recentActivity": "Conversations This Week",
      "dashboard.noActivity": "No activity yet",
      "dashboard.noRatings": "No ratings yet",
      "dashboard.generalHealth": "General health queries",
      "dashboard.worldwide": "Worldwide",
      
      // Hero
      "hero.title": "Rare Help",
      "hero.subtitle": "Your Trusted Information Hub for Rare Diseases",
      "hero.description": "Access reliable information, connect with support resources, and get answers to your questions about rare diseases.",
      "hero.cta": "Start Chatting",
      "hero.learn": "Learn More",
      
      // Chatbot
      "chat.title": "Ask Us Anything",
      "chat.subtitle": "Our support assistant is here to help you find information about rare diseases.",
      "chat.placeholder": "Type your question here...",
      "chat.send": "Send",
      "chat.welcome": "Hello! How can I help you today with information about rare diseases?",
      
      // Knowledge Base
      "kb.title": "Knowledge Base",
      "kb.subtitle": "Browse curated articles and resources about rare diseases",
      "kb.search": "Search articles...",
      "kb.readMore": "Read More",
      
      // Feedback
      "feedback.title": "Was this helpful?",
      "feedback.rating": "Rate this response",
      "feedback.comment": "Additional comments (optional)",
      "feedback.submit": "Submit Feedback",
      "feedback.success": "Thank you for your feedback!",
      
      // Accessibility
      "a11y.fontSize": "Font Size",
      "a11y.increase": "Increase",
      "a11y.decrease": "Decrease",
      "a11y.reset": "Reset",
      
      // Metrics Dashboard
      "metrics.title": "Platform Metrics",
      "metrics.totalInteractions": "Total Interactions",
      "metrics.avgRating": "Average Rating",
      "metrics.activeUsers": "Active Users",
      "metrics.satisfaction": "User Satisfaction",
      
      // About
      "about.title": "About Rare Help",
      "about.mission": "Our Mission",
      "about.missionText": "Rare Help is dedicated to providing accessible, reliable information about rare diseases. We aim to empower patients, families, and caregivers with knowledge and support.",
      "about.features": "Platform Features",
      "about.feature1": "24/7 Information Access",
      "about.feature2": "Curated Medical Resources",
      "about.feature3": "Multilingual Support",
      "about.feature4": "Accessible Design",
      
      // Footer
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",
      "footer.contact": "Contact Us",
      "footer.copyright": "© 2025 Rare Help. All rights reserved.",
    }
  },
  pt: {
    translation: {
      // Header
      "language": "Idioma",
      "nav.home": "Início",
      "nav.chat": "Conversa",
      "nav.knowledge": "Base de Conhecimento",
      "nav.about": "Sobre Nós",
      "nav.dashboard": "Painel",
      
      // Admin
      "admin.title": "Login de Administrador",
      "admin.subtitle": "Aceder ao painel de administração",
      "admin.email": "Email",
      "admin.password": "Palavra-passe",
      "admin.login": "Entrar",
      "admin.loggingIn": "A entrar...",
      "admin.backToHome": "Voltar ao Início",
      "admin.loginSuccess": "Login efetuado com sucesso",
      "admin.loginError": "Falha no login. Verifique as suas credenciais.",
      "admin.notAuthorized": "Não está autorizado a aceder a esta página",
      "admin.dashboard": "Painel de Administração",
      "admin.logout": "Sair",
      "admin.logoutSuccess": "Sessão terminada com sucesso",
      "admin.totalInteractions": "Total de Interações",
      "admin.totalFeedback": "Total de Avaliações",
      "admin.averageRating": "Classificação Média",
      "admin.interactions": "Interações",
      "admin.feedback": "Avaliações",
      "admin.recentInteractions": "Interações Recentes",
      "admin.recentFeedback": "Avaliações Recentes",
      "admin.noInteractions": "Ainda sem interações",
      "admin.noFeedback": "Ainda sem avaliações",
      "admin.loading": "A carregar...",
      "admin.fetchError": "Erro ao carregar dados",
      
      // Dashboard
      "dashboard.title": "Visão da Comunidade Rare Help",
      "dashboard.subtitle": "Juntos, crescemos mais fortes — uma pergunta de cada vez.",
      "dashboard.totalUsers": "🌍 Total de Utilizadores",
      "dashboard.totalConversations": "💬 Total de Conversas",
      "dashboard.mostSearched": "🩺 Mais Pesquisado",
      "dashboard.mostActive": "🌎 País Mais Ativo",
      "dashboard.avgRating": "📊 Classificação Média",
      "dashboard.noData": "N/D",
      "dashboard.communityHighlights": "Destaques da Comunidade",
      "dashboard.weeklyTrend": "Mais Pesquisado Esta Semana",
      "dashboard.monthlyRating": "Classificação Média Este Mês",
      "dashboard.recentActivity": "Conversas Esta Semana",
      "dashboard.noActivity": "Ainda sem atividade",
      "dashboard.noRatings": "Ainda sem classificações",
      "dashboard.generalHealth": "Consultas gerais de saúde",
      "dashboard.worldwide": "Global",
      
      // Hero
      "hero.title": "Rare Help",
      "hero.subtitle": "O Seu Centro de Informação de Confiança sobre Doenças Raras",
      "hero.description": "Aceda a informação fidedigna, encontre recursos de apoio e obtenha respostas às suas questões sobre doenças raras.",
      "hero.cta": "Iniciar Conversa",
      "hero.learn": "Saber Mais",
      
      // Chatbot
      "chat.title": "Faça a Sua Questão",
      "chat.subtitle": "O nosso assistente de apoio está disponível para o ajudar a encontrar informação sobre doenças raras.",
      "chat.placeholder": "Escreva a sua questão aqui...",
      "chat.send": "Enviar",
      "chat.welcome": "Olá! Como posso ajudá-lo hoje com informação sobre doenças raras?",
      
      // Knowledge Base
      "kb.title": "Base de Conhecimento",
      "kb.subtitle": "Consulte artigos e recursos selecionados sobre doenças raras",
      "kb.search": "Pesquisar artigos...",
      "kb.readMore": "Ler Mais",
      
      // Feedback
      "feedback.title": "Esta resposta foi útil?",
      "feedback.rating": "Avalie esta resposta",
      "feedback.comment": "Comentários adicionais (opcional)",
      "feedback.submit": "Enviar Avaliação",
      "feedback.success": "Obrigado pela sua avaliação!",
      
      // Accessibility
      "a11y.fontSize": "Tamanho do Texto",
      "a11y.increase": "Aumentar Texto",
      "a11y.decrease": "Diminuir Texto",
      "a11y.reset": "Repor",
      "a11y.increaseFont": "Aumentar Tamanho do Texto",
      "a11y.decreaseFont": "Diminuir Tamanho do Texto",
      
      // Metrics Dashboard
      "metrics.title": "Métricas da Plataforma",
      "metrics.totalInteractions": "Total de Interações",
      "metrics.avgRating": "Classificação Média",
      "metrics.activeUsers": "Utilizadores Ativos",
      "metrics.satisfaction": "Satisfação dos Utilizadores",
      
      // About
      "about.title": "Sobre o Rare Help",
      "about.mission": "A Nossa Missão",
      "about.missionText": "O Rare Help dedica-se a fornecer informação acessível e fidedigna sobre doenças raras. O nosso objetivo é capacitar doentes, famílias e cuidadores com conhecimento e apoio.",
      "about.features": "Funcionalidades da Plataforma",
      "about.feature1": "Acesso à Informação 24/7",
      "about.feature2": "Recursos Médicos Selecionados",
      "about.feature3": "Suporte Multilingue",
      "about.feature4": "Design Acessível",
      
      // Footer
      "footer.privacy": "Política de Privacidade",
      "footer.terms": "Termos de Utilização",
      "footer.contact": "Contacte-nos",
      "footer.copyright": "© 2025 Rare Help. Todos os direitos reservados.",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
