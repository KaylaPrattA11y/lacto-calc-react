import { type ColumnHelper } from '@tanstack/react-table';

declare global {
  interface Navigator {
    /**
     * Non-standard iOS Safari flag indicating PWA standalone mode.
     */
    standalone?: boolean;
  }

  interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly VITE_ENVIRONMENT?: 'development' | 'production';
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export type FermentStatus = 'Planned' | 'Active' | 'Complete' | undefined;

export type SetFermentData = React.Dispatch<React.SetStateAction<FermentEntry[]>>;

export type FermentEntry = {
  id: string; // required, unique identifier
  weight: number; // required, numeric value for weight of the fermenting item
  unit: string; // required, value for weight unit (e.g. "g", "kg", "oz", "lb")
  brinePercentage: number; // required, numeric value for salt brine percentage (e.g. 2.2 for 2.2%)
  saltRequired: number; // required, numeric value for calculated salt required for the ferment
  fermentName?: string; // optional, string value for the name of the ferment
  notes?: string; // optional, string value for any notes about the ferment
  status?: FermentStatus; // optional, status of the ferment ('Planned', 'Active', 'Complete')
  dateStart?: string; // optional, ISO date string (YYYY-MM-DD) for the start date of the ferment
  dateEnd?: string; // optional, ISO date string (YYYY-MM-DD) for the end date of the ferment
  sendNotification?: boolean; // optional, boolean indicating if notification is set for ferment completion
  tags?: string[]; // optional, array of strings for tags associated with the ferment
}

export type ColumnSort = {
  id: string
  desc: boolean
}

export interface ColumnsDataProps {
  columnHelper: ColumnHelper<FermentEntry>;
  data: FermentEntry[];
  setData: React.Dispatch<React.SetStateAction<FermentEntry[]>>;
}

export type SortingState = ColumnSort[]

export type FermentDateRangePreset = 'one-week' | 'two-weeks' | 'one-month' | 'custom' | undefined;

export type PresetUnit = 'grams' | 'ounces' | 'other';
