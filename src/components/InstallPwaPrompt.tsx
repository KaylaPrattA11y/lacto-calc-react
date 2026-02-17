import React, { useEffect, useState } from 'react';

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

  async function handleInstallClick() {
    if (!installPromptEvent) {
      return;
    }
    await installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    
    console.log(`Install prompt was: ${result.outcome}`);
    setInstallPromptEvent(null);
    setShowButton(false);
  }

  useEffect(() => {
    const installPromptHandler = (event: Event) => {
      console.log('beforeinstallprompt event fired', event);
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
      <button type="button" className="is-primary" onClick={handleInstallClick}>Install App</button>
    )}
    </>
  );
}