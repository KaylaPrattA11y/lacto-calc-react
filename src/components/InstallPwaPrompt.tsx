import React, { useEffect, useState } from 'react';
import { HiDeviceMobile } from 'react-icons/hi';

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
  const enableLogging = import.meta.env.DEV;
  const [showButton, setShowButton] = useState<boolean>(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  async function handleInstallClick() {
    if (!installPromptEvent) {
      if (enableLogging) {
        console.log('No installPromptEvent – beforeinstallprompt never fired');
      }
      return;
    }
    await installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    if (enableLogging) {
      console.log('Install outcome:', result.outcome);
    }
    setInstallPromptEvent(null);
    setShowButton(false);
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

  return (
    <>
    {showButton && (
      <button type="button" className="is-primary is-sm" onClick={handleInstallClick}>Install App <HiDeviceMobile /></button>
    )}
    </>
  );
}