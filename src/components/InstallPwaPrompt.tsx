import React, { useCallback, useEffect, useState } from 'react';
import { HiDeviceMobile, HiBell } from 'react-icons/hi';
import requestNotificationPermission from '../utils/requestNotificationPermission';

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

  const handleInstallClick = useCallback(async () => {
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
  }, [installPromptEvent]);

  const handleNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      if (import.meta.env.DEV) {
        console.log('Browser does not support notifications');
      }
      return;
    }
    await requestNotificationPermission({
      onPermissionGranted: () => {
        setShowNotificationButton(false);
      },
      onPermissionDenied: () => {
        setShowNotificationButton(false);
      }
    });
  }, []);

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