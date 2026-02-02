import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodEntry {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: string;
}

const initialFoods: FoodEntry[] = [
  { id: 1, name: 'Oatmeal with Honey', calories: 280, protein: 8, carbs: 48, fat: 6, meal: 'Breakfast' },
  { id: 2, name: 'Scrambled Eggs (3)', calories: 210, protein: 18, carbs: 2, fat: 14, meal: 'Breakfast' },
  { id: 3, name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, meal: 'Breakfast' },
  { id: 4, name: 'Grilled Chicken Breast', calories: 280, protein: 52, carbs: 0, fat: 6, meal: 'Lunch' },
  { id: 5, name: 'Mixed Green Salad', calories: 120, protein: 3, carbs: 12, fat: 7, meal: 'Lunch' },
  { id: 6, name: 'Brown Rice', calories: 220, protein: 5, carbs: 45, fat: 2, meal: 'Lunch' },
  { id: 7, name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 8, fat: 6, meal: 'Snack' },
  { id: 8, name: 'Almonds (1oz)', calories: 164, protein: 6, carbs: 6, fat: 14, meal: 'Snack' },
];

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function DietTracker() {
  const [foods, setFoods] = useState<FoodEntry[]>(initialFoods);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const goals = { calories: 2200, protein: 180, carbs: 250, fat: 70 };

  const handleAddFood = () => {
    if (!newFood.name || !newFood.calories) return;

    const entry: FoodEntry = {
      id: Date.now(),
      name: newFood.name,
      calories: parseInt(newFood.calories) || 0,
      protein: parseInt(newFood.protein) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fat: parseInt(newFood.fat) || 0,
      meal: selectedMeal,
    };

    setFoods([...foods, entry]);
    setNewFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowAddModal(false);
  };

  const handleDeleteFood = (id: number) => {
    setFoods(foods.filter(f => f.id !== id));
  };

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
            Diet Tracker
          </h1>
          <p style={{ color: 'var(--steel-300)' }}>Track your daily nutrition intake</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Food
        </button>
      </motion.div>

      {/* Macro Overview */}
      <motion.div className="grid-4" style={{ marginBottom: '2rem' }} variants={itemVariants}>
        {[
          { label: 'Calories', value: totals.calories, goal: goals.calories, unit: 'cal', color: 'var(--neon-lime)' },
          { label: 'Protein', value: totals.protein, goal: goals.protein, unit: 'g', color: '#FF6B6B' },
          { label: 'Carbs', value: totals.carbs, goal: goals.carbs, unit: 'g', color: '#4ECDC4' },
          { label: 'Fat', value: totals.fat, goal: goals.fat, unit: 'g', color: '#FFE66D' },
        ].map((macro, i) => (
          <motion.div
            key={macro.label}
            className="card"
            variants={itemVariants}
            style={{ borderTop: `3px solid ${macro.color}` }}
          >
            <div className="card-subtitle">{macro.label}</div>
            <div style={{ marginTop: '1rem' }}>
              <span className="stat-value" style={{ color: macro.color }}>{macro.value}</span>
              <span className="stat-unit">/ {macro.goal}{macro.unit}</span>
            </div>
            <div className="progress-bar" style={{ marginTop: '1rem' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((macro.value / macro.goal) * 100, 100)}%`,
                  background: macro.color,
                }}
              />
            </div>
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: macro.value > macro.goal ? 'var(--accent-orange)' : 'var(--steel-300)',
            }}>
              {macro.value > macro.goal
                ? `${macro.value - macro.goal}${macro.unit} over`
                : `${macro.goal - macro.value}${macro.unit} remaining`
              }
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Meals Breakdown */}
      <div className="grid-2">
        {mealTypes.map((meal) => {
          const mealFoods = foods.filter(f => f.meal === meal);
          const mealCalories = mealFoods.reduce((sum, f) => sum + f.calories, 0);

          return (
            <motion.div key={meal} className="card" variants={itemVariants}>
              <div className="card-header">
                <div>
                  <div className="card-title">{meal}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--steel-300)' }}>
                    {mealFoods.length} items
                  </div>
                </div>
                <div style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: '1.5rem',
                  color: 'var(--neon-lime)',
                }}>
                  {mealCalories} cal
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <AnimatePresence>
                  {mealFoods.map((food) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{food.name}</div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: 'var(--steel-300)',
                          marginTop: '0.25rem',
                        }}>
                          P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem' }}>
                          {food.calories}
                        </span>
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--steel-400)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '0.25rem',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-orange)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--steel-400)'}
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {mealFoods.length === 0 && (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--steel-400)',
                    border: '1px dashed var(--border-color)',
                  }}>
                    No items logged
                  </div>
                )}
              </div>

              <button
                className="btn-secondary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => {
                  setSelectedMeal(meal);
                  setShowAddModal(true);
                }}
              >
                + Add to {meal}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Add Food Modal */}
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
              style={{ width: '100%', maxWidth: '500px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="card-header">
                <div className="card-title">Add Food</div>
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
                <label className="input-label">Meal</label>
                <select
                  className="input-field"
                  value={selectedMeal}
                  onChange={e => setSelectedMeal(e.target.value)}
                >
                  {mealTypes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Food Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g., Grilled Chicken Breast"
                  value={newFood.name}
                  onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Calories</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="0"
                    value={newFood.calories}
                    onChange={e => setNewFood({ ...newFood, calories: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Protein (g)</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="0"
                    value={newFood.protein}
                    onChange={e => setNewFood({ ...newFood, protein: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Carbs (g)</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="0"
                    value={newFood.carbs}
                    onChange={e => setNewFood({ ...newFood, carbs: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Fat (g)</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="0"
                    value={newFood.fat}
                    onChange={e => setNewFood({ ...newFood, fat: e.target.value })}
                  />
                </div>
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
                  onClick={handleAddFood}
                >
                  Add Food
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
