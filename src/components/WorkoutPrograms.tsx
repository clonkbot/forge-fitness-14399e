import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: string;
  completed?: boolean;
}

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: string;
  exercises: Exercise[];
}

const workoutPrograms: Workout[] = [
  {
    id: 'push',
    name: 'Push Day',
    type: 'Chest, Shoulders, Triceps',
    duration: '60 min',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', weight: '185 lbs', rest: '90s' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '65 lbs', rest: '75s' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', weight: '95 lbs', rest: '90s' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15', weight: '40 lbs', rest: '60s' },
      { name: 'Lateral Raises', sets: 3, reps: '15', weight: '20 lbs', rest: '45s' },
      { name: 'Tricep Pushdowns', sets: 4, reps: '12', weight: '55 lbs', rest: '60s' },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12', weight: '40 lbs', rest: '60s' },
    ],
  },
  {
    id: 'pull',
    name: 'Pull Day',
    type: 'Back, Biceps',
    duration: '55 min',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5', weight: '275 lbs', rest: '120s' },
      { name: 'Pull-ups', sets: 4, reps: '8-10', weight: 'BW', rest: '90s' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', weight: '155 lbs', rest: '90s' },
      { name: 'Face Pulls', sets: 3, reps: '15', weight: '45 lbs', rest: '60s' },
      { name: 'Lat Pulldowns', sets: 3, reps: '12', weight: '130 lbs', rest: '60s' },
      { name: 'Barbell Curls', sets: 4, reps: '10-12', weight: '65 lbs', rest: '60s' },
      { name: 'Hammer Curls', sets: 3, reps: '12', weight: '30 lbs', rest: '45s' },
    ],
  },
  {
    id: 'legs',
    name: 'Leg Day',
    type: 'Quads, Hamstrings, Glutes',
    duration: '65 min',
    exercises: [
      { name: 'Barbell Squats', sets: 5, reps: '5', weight: '225 lbs', rest: '150s' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8-10', weight: '185 lbs', rest: '90s' },
      { name: 'Leg Press', sets: 4, reps: '12', weight: '360 lbs', rest: '90s' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', weight: '50 lbs', rest: '75s' },
      { name: 'Leg Curls', sets: 4, reps: '12', weight: '90 lbs', rest: '60s' },
      { name: 'Leg Extensions', sets: 3, reps: '15', weight: '100 lbs', rest: '60s' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', weight: '180 lbs', rest: '45s' },
    ],
  },
];

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

export default function WorkoutPrograms() {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exerciseStates, setExerciseStates] = useState<Record<string, boolean>>({});
  const [activeWorkout, setActiveWorkout] = useState(false);

  const toggleExercise = (exerciseName: string) => {
    setExerciseStates(prev => ({
      ...prev,
      [exerciseName]: !prev[exerciseName]
    }));
  };

  const completedCount = Object.values(exerciseStates).filter(Boolean).length;
  const totalExercises = selectedWorkout?.exercises.length || 0;

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setActiveWorkout(true);
    setExerciseStates({});
  };

  const finishWorkout = () => {
    setActiveWorkout(false);
    setSelectedWorkout(null);
    setExerciseStates({});
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'Bebas Neue',
          fontSize: '2.5rem',
          letterSpacing: '0.1em',
          marginBottom: '0.25rem',
        }}>
          Workout Programs
        </h1>
        <p style={{ color: 'var(--steel-300)' }}>Push / Pull / Legs Split Program</p>
      </motion.div>

      {/* Workout Schedule */}
      <motion.div className="card" variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <div className="card-title" style={{ marginBottom: '1.5rem' }}>Weekly Schedule</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
        }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const workoutDay = i === 0 || i === 3 ? 'Push' :
                              i === 1 || i === 4 ? 'Pull' :
                              i === 2 || i === 5 ? 'Legs' : 'Rest';
            const isToday = i === new Date().getDay() - 1;
            const isRest = workoutDay === 'Rest';

            return (
              <div
                key={day}
                style={{
                  padding: '1rem 0.5rem',
                  textAlign: 'center',
                  background: isToday ? 'var(--neon-lime-dim)' : 'var(--bg-secondary)',
                  border: `1px solid ${isToday ? 'var(--neon-lime)' : 'var(--border-color)'}`,
                  position: 'relative',
                }}
              >
                <div style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--steel-300)',
                  marginBottom: '0.5rem',
                }}>
                  {day}
                </div>
                <div style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: '1rem',
                  color: isRest ? 'var(--steel-400)' : isToday ? 'var(--neon-lime)' : 'var(--text-primary)',
                }}>
                  {workoutDay}
                </div>
                {isToday && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--neon-lime)',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Active Workout View */}
      <AnimatePresence mode="wait">
        {activeWorkout && selectedWorkout ? (
          <motion.div
            key="active-workout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}>
                <div>
                  <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {selectedWorkout.name}
                    <span className="tag tag-success glow-pulse">Active</span>
                  </div>
                  <div style={{ color: 'var(--steel-300)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {selectedWorkout.type}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Bebas Neue',
                    fontSize: '2rem',
                    color: 'var(--neon-lime)',
                  }}>
                    {completedCount}/{totalExercises}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--steel-300)' }}>
                    Exercises Complete
                  </div>
                </div>
              </div>

              <div className="progress-bar" style={{ marginBottom: '2rem' }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / totalExercises) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedWorkout.exercises.map((exercise, i) => {
                  const isCompleted = exerciseStates[exercise.name];

                  return (
                    <motion.div
                      key={exercise.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleExercise(exercise.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem 1.5rem',
                        background: isCompleted ? 'var(--neon-lime-dim)' : 'var(--bg-secondary)',
                        border: `1px solid ${isCompleted ? 'var(--neon-lime)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isCompleted ? 0.7 : 1,
                      }}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        border: `2px solid ${isCompleted ? 'var(--neon-lime)' : 'var(--steel-400)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isCompleted ? 'var(--neon-lime)' : 'transparent',
                        color: 'var(--bg-primary)',
                        fontWeight: 'bold',
                        flexShrink: 0,
                      }}>
                        {isCompleted && '✓'}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 500,
                          textDecoration: isCompleted ? 'line-through' : 'none',
                        }}>
                          {exercise.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.8rem',
                          color: 'var(--steel-300)',
                          marginTop: '0.25rem',
                        }}>
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          <span>Rest: {exercise.rest}</span>
                        </div>
                      </div>

                      <div style={{
                        fontFamily: 'Bebas Neue',
                        fontSize: '1.25rem',
                        color: isCompleted ? 'var(--neon-lime)' : 'var(--text-primary)',
                      }}>
                        {exercise.weight}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={finishWorkout}>
                  Cancel Workout
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={finishWorkout}
                  disabled={completedCount < totalExercises}
                >
                  {completedCount === totalExercises ? 'Complete Workout!' : `${totalExercises - completedCount} Exercises Left`}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workout-list"
            className="grid-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {workoutPrograms.map((workout, index) => (
              <motion.div
                key={workout.id}
                className="card"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={{ cursor: 'pointer' }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontFamily: 'Bebas Neue',
                  fontSize: '3rem',
                  color: 'var(--steel-500)',
                  lineHeight: 1,
                }}>
                  0{index + 1}
                </div>

                <div className="card-subtitle" style={{ marginBottom: '0.5rem' }}>
                  {workout.type}
                </div>
                <h3 style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: '1.75rem',
                  letterSpacing: '0.05em',
                  marginBottom: '1rem',
                }}>
                  {workout.name}
                </h3>

                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  marginBottom: '1.5rem',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'Bebas Neue',
                      fontSize: '1.5rem',
                      color: 'var(--neon-lime)',
                    }}>
                      {workout.exercises.length}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--steel-300)', textTransform: 'uppercase' }}>
                      Exercises
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Bebas Neue',
                      fontSize: '1.5rem',
                      color: 'var(--text-primary)',
                    }}>
                      {workout.duration}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--steel-300)', textTransform: 'uppercase' }}>
                      Duration
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                }}>
                  {workout.exercises.slice(0, 3).map((ex, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-secondary)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>{ex.name}</span>
                      <span style={{ color: 'var(--steel-300)' }}>{ex.sets}×{ex.reps}</span>
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div style={{
                      textAlign: 'center',
                      color: 'var(--steel-400)',
                      fontSize: '0.8rem',
                      padding: '0.5rem',
                    }}>
                      +{workout.exercises.length - 3} more exercises
                    </div>
                  )}
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => startWorkout(workout)}
                >
                  Start Workout
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
