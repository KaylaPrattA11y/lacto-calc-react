import { Temporal } from "@js-temporal/polyfill";
import type { FermentStatus } from "../types";

function getDurationStr(duration: Temporal.Duration) {
  // If duration is negative or zero, return undefined
  const totalDays = duration.years * 365 + duration.months * 30 + duration.weeks * 7 + duration.days;
  if (totalDays <= 0) return undefined;

  if (duration.months > 0) {
    return `${duration.months} month${duration.months !== 1 ? 's' : ''}`;
  }
  // Manually convert remaining days to weeks
  const weeks = Math.floor(duration.days / 7);
  const remainingDays = duration.days % 7;
  if (weeks > 0) {
    if (remainingDays > 0) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
    }
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  }
  if (remainingDays > 0) {
    return `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
  }
  return undefined;
}

export function getDuration(dateStart: string, dateEnd: string): string | undefined {
  try {
    // Parse the ISO date strings (format: YYYY-MM-DD)
    const start = Temporal.PlainDate.from(dateStart);
    const end = Temporal.PlainDate.from(dateEnd);
    // Add 1 day to end date to make duration inclusive
    const endInclusive = end.add({ days: 1 });
    // Calculate the duration between the two dates
    const duration = start.until(endInclusive, { largestUnit: 'month' });
    return getDurationStr(duration);
  } catch (error) {
    console.error('Invalid date format:', error);
    return undefined;
  }
}

export function getRemainingDuration(dateStart: string, dateEnd: string): string | undefined {
  try {
    // Parse the ISO date strings (format: YYYY-MM-DD)
    const today = Temporal.PlainDate.from(new Date().toISOString().split('T')[0]);
    const end = Temporal.PlainDate.from(dateEnd);
    // Add 1 day to end date to make duration inclusive
    const endInclusive = end.add({ days: 1 });
    // Calculate the duration between today and end date
    const duration = today.until(endInclusive, { largestUnit: 'month' });
    // If ferment starts on a future date, return '-'
    const start = Temporal.PlainDate.from(dateStart);
    if (start.since(today).days > 0) {
      return undefined;
    }
    return getDurationStr(duration);
  } catch (error) {
    console.error('Invalid date format:', error);
    return undefined;
  }
}

export function getFermentStatus(dateStart: string | undefined, dateEnd: string | undefined): FermentStatus {
  if (!dateStart || !dateEnd) return undefined;

  // Parse the ISO date strings (format: YYYY-MM-DD)
  const today = Temporal.PlainDate.from(new Date().toISOString().split('T')[0]);
  const start = Temporal.PlainDate.from(dateStart);
  
  if (start.since(today).days > 0) return 'Planned';
  
  const end = Temporal.PlainDate.from(dateEnd);
  // Add 1 day to end date to make duration inclusive
  const endInclusive = end.add({ days: 1 });
  // Calculate the duration between today and end date
  const duration = today.until(endInclusive, { largestUnit: 'month' });
  // If duration is negative or zero, return 'Complete'
  const totalDays = duration.years * 365 + duration.months * 30 + duration.weeks * 7 + duration.days;
  
  if (totalDays <= 0) return 'Complete';
  return 'Active';
}