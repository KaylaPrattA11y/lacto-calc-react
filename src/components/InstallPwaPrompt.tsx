import React, { useCallback, useContext } from 'react';
import { HiDeviceMobile, HiBell } from 'react-icons/hi';
import requestNotificationPermission from '../utils/requestNotificationPermission';
import { PwaContext, NotificationsContext } from './SpecialFeaturesContext';

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
  const canInstallPwa = useContext(PwaContext);
  const canReceiveNotifications = useContext(NotificationsContext);


  const handleInstallClick = useCallback(async () => {
    if (!window.installPrompt) {
      return;
    }
    
    try {
      await window.installPrompt.prompt();
      const result = await window.installPrompt.userChoice;

      if (result.outcome === 'accepted') {
        window.installPrompt = undefined;
      }
    } catch (error) {
      console.error('[InstallPwaPrompt] Error prompting install:', error);
    }
  }, []);

  const handleNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return;
    }
    await requestNotificationPermission();
  }, []);

  // Show install button if PWA is available to install
  const showInstallButton = canInstallPwa === true;
  
  // Show notification button if permission hasn't been granted or denied yet
  const showNotificationButton = canReceiveNotifications === null;

  return (
    <div className="install-pwa-prompt">
      {showInstallButton && (
        <button type="button" className="is-primary is-sm" onClick={handleInstallClick}>
          Install App <HiDeviceMobile />
        </button>
      )}
      {showNotificationButton && (
        <button type="button" className="is-secondary is-sm" onClick={handleNotificationPermission}>
          Enable Notifications <HiBell />
        </button>
      )}
    </div>
  );
}