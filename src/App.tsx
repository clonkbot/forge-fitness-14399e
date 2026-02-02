import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import DietTracker from './components/DietTracker';
import WorkoutPrograms from './components/WorkoutPrograms';
import WeightTracker from './components/WeightTracker';
import Navigation from './components/Navigation';
import './styles.css';

export type TabType = 'dashboard' | 'diet' | 'workouts' | 'weight';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'diet':
        return <DietTracker />;
      case 'workouts':
        return <WorkoutPrograms />;
      case 'weight':
        return <WeightTracker />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <header className="app-header">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="logo-icon">///</span>
          <span className="logo-text">FORGE</span>
          <span className="logo-sub">FITNESS</span>
        </motion.div>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="content-wrapper"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <span>Requested by @sniperchief_001 · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
