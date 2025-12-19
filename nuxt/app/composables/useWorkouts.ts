import { createSharedComposable } from '@vueuse/core'

export interface Exercise {
  name: string
  sets: number
  reps: string
  targetWeight: number
  videoUrl?: string
  instructions?: string
}

export interface ExerciseProgress {
  exerciseName: string
  setNumber: number
  completed: boolean
  actualReps?: number
  actualWeight?: number
}

export interface WorkoutDay {
  name: string
  focus: string
  exercises: Exercise[]
}

export interface WorkoutPlan {
  name: string
  type: 'ppl' | 'upper_lower' | 'full_body' | 'bro_split'
  daysPerWeek: number
  currentWeek: number
  days: WorkoutDay[]
}

export interface WorkoutSession {
  id: string
  date: Date
  dayName: string
  exercises: ExerciseProgress[]
  completed: boolean
  durationMinutes?: number
  notes?: string
}

const _useWorkouts = () => {
  const boringMode = useLocalStorage('workouts-boring-mode', true)

  const currentPlan = useLocalStorage<WorkoutPlan>('workouts-current-plan', {
    name: 'PPL Strength Focus',
    type: 'ppl',
    daysPerWeek: 6,
    currentWeek: 1,
    days: [
      {
        name: 'Push A',
        focus: 'Chest/Shoulders/Triceps',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', targetWeight: 185 },
          { name: 'Overhead Press', sets: 3, reps: '8-10', targetWeight: 115 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', targetWeight: 65 },
          { name: 'Lateral Raises', sets: 3, reps: '12-15', targetWeight: 20 },
          { name: 'Tricep Pushdown', sets: 3, reps: '12-15', targetWeight: 50 }
        ]
      },
      {
        name: 'Pull A',
        focus: 'Back/Biceps',
        exercises: [
          { name: 'Barbell Rows', sets: 4, reps: '6-8', targetWeight: 155 },
          { name: 'Pull-ups', sets: 3, reps: '8-10', targetWeight: 0 },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12', targetWeight: 120 },
          { name: 'Face Pulls', sets: 3, reps: '15-20', targetWeight: 40 },
          { name: 'Barbell Curl', sets: 3, reps: '10-12', targetWeight: 65 }
        ]
      },
      {
        name: 'Legs A',
        focus: 'Quads/Hamstrings/Glutes',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: '6-8', targetWeight: 225 },
          { name: 'Romanian Deadlift', sets: 3, reps: '8-10', targetWeight: 185 },
          { name: 'Leg Press', sets: 3, reps: '10-12', targetWeight: 360 },
          { name: 'Leg Curl', sets: 3, reps: '12-15', targetWeight: 80 },
          { name: 'Standing Calf Raise', sets: 4, reps: '12-15', targetWeight: 180 }
        ]
      },
      {
        name: 'Push B',
        focus: 'Chest/Shoulders/Triceps',
        exercises: [
          { name: 'Overhead Press', sets: 4, reps: '6-8', targetWeight: 115 },
          { name: 'Incline Bench Press', sets: 3, reps: '8-10', targetWeight: 155 },
          { name: 'Cable Fly', sets: 3, reps: '12-15', targetWeight: 30 },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', targetWeight: 55 },
          { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', targetWeight: 45 }
        ]
      },
      {
        name: 'Pull B',
        focus: 'Back/Biceps',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '5', targetWeight: 275 },
          { name: 'Dumbbell Rows', sets: 3, reps: '8-10', targetWeight: 75 },
          { name: 'Cable Rows', sets: 3, reps: '10-12', targetWeight: 140 },
          { name: 'Rear Delt Fly', sets: 3, reps: '15-20', targetWeight: 15 },
          { name: 'Hammer Curls', sets: 3, reps: '10-12', targetWeight: 35 }
        ]
      },
      {
        name: 'Legs B',
        focus: 'Quads/Hamstrings/Glutes',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '6-8', targetWeight: 165 },
          { name: 'Hip Thrust', sets: 3, reps: '10-12', targetWeight: 225 },
          { name: 'Walking Lunges', sets: 3, reps: '12 each', targetWeight: 50 },
          { name: 'Leg Extension', sets: 3, reps: '12-15', targetWeight: 100 },
          { name: 'Seated Calf Raise', sets: 4, reps: '15-20', targetWeight: 90 }
        ]
      }
    ]
  })

  const workoutHistory = useLocalStorage<WorkoutSession[]>('workouts-history', [], {
    serializer: {
      read: (v: string) => {
        const parsed = JSON.parse(v)
        return parsed.map((session: { date: string, dayName: string, exercises: ExerciseProgress[], duration: number, volumeTotal: number }) => ({
          ...session,
          date: new Date(session.date)
        }))
      },
      write: (v: WorkoutSession[]) => JSON.stringify(v)
    }
  })

  const currentSession = ref<WorkoutSession | null>(null)

  // Start a new workout session
  const startWorkout = (dayIndex: number) => {
    const day = currentPlan.value.days[dayIndex]
    if (!day) return

    const exercises: ExerciseProgress[] = []
    day.exercises.forEach((exercise) => {
      for (let i = 0; i < exercise.sets; i++) {
        exercises.push({
          exerciseName: exercise.name,
          setNumber: i + 1,
          completed: false
        })
      }
    })

    currentSession.value = {
      id: `session-${Date.now()}`,
      date: new Date(),
      dayName: day.name,
      exercises,
      completed: false
    }
  }

  // Complete a set
  const completeSet = (exerciseName: string, setNumber: number, reps: number, weight: number) => {
    if (!currentSession.value) return

    const exercise = currentSession.value.exercises.find(
      e => e.exerciseName === exerciseName && e.setNumber === setNumber
    )

    if (exercise) {
      exercise.completed = true
      exercise.actualReps = reps
      exercise.actualWeight = weight
    }
  }

  // End workout session
  const endWorkout = (notes?: string) => {
    if (!currentSession.value) return

    currentSession.value.completed = true
    currentSession.value.notes = notes

    workoutHistory.value.push(currentSession.value)
    workoutHistory.value.sort((a, b) => b.date.getTime() - a.date.getTime())

    currentSession.value = null
  }

  // Cancel workout session
  const cancelWorkout = () => {
    currentSession.value = null
  }

  // Get progress for a specific exercise
  const getExerciseProgress = (exerciseName: string) => {
    const sessions = workoutHistory.value.filter(session =>
      session.exercises.some(e => e.exerciseName === exerciseName && e.completed)
    )

    return sessions.map((session) => {
      const exerciseSets = session.exercises.filter(
        e => e.exerciseName === exerciseName && e.completed
      )

      const maxWeight = Math.max(...exerciseSets.map(e => e.actualWeight || 0))
      const totalReps = exerciseSets.reduce((sum, e) => sum + (e.actualReps || 0), 0)

      return {
        date: session.date,
        maxWeight,
        totalReps,
        sets: exerciseSets.length
      }
    })
  }

  // Get workout stats
  const workoutStats = computed(() => {
    const total = workoutHistory.value.length
    const thisWeek = workoutHistory.value.filter((session) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return session.date >= weekAgo
    }).length

    const thisMonth = workoutHistory.value.filter((session) => {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return session.date >= monthAgo
    }).length

    return {
      total,
      thisWeek,
      thisMonth
    }
  })

  // Update exercise target weight
  const updateExerciseTarget = (dayIndex: number, exerciseIndex: number, updates: Partial<Exercise>) => {
    const day = currentPlan.value.days[dayIndex]
    if (!day) return

    const exercise = day.exercises[exerciseIndex]
    if (!exercise) return

    Object.assign(exercise, updates)
  }

  // Add new exercise to a workout day
  const addExercise = (dayIndex: number, exercise: Exercise) => {
    const day = currentPlan.value.days[dayIndex]
    if (!day) return

    day.exercises.push(exercise)
  }

  // Remove exercise from a workout day
  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const day = currentPlan.value.days[dayIndex]
    if (!day) return

    day.exercises.splice(exerciseIndex, 1)
  }

  // Create a new workout plan based on split type
  const createWorkoutPlan = (splitType: 'ppl' | 'upper_lower' | 'full_body' | 'bro_split') => {
    const { exercises } = useExerciseData()

    const planTemplates = {
      ppl: {
        name: 'Push/Pull/Legs',
        daysPerWeek: 6,
        days: [
          {
            name: 'Push A',
            focus: 'Chest/Shoulders/Triceps',
            muscles: ['chest', 'shoulders', 'triceps']
          },
          {
            name: 'Pull A',
            focus: 'Back/Biceps',
            muscles: ['back', 'biceps']
          },
          {
            name: 'Legs A',
            focus: 'Quads/Hamstrings/Glutes',
            muscles: ['quads', 'hamstrings', 'glutes', 'calves']
          },
          {
            name: 'Push B',
            focus: 'Chest/Shoulders/Triceps',
            muscles: ['chest', 'shoulders', 'triceps']
          },
          {
            name: 'Pull B',
            focus: 'Back/Biceps',
            muscles: ['back', 'biceps']
          },
          {
            name: 'Legs B',
            focus: 'Quads/Hamstrings/Glutes',
            muscles: ['quads', 'hamstrings', 'glutes', 'calves']
          }
        ]
      },
      upper_lower: {
        name: 'Upper/Lower Split',
        daysPerWeek: 4,
        days: [
          {
            name: 'Upper A',
            focus: 'Push Focus',
            muscles: ['chest', 'shoulders', 'triceps', 'back', 'biceps']
          },
          {
            name: 'Lower A',
            focus: 'Squat Focus',
            muscles: ['quads', 'hamstrings', 'glutes', 'calves']
          },
          {
            name: 'Upper B',
            focus: 'Pull Focus',
            muscles: ['back', 'biceps', 'chest', 'shoulders', 'triceps']
          },
          {
            name: 'Lower B',
            focus: 'Deadlift Focus',
            muscles: ['hamstrings', 'glutes', 'quads', 'calves']
          }
        ]
      },
      full_body: {
        name: 'Full Body Training',
        daysPerWeek: 3,
        days: [
          {
            name: 'Full Body A',
            focus: 'Squat Focus',
            muscles: ['quads', 'chest', 'back', 'shoulders', 'hamstrings', 'biceps', 'triceps']
          },
          {
            name: 'Full Body B',
            focus: 'Deadlift Focus',
            muscles: ['hamstrings', 'chest', 'back', 'shoulders', 'quads', 'biceps', 'triceps']
          },
          {
            name: 'Full Body C',
            focus: 'Press Focus',
            muscles: ['shoulders', 'chest', 'quads', 'back', 'triceps', 'hamstrings', 'biceps']
          }
        ]
      },
      bro_split: {
        name: 'Bro Split',
        daysPerWeek: 5,
        days: [
          {
            name: 'Chest Day',
            focus: 'Chest',
            muscles: ['chest', 'triceps']
          },
          {
            name: 'Back Day',
            focus: 'Back',
            muscles: ['back', 'biceps']
          },
          {
            name: 'Shoulder Day',
            focus: 'Shoulders',
            muscles: ['shoulders', 'triceps']
          },
          {
            name: 'Leg Day',
            focus: 'Legs',
            muscles: ['quads', 'hamstrings', 'glutes', 'calves']
          },
          {
            name: 'Arms Day',
            focus: 'Arms',
            muscles: ['biceps', 'triceps']
          }
        ]
      }
    }

    const template = planTemplates[splitType]
    const days: WorkoutDay[] = []

    template.days.forEach((dayTemplate, dayIndex) => {
      const dayExercises: Exercise[] = []
      const isADay = dayTemplate.name.includes('A') || dayIndex === 0 || dayIndex === 2

      dayTemplate.muscles.forEach((muscle, muscleIndex) => {
        // Get exercises for this muscle
        const muscleExercises = exercises.filter(ex => ex.primaryMuscle === muscle)

        // Sort by effectiveness rank
        const sortedExercises = muscleExercises.sort((a, b) => b.effectivenessRank - a.effectivenessRank)

        // For first muscle group, pick top exercise
        // For secondary muscles, pick 2nd or 3rd best to add variety
        let selectedExercise
        if (muscleIndex === 0) {
          // Primary muscle - use best exercise
          selectedExercise = isADay ? sortedExercises[0] : sortedExercises[1] || sortedExercises[0]
        } else if (muscleIndex === 1 && dayTemplate.muscles.length <= 3) {
          // Secondary muscle in focused split - use good exercise
          selectedExercise = isADay ? sortedExercises[1] || sortedExercises[0] : sortedExercises[2] || sortedExercises[0]
        } else {
          // Tertiary muscle or full body - use any effective exercise
          const offset = dayIndex % Math.min(3, sortedExercises.length)
          selectedExercise = sortedExercises[offset] || sortedExercises[0]
        }

        if (selectedExercise) {
          // Determine sets and reps based on exercise type and position
          let sets = 3
          let reps = '8-10'
          let targetWeight = 100

          if (muscleIndex === 0) {
            // Compound movements for primary muscle
            sets = 4
            reps = selectedExercise.effectivenessRank === 5 ? '6-8' : '8-10'
            targetWeight = 135
          } else if (muscleIndex === 1) {
            sets = 3
            reps = '8-12'
            targetWeight = 95
          } else {
            // Accessory work
            sets = 3
            reps = '12-15'
            targetWeight = 50
          }

          // Adjust for bodyweight exercises
          if (selectedExercise.equipment === 'bodyweight') {
            targetWeight = 0
          }

          dayExercises.push({
            name: selectedExercise.name,
            sets,
            reps,
            targetWeight,
            videoUrl: selectedExercise.youtubeId ? `https://youtube.com/watch?v=${selectedExercise.youtubeId}` : undefined,
            instructions: selectedExercise.instructions
          })
        }
      })

      days.push({
        name: dayTemplate.name,
        focus: dayTemplate.focus,
        exercises: dayExercises
      })
    })

    currentPlan.value = {
      name: template.name,
      type: splitType,
      daysPerWeek: template.daysPerWeek,
      currentWeek: 1,
      days
    }
  }

  return {
    // State
    boringMode,
    currentPlan,
    workoutHistory,
    currentSession,

    // Computed
    workoutStats,

    // Functions
    startWorkout,
    completeSet,
    endWorkout,
    cancelWorkout,
    getExerciseProgress,
    updateExerciseTarget,
    addExercise,
    removeExercise,
    createWorkoutPlan
  }
}

export const useWorkouts = createSharedComposable(_useWorkouts)
