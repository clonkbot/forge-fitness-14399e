import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeightEntry {
  id: number;
  date: string;
  weight: number;
  note?: string;
}

const generateMockData = (): WeightEntry[] => {
  const data: WeightEntry[] = [];
  const startWeight = 185;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 60);

  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Simulate realistic weight fluctuation with downward trend
    const trend = (i / 60) * 6.6; // Lose ~6.6 lbs over 60 days
    const fluctuation = (Math.random() - 0.5) * 1.5;
    const weight = Math.round((startWeight - trend + fluctuation) * 10) / 10;

    if (Math.random() > 0.3) { // 70% of days logged
      data.push({
        id: i,
        date: date.toISOString().split('T')[0],
        weight,
        note: i === 0 ? 'Starting my journey!' : undefined,
      });
    }
  }

  return data;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function WeightTracker() {
  const [weightData, setWeightData] = useState<WeightEntry[]>(generateMockData());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');
  const [goalWeight, setGoalWeight] = useState(170);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const currentWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : 0;
  const startWeight = weightData.length > 0 ? weightData[0].weight : 0;
  const totalLost = Math.round((startWeight - currentWeight) * 10) / 10;
  const progressPercent = Math.min(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100, 100);

  // Get last 30 days for chart
  const chartData = weightData.slice(-30);
  const maxWeight = Math.max(...chartData.map(d => d.weight));
  const minWeight = Math.min(...chartData.map(d => d.weight));
  const range = maxWeight - minWeight || 5;

  const handleAddWeight = () => {
    if (!newWeight) return;

    const entry: WeightEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
      note: newNote || undefined,
    };

    setWeightData([...weightData, entry]);
    setNewWeight('');
    setNewNote('');
    setShowAddModal(false);
  };

  // Calculate stats
  const lastWeekData = weightData.slice(-7);
  const weeklyChange = lastWeekData.length >= 2
    ? Math.round((lastWeekData[0].weight - lastWeekData[lastWeekData.length - 1].weight) * 10) / 10
    : 0;

  const avgWeight = weightData.length > 0
    ? Math.round((weightData.reduce((sum, d) => sum + d.weight, 0) / weightData.length) * 10) / 10
    : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{
            fontFamily: 'Bebas Neue',
            fontSize: '2.5rem',
            letterSpacing: '0.1em',
            marginBottom: '0.25rem',
          }}>
            Weight Tracker
          </h1>
          <p style={{ color: 'var(--steel-300)' }}>Track your progress towards your goal</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Log Weight
        </button>
      </motion.div>

      {/* Hero Stats */}
      <motion.div className="grid-4" style={{ marginBottom: '2rem' }} variants={itemVariants}>
        <div className="card">
          <div className="card-subtitle">Current Weight</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value">{currentWeight}</span>
            <span className="stat-unit">lbs</span>
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Goal Weight</div>
          <div style={{ marginTop: '1rem', cursor: 'pointer' }} onClick={() => setShowGoalModal(true)}>
            <span className="stat-value" style={{ color: 'var(--text-primary)' }}>{goalWeight}</span>
            <span className="stat-unit">lbs</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neon-lime)', marginTop: '0.5rem' }}>
            {(currentWeight - goalWeight).toFixed(1)} lbs to go
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Total Lost</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value" style={{ color: totalLost > 0 ? 'var(--neon-lime)' : 'var(--accent-orange)' }}>
              {totalLost > 0 ? '-' : '+'}{Math.abs(totalLost)}
            </span>
            <span className="stat-unit">lbs</span>
          </div>
        </div>

        <div className="card">
          <div className="card-subtitle">Weekly Change</div>
          <div style={{ marginTop: '1rem' }}>
            <span className="stat-value" style={{ color: weeklyChange > 0 ? 'var(--neon-lime)' : 'var(--accent-orange)' }}>
              {weeklyChange > 0 ? '-' : '+'}{Math.abs(weeklyChange)}
            </span>
            <span className="stat-unit">lbs</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="card" variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-title">Progress to Goal</div>
          <div style={{
            fontFamily: 'Bebas Neue',
            fontSize: '1.5rem',
            color: 'var(--neon-lime)',
          }}>
            {Math.round(progressPercent)}%
          </div>
        </div>

        <div style={{
          position: 'relative',
          height: '40px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-lime-glow))',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'Bebas Neue',
              fontSize: '1rem',
              color: 'var(--bg-primary)',
            }}>
              {currentWeight} lbs
            </div>
          </motion.div>

          {/* Markers */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0 10px',
            fontSize: '0.8rem',
            color: 'var(--steel-300)',
          }}>
            {startWeight}
          </div>
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0 10px',
            fontSize: '0.8rem',
            color: 'var(--steel-300)',
          }}>
            {goalWeight}
          </div>
        </div>
      </motion.div>

      {/* Weight Chart */}
      <motion.div className="card" variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-title">Last 30 Days</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--steel-300)' }}>
            Avg: {avgWeight} lbs
          </div>
        </div>

        <div style={{
          position: 'relative',
          height: '250px',
          padding: '1rem 0',
        }}>
          {/* Y-axis labels */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingRight: '1rem',
            fontSize: '0.7rem',
            color: 'var(--steel-400)',
          }}>
            <span>{Math.ceil(maxWeight)}</span>
            <span>{Math.round((maxWeight + minWeight) / 2)}</span>
            <span>{Math.floor(minWeight)}</span>
          </div>

          {/* Chart area */}
          <div style={{
            marginLeft: '40px',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            borderLeft: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            paddingLeft: '10px',
            paddingBottom: '20px',
          }}>
            {chartData.map((entry, i) => {
              const heightPercent = ((entry.weight - minWeight + 1) / (range + 2)) * 100;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  style={{
                    flex: 1,
                    minWidth: '8px',
                    background: i === chartData.length - 1
                      ? 'var(--neon-lime)'
                      : 'linear-gradient(180deg, var(--steel-400), var(--steel-500))',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  whileHover={{ background: 'var(--neon-lime)' }}
                  title={`${entry.date}: ${entry.weight} lbs`}
                >
                  {i === chartData.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontFamily: 'Bebas Neue',
                      fontSize: '0.9rem',
                      color: 'var(--neon-lime)',
                      whiteSpace: 'nowrap',
                    }}>
                      {entry.weight}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Goal line */}
          {goalWeight >= minWeight && goalWeight <= maxWeight && (
            <div style={{
              position: 'absolute',
              left: '40px',
              right: 0,
              bottom: `${((goalWeight - minWeight + 1) / (range + 2)) * 100 + 8}%`,
              borderTop: '2px dashed var(--accent-orange)',
            }}>
              <span style={{
                position: 'absolute',
                right: 0,
                top: '-10px',
                fontSize: '0.7rem',
                color: 'var(--accent-orange)',
                background: 'var(--bg-card)',
                padding: '0 0.5rem',
              }}>
                Goal: {goalWeight}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Entries */}
      <motion.div className="card" variants={itemVariants}>
        <div className="card-header">
          <div className="card-title">Recent Entries</div>
          <span className="tag">{weightData.length} total</span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
          {[...weightData].reverse().slice(0, 10).map((entry, i) => {
            const prevEntry = weightData[weightData.indexOf(entry) - 1];
            const change = prevEntry ? entry.weight - prevEntry.weight : 0;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: i === 0 ? 'var(--neon-lime-dim)' : 'var(--bg-secondary)',
                  border: `1px solid ${i === 0 ? 'var(--neon-lime)' : 'var(--border-color)'}`,
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  {entry.note && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--steel-300)',
                      marginTop: '0.25rem',
                    }}>
                      {entry.note}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {change !== 0 && (
                    <span style={{
                      fontSize: '0.8rem',
                      color: change < 0 ? 'var(--neon-lime)' : 'var(--accent-orange)',
                    }}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}
                    </span>
                  )}
                  <span style={{
                    fontFamily: 'Bebas Neue',
                    fontSize: '1.5rem',
                    color: i === 0 ? 'var(--neon-lime)' : 'var(--text-primary)',
                  }}>
                    {entry.weight} lbs
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card"
              style={{ width: '100%', maxWidth: '400px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="card-header">
                <div className="card-title">Log Weight</div>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--steel-300)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">Weight (lbs)</label>
                <input
                  className="input-field"
                  type="number"
                  step="0.1"
                  placeholder={currentWeight.toString()}
                  value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label className="input-label">Note (optional)</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g., After morning workout"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAddWeight}
                >
                  Log Weight
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={() => setShowGoalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card"
              style={{ width: '100%', maxWidth: '400px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="card-header">
                <div className="card-title">Set Goal Weight</div>
                <button
                  onClick={() => setShowGoalModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--steel-300)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">Goal Weight (lbs)</label>
                <input
                  className="input-field"
                  type="number"
                  value={goalWeight}
                  onChange={e => setGoalWeight(parseFloat(e.target.value) || 170)}
                  autoFocus
                />
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => setShowGoalModal(false)}
              >
                Update Goal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
