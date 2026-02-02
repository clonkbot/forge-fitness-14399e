import { motion } from 'framer-motion';
import type { TabType } from '../App';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'diet', label: 'Diet' },
  { id: 'workouts', label: 'Workouts' },
  { id: 'weight', label: 'Weight' },
];

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="nav-container">
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {tab.label}
        </motion.button>
      ))}
    </nav>
  );
}
