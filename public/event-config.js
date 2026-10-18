// Public event defaults shared by the browser and Worker. No credentials here.
export const EVENT = Object.freeze({ participants: 120, teamMin: 4, teamMax: 6, leaderboardLimit: 100, pollIntervalMs: 5000 });
export const LOCATIONS = Object.freeze([
  { value: 'Stuttgart', de: 'Stuttgart', en: 'Stuttgart' },
  { value: 'Berlin', de: 'Berlin', en: 'Berlin' },
  { value: 'München', de: 'München', en: 'Munich' },
  { value: 'Frankfurt', de: 'Frankfurt', en: 'Frankfurt' },
  { value: 'Köln', de: 'Köln', en: 'Cologne' },
  { value: 'Düsseldorf', de: 'Düsseldorf', en: 'Düsseldorf' },
  { value: 'Hamburg', de: 'Hamburg', en: 'Hamburg' },
  { value: 'Hannover', de: 'Hannover', en: 'Hanover' },
  { value: 'Bukarest', de: 'Bukarest', en: 'Bucharest' },
  { value: 'Remote', de: 'Remote', en: 'Remote' },
  { value: 'Anderer Standort', de: 'Anderer Standort', en: 'Other location' }
]);
export const OFFICE_LOCATIONS = LOCATIONS.filter(location => !['Remote', 'Anderer Standort'].includes(location.value));
export const isLocation = value => LOCATIONS.some(location => location.value === value);
