import { motion } from 'framer-motion';
import type { TabType } from '../App';

interface DashboardProps {
  onNavigate: (tab: TabType) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Stats */}
      <motion.div className="grid-4" style={{ marginBottom: '2rem' }} variants={itemVariants}>
        <div className="card">
          <div className="card-subtitle">Today's Calories</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value">1,847</span>
            <span className="stat-unit">/ 2,200</span>
          </div>
          <div className="progress-bar" style={{ marginTop: '1rem' }}>
            <div className="progress-fill" style={{ width: '84%' }} />
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Protein Intake</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value">142</span>
            <span className="stat-unit">g</span>
          </div>
          <div className="progress-bar" style={{ marginTop: '1rem' }}>
            <div className="progress-fill" style={{ width: '71%' }} />
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Current Weight</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value">178.4</span>
            <span className="stat-unit">lbs</span>
          </div>
          <div style={{ marginTop: '0.5rem', color: '#BFFF00', fontSize: '0.8rem' }}>
            -2.3 lbs this week
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Workout Streak</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value">12</span>
            <span className="stat-unit">days</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem' }}>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  background: i < 5 ? 'var(--neon-lime)' : 'var(--steel-500)',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Today's Workout */}
        <motion.div className="card" variants={itemVariants}>
          <div className="card-header">
            <div className="card-title">Today's Workout</div>
            <span className="tag tag-success">Push Day</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: 'Bench Press', sets: '4x8', weight: '185 lbs' },
              { name: 'Incline Dumbbell Press', sets: '3x10', weight: '65 lbs' },
              { name: 'Cable Flyes', sets: '3x12', weight: '40 lbs' },
              { name: 'Tricep Pushdowns', sets: '4x12', weight: '55 lbs' },
            ].map((exercise, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{exercise.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--steel-300)' }}>{exercise.sets}</div>
                </div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.25rem', color: 'var(--neon-lime)' }}>
                  {exercise.weight}
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={() => onNavigate('workouts')}
          >
            Start Workout
          </button>
        </motion.div>

        {/* Meal Plan */}
        <motion.div className="card" variants={itemVariants}>
          <div className="card-header">
            <div className="card-title">Today's Meals</div>
            <span className="tag">3/4 logged</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { meal: 'Breakfast', food: 'Oatmeal, eggs, banana', cal: 520, logged: true },
              { meal: 'Lunch', food: 'Grilled chicken salad', cal: 680, logged: true },
              { meal: 'Snack', food: 'Greek yogurt, almonds', cal: 280, logged: true },
              { meal: 'Dinner', food: 'Not logged yet', cal: 0, logged: false },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${item.logged ? 'var(--border-color)' : 'var(--accent-orange)'}`,
                  opacity: item.logged ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--steel-300)',
                    marginBottom: '0.25rem'
                  }}>
                    {item.meal}
                  </div>
                  <div style={{ fontWeight: 500 }}>{item.food}</div>
                </div>
                <div style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: '1.25rem',
                  color: item.logged ? 'var(--text-primary)' : 'var(--accent-orange)'
                }}>
                  {item.logged ? `${item.cal} cal` : '+ Add'}
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn-secondary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={() => onNavigate('diet')}
          >
            View Full Diet Plan
          </button>
        </motion.div>
      </div>

      {/* Progress Chart Preview */}
      <motion.div className="card" variants={itemVariants}>
        <div className="card-header">
          <div className="card-title">Weight Progress</div>
          <button className="btn-secondary" onClick={() => onNavigate('weight')}>
            View Details
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '150px', padding: '1rem 0' }}>
          {[185, 184, 183.5, 182, 181.5, 180, 179.5, 179, 178.5, 178.4].map((weight, i) => {
            const height = ((weight - 175) / 15) * 100;
            return (
              <motion.div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    minHeight: '20px',
                    background: i === 9 ? 'var(--neon-lime)' : 'var(--steel-400)',
                    transition: 'background 0.3s',
                  }}
                />
                <span style={{ fontSize: '0.65rem', color: 'var(--steel-300)' }}>
                  W{i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}>
          <div>
            <div className="stat-label">Starting</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem' }}>185.0 lbs</div>
          </div>
          <div>
            <div className="stat-label">Current</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: 'var(--neon-lime)' }}>178.4 lbs</div>
          </div>
          <div>
            <div className="stat-label">Goal</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem' }}>170.0 lbs</div>
          </div>
          <div>
            <div className="stat-label">Progress</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: 'var(--neon-lime)' }}>44%</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
