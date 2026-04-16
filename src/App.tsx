import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Onboarding } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { LiveAlert } from './screens/LiveAlert';
import { IncidentLogScreen } from './screens/IncidentLogScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { useShieldStore } from './store/useShieldStore';

function App() {
  const { onboardingComplete, darkMode } = useShieldStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alert" element={<LiveAlert />} />
        <Route path="/log" element={<IncidentLogScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function AppWrapper() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

export default AppWrapper;
