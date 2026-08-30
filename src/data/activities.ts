/**
 * MET (metabolic equivalent of task) values.
 *
 * 1 MET is the energy cost of sitting quietly. Figures follow the
 * Compendium of Physical Activities (Ainsworth et al., 2011).
 *
 * Add activities here — nothing in the UI hardcodes an activity.
 */

export type Activity = {
  id: string;
  label: string;
  met: number;
  group: "Cardio" | "Strength" | "Sport" | "Everyday";
};

export const ACTIVITIES: readonly Activity[] = [
  // Cardio
  { id: "walking-slow", label: "Walking, slow (3 km/h)", met: 2.8, group: "Cardio" },
  { id: "walking", label: "Walking, moderate (5 km/h)", met: 3.5, group: "Cardio" },
  { id: "walking-brisk", label: "Walking, brisk (6.5 km/h)", met: 5.0, group: "Cardio" },
  { id: "jogging", label: "Jogging (8 km/h)", met: 8.0, group: "Cardio" },
  { id: "running", label: "Running (10 km/h)", met: 10.0, group: "Cardio" },
  { id: "running-fast", label: "Running, fast (13 km/h)", met: 12.8, group: "Cardio" },
  { id: "cycling-light", label: "Cycling, light (16 km/h)", met: 4.0, group: "Cardio" },
  { id: "cycling", label: "Cycling, moderate (20 km/h)", met: 8.0, group: "Cardio" },
  { id: "cycling-vigorous", label: "Cycling, vigorous (25 km/h)", met: 10.0, group: "Cardio" },
  { id: "swimming", label: "Swimming, moderate", met: 5.8, group: "Cardio" },
  { id: "swimming-vigorous", label: "Swimming, vigorous", met: 9.8, group: "Cardio" },
  { id: "rowing", label: "Rowing machine, moderate", met: 7.0, group: "Cardio" },
  { id: "elliptical", label: "Elliptical trainer", met: 5.0, group: "Cardio" },
  { id: "stair-climbing", label: "Stair climbing", met: 8.8, group: "Cardio" },
  { id: "skipping", label: "Skipping rope", met: 11.0, group: "Cardio" },

  // Strength
  { id: "weights-light", label: "Weight training, light", met: 3.5, group: "Strength" },
  { id: "weights", label: "Weight training, moderate", met: 5.0, group: "Strength" },
  { id: "weights-vigorous", label: "Weight training, vigorous", met: 6.0, group: "Strength" },
  { id: "hiit", label: "HIIT / circuit training", met: 8.0, group: "Strength" },
  { id: "bodyweight", label: "Bodyweight calisthenics", met: 4.3, group: "Strength" },
  { id: "crossfit", label: "CrossFit style training", met: 7.5, group: "Strength" },

  // Sport
  { id: "cricket", label: "Cricket", met: 4.8, group: "Sport" },
  { id: "badminton", label: "Badminton", met: 5.5, group: "Sport" },
  { id: "football", label: "Football", met: 7.0, group: "Sport" },
  { id: "basketball", label: "Basketball", met: 6.5, group: "Sport" },
  { id: "tennis", label: "Tennis", met: 7.3, group: "Sport" },
  { id: "table-tennis", label: "Table tennis", met: 4.0, group: "Sport" },

  // Everyday
  { id: "yoga", label: "Yoga", met: 2.5, group: "Everyday" },
  { id: "power-yoga", label: "Power yoga", met: 4.0, group: "Everyday" },
  { id: "pilates", label: "Pilates", met: 3.0, group: "Everyday" },
  { id: "stretching", label: "Stretching / mobility", met: 2.3, group: "Everyday" },
  { id: "dancing", label: "Dancing", met: 5.0, group: "Everyday" },
  { id: "housework", label: "Housework", met: 3.3, group: "Everyday" },
  { id: "gardening", label: "Gardening", met: 3.8, group: "Everyday" },
] as const;

export function findActivity(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

export const ACTIVITY_GROUPS = [
  "Cardio",
  "Strength",
  "Sport",
  "Everyday",
] as const;
