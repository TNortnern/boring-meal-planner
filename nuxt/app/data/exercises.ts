export interface Exercise {
  id: number
  name: string
  primaryMuscle: string
  secondaryMuscles: string[]
  equipment: string
  jointFriendly: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructions: string
  tips: string
  youtubeId: string
  effectivenessRank: number // 1-5, 5 being most effective for muscle growth
}

export const exercises: Exercise[] = [
  // CHEST EXERCISES
  {
    id: 1,
    name: 'Barbell Bench Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Lie on bench with feet flat on floor. Grip bar slightly wider than shoulders. Unrack and lower bar to mid-chest with elbows at 45 degrees. Press back up to starting position.',
    tips: 'Keep feet flat, maintain arch, squeeze shoulder blades together. Touch chest gently, don\'t bounce.',
    youtubeId: 'gRVjAtPip0Y', // Jeff Nippard - Bench Press
    effectivenessRank: 5
  },
  {
    id: 2,
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Set bench to 30-45 degree incline. Press dumbbells up and slightly together. Lower with control to chest level.',
    tips: 'Don\'t go too steep (targets shoulders more). Keep wrists straight. Control the negative.',
    youtubeId: 'SrqOu55lrYU', // Jeff Nippard - Incline Press
    effectivenessRank: 5
  },
  {
    id: 3,
    name: 'Dips (Chest)',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Lean forward 30-45 degrees. Lower body until shoulders are level with elbows. Push back up.',
    tips: 'Lean forward to target chest. Use assisted machine if needed. Don\'t go too deep if shoulders hurt.',
    youtubeId: 'yN6Q1UI_xkE', // AthleanX - Dips
    effectivenessRank: 5
  },
  {
    id: 4,
    name: 'Cable Fly',
    primaryMuscle: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Set cables at shoulder height. Step forward, bring hands together in an arc motion. Squeeze at peak.',
    tips: 'Maintain slight elbow bend. Focus on chest squeeze. Control the eccentric.',
    youtubeId: 'Z66epMHO4Vw', // Renaissance Periodization - Cable Fly
    effectivenessRank: 3
  },
  {
    id: 5,
    name: 'Push-ups',
    primaryMuscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Hands slightly wider than shoulders. Lower chest to ground. Push back up maintaining straight body.',
    tips: 'Keep core tight. Full range of motion. Add weight for progression.',
    youtubeId: 'IODxDxX7oi4', // Calisthenicmovement - Push-ups
    effectivenessRank: 4
  },
  {
    id: 6,
    name: 'Pec Deck Machine',
    primaryMuscle: 'chest',
    secondaryMuscles: [],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Sit with back against pad. Arms at shoulder height. Bring handles together in front of chest.',
    tips: 'Focus on chest squeeze. Don\'t let shoulders round forward. Slow eccentric.',
    youtubeId: '3F3VGdn9iMU', // Renaissance Periodization - Pec Deck
    effectivenessRank: 3
  },

  // BACK EXERCISES
  {
    id: 7,
    name: 'Deadlift',
    primaryMuscle: 'back',
    secondaryMuscles: ['hamstrings', 'glutes', 'core'],
    equipment: 'barbell',
    jointFriendly: false,
    difficulty: 'advanced',
    instructions: 'Feet hip-width, bar over mid-foot. Hinge at hips, grip bar, keep back neutral. Drive through floor, extend hips.',
    tips: 'Keep bar close to body. Brace core hard. Full lockout at top.',
    youtubeId: 'op9kVnSso6Q', // Jeff Nippard - Deadlift
    effectivenessRank: 5
  },
  {
    id: 8,
    name: 'Pull-ups',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Hang from bar with overhand grip. Pull chest to bar. Lower with control to full extension.',
    tips: 'Engage lats first. Avoid swinging. Full range of motion. Use band if needed.',
    youtubeId: 'eGo4IYlbE5g', // AthleanX - Pull-ups
    effectivenessRank: 5
  },
  {
    id: 9,
    name: 'Barbell Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps', 'core'],
    equipment: 'barbell',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Hinge forward 45 degrees. Pull bar to lower chest/upper abs. Squeeze shoulder blades.',
    tips: 'Keep lower back neutral. Lead with elbows. Don\'t use excessive momentum.',
    youtubeId: 'FWJR5Ve8bnQ', // Jeff Nippard - Barbell Row
    effectivenessRank: 5
  },
  {
    id: 10,
    name: 'Lat Pulldown',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Grip bar wider than shoulders. Pull to upper chest while leaning back slightly. Control the return.',
    tips: 'Drive elbows down and back. Squeeze lats at bottom. Don\'t pull behind neck.',
    youtubeId: 'CAwf7n6Luuc', // Renaissance Periodization - Lat Pulldown
    effectivenessRank: 4
  },
  {
    id: 11,
    name: 'Dumbbell Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'One hand on bench for support. Row dumbbell to hip. Squeeze at top. Lower slowly.',
    tips: 'Keep elbow close to body. Initiate with back not biceps. Full stretch at bottom.',
    youtubeId: 'roCP6wCXPqo', // AthleanX - Dumbbell Row
    effectivenessRank: 4
  },
  {
    id: 12,
    name: 'Seated Cable Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Sit upright, pull handle to lower chest. Keep elbows close. Squeeze shoulder blades together.',
    tips: 'Maintain neutral spine. Don\'t lean back excessively. Control the eccentric.',
    youtubeId: 'GZbfZ033f74', // Renaissance Periodization - Cable Row
    effectivenessRank: 4
  },
  {
    id: 13,
    name: 'Face Pulls',
    primaryMuscle: 'back',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Set cable to face height. Pull rope to forehead, separating ends. Rotate externally at shoulders.',
    tips: 'High reps (15-20). Focus on rear delts and upper back. Essential for shoulder health.',
    youtubeId: 'rep-qVOkqgk', // Jeff Nippard - Face Pulls
    effectivenessRank: 4
  },
  {
    id: 14,
    name: 'T-Bar Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Straddle bar, hinge forward. Pull bar to chest. Control the descent.',
    tips: 'Keep chest up. Full range of motion. Great for thickness.',
    youtubeId: 'j3Igk5nyZE4', // Renaissance Periodization - T-Bar Row
    effectivenessRank: 4
  },

  // SHOULDERS
  {
    id: 15,
    name: 'Overhead Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'barbell',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Bar at shoulders, press overhead. Full lockout. Lower with control.',
    tips: 'Brace core. Avoid excessive back arch. Full lockout overhead.',
    youtubeId: '2yjwXTZQDDI', // Jeff Nippard - Overhead Press
    effectivenessRank: 5
  },
  {
    id: 16,
    name: 'Dumbbell Shoulder Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Dumbbells at shoulders. Press overhead in natural arc. Lower with control.',
    tips: 'Natural arc path. Full lockout. Can do seated or standing.',
    youtubeId: 'qEwKCR5JCog', // AthleanX - Dumbbell Press
    effectivenessRank: 5
  },
  {
    id: 17,
    name: 'Lateral Raises',
    primaryMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Arms at sides. Raise dumbbells to shoulder height. Lower slowly.',
    tips: 'Slight bend in elbows. Don\'t swing. Lead with elbows not hands.',
    youtubeId: '3VcKaXpzqRo', // Jeff Nippard - Lateral Raises
    effectivenessRank: 4
  },
  {
    id: 18,
    name: 'Arnold Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Start with palms facing you. Press up while rotating palms forward. Reverse on descent.',
    tips: 'Smooth rotation. Full range. Great for all three deltoid heads.',
    youtubeId: 'ScBJTXg0dhU', // Bodybuilding.com - Arnold Press
    effectivenessRank: 4
  },
  {
    id: 19,
    name: 'Rear Delt Fly',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Bend forward 90 degrees. Raise dumbbells out to sides. Squeeze rear delts.',
    tips: 'Keep slight bend in elbows. Focus on rear delts. Essential for balanced shoulders.',
    youtubeId: 'ttvfGg9d76c', // Jeff Nippard - Rear Delts
    effectivenessRank: 4
  },
  {
    id: 20,
    name: 'Cable Lateral Raise',
    primaryMuscle: 'shoulders',
    secondaryMuscles: [],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Stand sideways to cable. Pull handle up and across body to shoulder height.',
    tips: 'Constant tension through ROM. Control the negative. Builds side delts.',
    youtubeId: 'PPrzBWZDOhA', // Renaissance Periodization - Cable Laterals
    effectivenessRank: 4
  },

  // LEGS - QUADS
  {
    id: 21,
    name: 'Barbell Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Bar on upper back. Feet shoulder width. Squat down. Drive up through heels.',
    tips: 'Keep chest up. Knees track over toes. Hit parallel or below.',
    youtubeId: 'ultWZbUMPL8', // Jeff Nippard - Squat
    effectivenessRank: 5
  },
  {
    id: 22,
    name: 'Front Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: ['core', 'glutes'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'advanced',
    instructions: 'Bar on front delts. Elbows high. Squat maintaining upright torso. Drive up.',
    tips: 'Very upright torso. Great for quad emphasis. Easier on lower back.',
    youtubeId: 'zoZWgTrZLd8', // Squat University - Front Squat
    effectivenessRank: 5
  },
  {
    id: 23,
    name: 'Leg Press',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Feet shoulder width on platform. Lower weight with control. Press through heels.',
    tips: 'Don\'t lock knees. Control the negative. Full range of motion.',
    youtubeId: 'IZxyjW7MPJQ', // Renaissance Periodization - Leg Press
    effectivenessRank: 4
  },
  {
    id: 24,
    name: 'Bulgarian Split Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Rear foot elevated on bench. Lower front leg until knee almost touches ground. Drive up.',
    tips: 'Torso upright. Front foot far enough forward. Great unilateral exercise.',
    youtubeId: 'NNNVb7ZCFEM', // Jeff Nippard - Bulgarian Split Squat
    effectivenessRank: 5
  },
  {
    id: 25,
    name: 'Leg Extension',
    primaryMuscle: 'quads',
    secondaryMuscles: [],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Sit with knees aligned to machine pivot. Extend legs fully. Lower with control.',
    tips: 'Full contraction at top. Point toes up. Great for quad isolation.',
    youtubeId: '8VC3y9wZPg0', // Renaissance Periodization - Leg Extension
    effectivenessRank: 3
  },
  {
    id: 26,
    name: 'Hack Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes'],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Back against pad, feet on platform. Squat down. Drive up through platform.',
    tips: 'Great quad emphasis. Easier to maintain form. Can load heavy.',
    youtubeId: 'EdtaJRBqwes', // Renaissance Periodization - Hack Squat
    effectivenessRank: 4
  },

  // LEGS - HAMSTRINGS
  {
    id: 27,
    name: 'Romanian Deadlift',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Hold bar at hips. Hinge forward with slight knee bend. Feel stretch in hamstrings. Drive hips forward.',
    tips: 'Keep bar close to body. Neutral spine. Squeeze glutes at top.',
    youtubeId: 'JCXUYuzwNrM', // Jeff Nippard - RDL
    effectivenessRank: 5
  },
  {
    id: 28,
    name: 'Leg Curl',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: [],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Lie face down. Curl heels toward glutes. Squeeze at top. Lower slowly.',
    tips: 'Don\'t lift hips. Slow controlled movement. Full contraction at top.',
    youtubeId: 'WBTT3RKbROc', // Renaissance Periodization - Leg Curl
    effectivenessRank: 3
  },
  {
    id: 29,
    name: 'Good Mornings',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Bar on upper back. Hinge forward maintaining neutral spine. Feel hamstring stretch. Return to upright.',
    tips: 'Light weight. Controlled tempo. Great hamstring and glute builder.',
    youtubeId: 'YA-h3n9L4YU', // Alan Thrall - Good Mornings
    effectivenessRank: 4
  },
  {
    id: 30,
    name: 'Nordic Curl',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'advanced',
    instructions: 'Kneel with ankles secured. Lower body forward with control. Push back up using hamstrings.',
    tips: 'Very advanced. Use band assistance if needed. Elite hamstring developer.',
    youtubeId: 'PNmoSkwHSzs', // Squat University - Nordic Curl
    effectivenessRank: 5
  },

  // LEGS - GLUTES
  {
    id: 31,
    name: 'Hip Thrust',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Upper back on bench, bar on hips. Drive hips up. Squeeze glutes at top. Lower with control.',
    tips: 'Tuck chin. Posterior pelvic tilt at top. Pause at peak contraction.',
    youtubeId: 'xDmFkJxPzeM', // Bret Contreras - Hip Thrust
    effectivenessRank: 5
  },
  {
    id: 32,
    name: 'Glute Bridge',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Lie on floor, bar over hips. Drive hips up. Squeeze glutes hard. Lower to floor.',
    tips: 'Great for beginners. Can use heavy weight. Perfect mind-muscle connection.',
    youtubeId: 'wfz1sbPZHU0', // Squat University - Glute Bridge
    effectivenessRank: 4
  },
  {
    id: 33,
    name: 'Walking Lunges',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['quads', 'hamstrings'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Step forward into lunge. Back knee almost touches ground. Drive up and step forward with other leg.',
    tips: 'Upright torso. Long stride for glute emphasis. Control the descent.',
    youtubeId: '0-VdsMTthp8', // ScottHermanFitness - Lunges
    effectivenessRank: 4
  },
  {
    id: 34,
    name: 'Cable Pull-Through',
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Face away from cable, rope between legs. Hinge forward. Drive hips forward explosively.',
    tips: 'Great for learning hip hinge. Feel stretch in glutes. Explosive hip drive.',
    youtubeId: 'mYbdXPx-6Ws', // Bret Contreras - Pull-Through
    effectivenessRank: 4
  },

  // LEGS - CALVES
  {
    id: 35,
    name: 'Standing Calf Raise',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Stand on platform, toes on edge. Raise heels as high as possible. Lower with stretch.',
    tips: 'Full range of motion. Pause at top. Slow negative. High reps effective.',
    youtubeId: 'YfNDc7WKqJo', // Renaissance Periodization - Calves
    effectivenessRank: 3
  },
  {
    id: 36,
    name: 'Seated Calf Raise',
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Sit with weight on knees. Raise heels high. Lower with full stretch.',
    tips: 'Targets soleus (bent knee calf muscle). High reps. Full ROM.',
    youtubeId: 'JbyjNymZOt0', // Renaissance Periodization - Seated Calf
    effectivenessRank: 3
  },

  // ARMS - BICEPS
  {
    id: 37,
    name: 'Barbell Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Grip bar shoulder width. Curl to shoulders keeping elbows stationary. Lower with control.',
    tips: 'Don\'t swing. Full contraction at top. Control the eccentric.',
    youtubeId: 'kwG2ipFRgfo', // Jeff Nippard - Barbell Curl
    effectivenessRank: 4
  },
  {
    id: 38,
    name: 'Hammer Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Neutral grip (palms facing each other). Curl up. Lower slowly.',
    tips: 'Targets brachialis and brachioradialis. Great for arm thickness.',
    youtubeId: 'TwD-YGVP4Bk', // AthleanX - Hammer Curl
    effectivenessRank: 4
  },
  {
    id: 39,
    name: 'Incline Dumbbell Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Sit on incline bench. Let arms hang. Curl up with supination. Lower to full stretch.',
    tips: 'Great stretch on biceps long head. Don\'t let elbows drift forward.',
    youtubeId: 'soxrZlIl35U', // Jeff Nippard - Incline Curl
    effectivenessRank: 5
  },
  {
    id: 40,
    name: 'Preacher Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Arms on preacher pad. Curl bar up. Lower to full extension.',
    tips: 'Prevents cheating. Great peak contraction. Don\'t hyperextend elbows.',
    youtubeId: 'fIWP-FRFNU0', // Bodybuilding.com - Preacher Curl
    effectivenessRank: 4
  },
  {
    id: 41,
    name: 'Cable Curl',
    primaryMuscle: 'biceps',
    secondaryMuscles: [],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Attach straight bar or rope to low cable. Curl up. Control the descent.',
    tips: 'Constant tension. Great pump. Can do high reps.',
    youtubeId: 'wJy_R6o8ZfA', // Renaissance Periodization - Cable Curl
    effectivenessRank: 3
  },

  // ARMS - TRICEPS
  {
    id: 42,
    name: 'Close Grip Bench Press',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Grip bar shoulder width or slightly narrower. Lower to lower chest. Press up.',
    tips: 'Best mass builder for triceps. Keep elbows closer to body.',
    youtubeId: 'nEF0bv2FW94', // Jeff Nippard - Close Grip Bench
    effectivenessRank: 5
  },
  {
    id: 43,
    name: 'Tricep Pushdown',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Grip rope or bar. Keep elbows pinned to sides. Push down until arms straight. Squeeze triceps.',
    tips: 'Don\'t let elbows flare. Full extension. Control the return.',
    youtubeId: 'yJJBzn-0e8c', // Jeff Nippard - Pushdowns
    effectivenessRank: 4
  },
  {
    id: 44,
    name: 'Overhead Tricep Extension',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Hold dumbbell overhead. Lower behind head. Extend back up.',
    tips: 'Great long head stretch. Keep elbows pointing up. Full stretch at bottom.',
    youtubeId: 'YbX7Wd8jQ-Q', // AthleanX - Overhead Extension
    effectivenessRank: 4
  },
  {
    id: 45,
    name: 'Skull Crushers',
    primaryMuscle: 'triceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Lie on bench. Lower bar to forehead or behind head. Extend back up.',
    tips: 'Keep elbows in. Can be hard on elbows. Great mass builder.',
    youtubeId: 'QR8fT0gg3I8', // Jeff Nippard - Skull Crushers
    effectivenessRank: 4
  },
  {
    id: 46,
    name: 'Diamond Push-ups',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest'],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Hands together forming diamond shape. Lower chest to hands. Push up.',
    tips: 'Great tricep emphasis. Can elevate feet for difficulty.',
    youtubeId: 'J0DnG1_S92I', // Calisthenicmovement - Diamond Push-ups
    effectivenessRank: 4
  },
  {
    id: 47,
    name: 'Dips (Triceps)',
    primaryMuscle: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'bodyweight',
    jointFriendly: false,
    difficulty: 'intermediate',
    instructions: 'Stay more upright. Lower until 90 degree elbow angle. Push back up.',
    tips: 'More upright = more triceps. Can add weight with belt.',
    youtubeId: 'yN6Q1UI_xkE', // AthleanX - Dips
    effectivenessRank: 5
  },

  // CORE
  {
    id: 48,
    name: 'Plank',
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Forearms on ground. Body in straight line from head to heels. Hold position.',
    tips: 'Don\'t let hips sag. Squeeze glutes. Breathe normally. Build up time.',
    youtubeId: 'ASdvN_XEl_c', // Calisthenicmovement - Plank
    effectivenessRank: 4
  },
  {
    id: 49,
    name: 'Cable Crunch',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Hold rope behind head. Kneel. Crunch down bringing elbows to knees.',
    tips: 'Round spine. Focus on abs not hip flexors. Can add weight easily.',
    youtubeId: 'sP_6dL7GiQo', // Renaissance Periodization - Cable Crunch
    effectivenessRank: 4
  },
  {
    id: 50,
    name: 'Hanging Leg Raise',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Hang from bar. Raise legs to horizontal or higher. Lower with control.',
    tips: 'Bend knees to make easier. Focus on lower abs. Don\'t swing.',
    youtubeId: 'Pr1ieGZ5atk', // AthleanX - Leg Raises
    effectivenessRank: 5
  },
  {
    id: 51,
    name: 'Russian Twists',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Sit with feet elevated. Hold weight. Rotate torso side to side.',
    tips: 'Control the movement. Good for obliques. Keep core tight.',
    youtubeId: 'wkD8rjkodUI', // Calisthenicmovement - Russian Twist
    effectivenessRank: 3
  },
  {
    id: 52,
    name: 'Ab Wheel Rollout',
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'advanced',
    instructions: 'Knees on ground, hands on wheel. Roll forward extending body. Pull back to start.',
    tips: 'Advanced exercise. Start from knees. Don\'t let back sag.',
    youtubeId: 'EwjFNT-qFJI', // AthleanX - Ab Wheel
    effectivenessRank: 5
  },
  {
    id: 53,
    name: 'Pallof Press',
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Stand sideways to cable at chest height. Press out and resist rotation. Return.',
    tips: 'Anti-rotation exercise. Great for core stability. Keep hips square.',
    youtubeId: 'AH_QZLm_0-s', // Squat University - Pallof Press
    effectivenessRank: 4
  },

  // ADDITIONAL VARIATIONS
  {
    id: 54,
    name: 'Chin-ups',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'bodyweight',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Underhand grip. Pull chin over bar. Lower with control.',
    tips: 'More bicep involvement than pull-ups. Great back builder.',
    youtubeId: 'brhXjNDdtyc', // Calisthenicmovement - Chin-ups
    effectivenessRank: 5
  },
  {
    id: 55,
    name: 'Landmine Press',
    primaryMuscle: 'shoulders',
    secondaryMuscles: ['core'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Hold end of barbell at shoulder. Press up in arc motion.',
    tips: 'Very shoulder-friendly. Can do single arm. Great for athletes.',
    youtubeId: 'kUO1tRHSA7w', // Squat University - Landmine Press
    effectivenessRank: 4
  },
  {
    id: 56,
    name: 'Goblet Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'core'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Hold dumbbell at chest. Squat down keeping torso upright. Drive up.',
    tips: 'Great for learning squat pattern. Very upright torso. Beginner-friendly.',
    youtubeId: 'MeIiIdhvXT4', // Squat University - Goblet Squat
    effectivenessRank: 4
  },
  {
    id: 57,
    name: 'Pendlay Row',
    primaryMuscle: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'barbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Torso parallel to ground. Explosively row bar to chest. Return to floor each rep.',
    tips: 'Reset each rep. Build explosive power. Great for upper back thickness.',
    youtubeId: 'h4nkoayP7Cs', // Alan Thrall - Pendlay Row
    effectivenessRank: 4
  },
  {
    id: 58,
    name: 'Sissy Squat',
    primaryMuscle: 'quads',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    jointFriendly: false,
    difficulty: 'advanced',
    instructions: 'Lean back while bending knees. Lower body keeping hips extended. Return to start.',
    tips: 'Advanced quad isolation. Can be hard on knees. Great for quad development.',
    youtubeId: 'lKH7tMM3KDY', // Renaissance Periodization - Sissy Squat
    effectivenessRank: 4
  },
  {
    id: 59,
    name: 'Cable Crossover',
    primaryMuscle: 'chest',
    secondaryMuscles: [],
    equipment: 'cable',
    jointFriendly: true,
    difficulty: 'beginner',
    instructions: 'Cables at various heights. Step forward. Bring hands together in crossover motion.',
    tips: 'Adjust cable height to target different chest areas. Great for mind-muscle connection.',
    youtubeId: 'Z66epMHO4Vw', // Similar to cable fly
    effectivenessRank: 3
  },
  {
    id: 60,
    name: 'Single Leg Romanian Deadlift',
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'core'],
    equipment: 'dumbbell',
    jointFriendly: true,
    difficulty: 'intermediate',
    instructions: 'Stand on one leg. Hinge forward extending other leg back. Return to standing.',
    tips: 'Great for balance and unilateral strength. Focus on hamstring stretch.',
    youtubeId: 'zYzKbGscJuI', // Squat University - Single Leg RDL
    effectivenessRank: 4
  }
]
