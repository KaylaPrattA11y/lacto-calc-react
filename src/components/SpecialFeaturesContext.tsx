import { createContext } from 'react';

// Three states:
// null = "ask" - user hasn't been asked yet, show prompt IF feature is supported
// true = "granted" - user has granted permission, hide prompt
// false = "denied" - user has denied permission, hide prompt

export const PwaContext = createContext<boolean | null>(null);
export const NotificationsContext = createContext<boolean | null>(
  'Notification' in window ? Notification.permission === 'granted' : false
);
