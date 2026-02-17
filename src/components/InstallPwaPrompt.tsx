import React, { useEffect, useState } from 'react';
import { HiDeviceMobile, HiBell } from 'react-icons/hi';

declare global {
  interface Window {
    installPrompt?: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPwaPrompt() {
  const [showButton, setShowButton] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showNotificationButton, setShowNotificationButton] = useState<boolean>(false);

  async function handleInstallClick() {
    if (!installPromptEvent) {
      if (import.meta.env.DEV) {
        console.log('No installPromptEvent – beforeinstallprompt never fired');
      }
      return;
    }
    await installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    if (import.meta.env.DEV) {
      console.log('Install outcome:', result.outcome);
    }
    setInstallPromptEvent(null);
    setShowButton(false);
  }

  async function handleNotificationPermission() {
    if (!('Notification' in window)) {
      if (import.meta.env.DEV) {
        console.log('Browser does not support notifications');
      }
      return;
    }

    if (Notification.permission === 'granted') {
      if (import.meta.env.DEV) {
        console.log('Notification permission already granted');
      }
      setShowNotificationButton(false);
      return;
    }

    if (Notification.permission === 'denied') {
      if (import.meta.env.DEV) {
        console.log('Notification permission was denied');
      }
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (import.meta.env.DEV) {
        console.log('Notification permission result:', permission);
      }
      if (permission === 'granted') {
        setShowNotificationButton(false);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  useEffect(() => {
    const installPromptHandler = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
      setShowButton(true);
    }
    window.addEventListener("beforeinstallprompt", installPromptHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', installPromptHandler);
    };
  }, []);

  useEffect(() => {
    // Check if notifications are supported and permission hasn't been requested yet
    if ('Notification' in window && Notification.permission === 'default') {
      setShowNotificationButton(true);
    }
  }, []);

  return (
    <div className="install-pwa-prompt">
    {showButton && (
      <button type="button" className="is-primary is-sm" onClick={handleInstallClick}>Install App <HiDeviceMobile /></button>
    )}
    {showNotificationButton && (
      <button type="button" className="is-secondary is-sm" onClick={handleNotificationPermission}>Enable Notifications <HiBell /></button>
    )}
    </div>
  );
}