import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { EmergencyBanner } from './components/layout/EmergencyBanner';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { HealthRecordsPage } from './pages/HealthRecordsPage';
import { WellnessPage } from './pages/WellnessPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(user ? 'dashboard' : 'landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickChatPrompt, setQuickChatPrompt] = useState<string>('');

  // Automatically transition to dashboard upon login if currently on landing or login
  React.useEffect(() => {
    if (user && (activeTab === 'landing' || activeTab === 'login' || activeTab === 'register')) {
      setActiveTab('dashboard');
    }
  }, [user]);

  // If on landing or auth pages, display without dashboard shell
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setActiveTab('login')}
        onExploreDemo={() => setActiveTab('dashboard')}
      />
    );
  }

  if (activeTab === 'login') {
    return (
      <LoginPage
        onSuccess={() => setActiveTab('dashboard')}
        onSwitchToRegister={() => setActiveTab('register')}
        onBackToHome={() => setActiveTab('landing')}
      />
    );
  }

  if (activeTab === 'register') {
    return (
      <RegisterPage
        onSuccess={() => setActiveTab('dashboard')}
        onSwitchToLogin={() => setActiveTab('login')}
        onBackToHome={() => setActiveTab('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Universal Emergency Top Alert */}
      <EmergencyBanner />

      {/* Primary Navigation Bar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardPage
                setActiveTab={setActiveTab}
                onQuickChatPrompt={(prompt) => {
                  setQuickChatPrompt(prompt);
                }}
              />
            )}

            {activeTab === 'chat' && (
              <ChatbotPage
                initialPrompt={quickChatPrompt}
                onClearInitialPrompt={() => setQuickChatPrompt('')}
              />
            )}

            {activeTab === 'symptoms' && (
              <SymptomCheckerPage
                onFindHealthcare={() => setActiveTab('facilities')}
              />
            )}

            {activeTab === 'facilities' && <FacilitiesPage />}

            {activeTab === 'records' && <HealthRecordsPage />}

            {activeTab === 'wellness' && <WellnessPage />}

            {activeTab === 'appointments' && <AppointmentsPage />}

            {activeTab === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <AppContent />
      </HealthProvider>
    </AuthProvider>
  );
}

export default App;
