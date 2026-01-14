import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import KanbanBoard from './components/KanbanBoard';
import DashboardHome from './components/DashboardHome';
import DashboardLayout from './components/DashboardLayout';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import SettingsPage from './components/SettingsPage';
import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Reset auth view when session changes (e.g. login or logout)
      if (session) {
        setShowAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) {
    if (showAuth) {
      return <Auth />; // Ideally Auth should probably handle a "back" to landing, but for now this is fine.
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'board':
        return <KanbanBoard />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default App;
