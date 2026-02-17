import { toast } from 'react-toastify';
import { type FermentEntry, type SetFermentData } from '../types';

export default function importFermentEntries(setData: SetFermentData) {
  // Trigger file input click to import JSON file
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string) as FermentEntry[];
        setData(importedData);
        localStorage.setItem('fermentData', JSON.stringify(importedData));
        // Dispatch custom event to notify FermentList of new data
        window.dispatchEvent(new Event('fermentDataUpdated'));
        toast.success('Ferment data imported successfully.');
      } catch (error) {
        toast.error('Failed to import ferment data. Please ensure the file is a valid JSON.');
        throw new Error('Invalid JSON file', error as Error);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}