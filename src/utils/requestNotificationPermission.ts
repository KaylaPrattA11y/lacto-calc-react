interface RequestNotificationPermissionOptions {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default async function requestNotificationPermission({ onPermissionGranted, onPermissionDenied }: RequestNotificationPermissionOptions = {}) {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      onPermissionGranted?.();
    } else {
      onPermissionDenied?.();
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}
