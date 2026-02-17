export default function getClientEnv(): 'web' | 'pwa' {
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone
  ) {
    return 'pwa';
  }
  return 'web';
}