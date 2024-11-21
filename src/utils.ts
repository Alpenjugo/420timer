import { addHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import type { Timezone } from './types';

const cityMap: Record<string, string[]> = {
  'America/La_Paz': ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre'],
  'Asia/Kolkata': ['Mumbai', 'New Delhi', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad'],
  'Asia/Tokyo': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'],
  'Europe/London': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Edinburgh'],
  'America/New_York': ['New York', 'Boston', 'Philadelphia', 'Miami', 'Atlanta'],
  'America/Los_Angeles': ['Los Angeles', 'San Francisco', 'Seattle', 'Portland', 'San Diego'],
  'Australia/Sydney': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  'Asia/Dubai': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'Asia/Singapore': ['Singapore', 'Kuala Lumpur', 'Jakarta', 'Bangkok', 'Manila'],
  'Europe/Paris': ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam']
};

function getCitiesForTimezone(timezone: string): string[] {
  const tzParts = timezone.split('/');
  const tzKey = Object.keys(cityMap).find(key => 
    timezone.includes(key) || key.includes(timezone)
  );
  
  return tzKey ? cityMap[tzKey] : [tzParts[tzParts.length - 1].replace(/_/g, ' ')];
}

export interface Location420 {
  location: string;
  timeUntil: number;
  localTime: Date;
}

export function findNext420Locations(timezones: Timezone[]): Location420[] {
  const now = new Date();
  const locations: Location420[] = [];

  timezones.forEach((tz) => {
    if (!tz.utc[0]) return;

    const localTime = utcToZonedTime(now, tz.utc[0]);
    const currentHour = localTime.getHours();
    const currentMinute = localTime.getMinutes();

    let next420 = new Date(localTime);
    next420.setHours(4, 20, 0, 0);

    if (currentHour >= 4 && currentMinute >= 20) {
      next420.setHours(16, 20, 0, 0);
    }

    if (currentHour >= 16 && currentMinute >= 20) {
      next420 = addHours(next420, 12);
    }

    let timeUntil = next420.getTime() - localTime.getTime();

    if (timeUntil < 0) {
      next420 = addHours(next420, 24);
      timeUntil = next420.getTime() - localTime.getTime();
    }

    if (timeUntil > 0 && timeUntil <= 3600000) {
      const cities = getCitiesForTimezone(tz.utc[0]);
      locations.push({
        location: cities.join(', '),
        timeUntil,
        localTime: next420
      });
    }
  });

  return locations.sort((a, b) => a.timeUntil - b.timeUntil).slice(0, 3);
}

export function findPast420Location(timezones: Timezone[]): {
  location: string;
  timeSince: number;
  localTime: Date;
} | null {
  const now = new Date();
  let mostRecent: { location: string; timeSince: number; localTime: Date } | null = null;

  timezones.forEach((tz) => {
    if (!tz.utc[0]) return;

    const localTime = utcToZonedTime(now, tz.utc[0]);
    const morning420 = new Date(localTime);
    morning420.setHours(4, 20, 0, 0);
    
    const evening420 = new Date(localTime);
    evening420.setHours(16, 20, 0, 0);

    const checkTime = (time: Date) => {
      const timeSince = localTime.getTime() - time.getTime();
      if (timeSince > 0 && timeSince <= 3600000) {
        if (!mostRecent || timeSince < mostRecent.timeSince) {
          const cities = getCitiesForTimezone(tz.utc[0]);
          mostRecent = {
            location: cities.join(', '),
            timeSince,
            localTime: time
          };
        }
      }
    };

    checkTime(morning420);
    checkTime(evening420);
  });

  return mostRecent;
}