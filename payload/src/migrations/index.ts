import * as migration_20251221_150039 from './20251221_150039';
import * as migration_20251221_175416_add_recipe_data from './20251221_175416_add_recipe_data';
import * as migration_20251223_121800_add_workout_data from './20251223_121800_add_workout_data';

export const migrations = [
  {
    up: migration_20251221_150039.up,
    down: migration_20251221_150039.down,
    name: '20251221_150039',
  },
  {
    up: migration_20251221_175416_add_recipe_data.up,
    down: migration_20251221_175416_add_recipe_data.down,
    name: '20251221_175416_add_recipe_data'
  },
  {
    up: migration_20251223_121800_add_workout_data.up,
    down: migration_20251223_121800_add_workout_data.down,
    name: '20251223_121800_add_workout_data'
  },
];
