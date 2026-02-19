import React from "react";
import { HiBadgeCheck } from "react-icons/hi";
import { toast, type ToastContentProps } from "react-toastify";
import type { TabsController } from "../components/Tabs";
import type { FermentEntry } from "../types";

function AddEntryToast({ closeToast, data }: ToastContentProps<FermentEntry>) {
  const ferment = data;
  
  return ( 
    <div className="toast-cta">
      <div className="toast-cta--message">
        Ferment &quot;{ferment.fermentName}&quot; successfully added.
      </div>
      <div className="toast-cta--actions">
        <button onClick={() => closeToast("view-entry")} className="is-primary is-sm">View saved ferments</button>
      </div>
    </div>
  )
}

export default function handleAddFerment(
  ferment: FermentEntry, 
  ferments: FermentEntry[],
  tabsController?: TabsController
) {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('fermentData', JSON.stringify(ferments));
    window.dispatchEvent(new Event('fermentDataUpdated'));
  }
  
  toast.success(AddEntryToast, {
    icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />,
    position: "bottom-right",
    autoClose: 5000,
    data: ferment,
    onClose(reason) {
      switch (reason) {
        case "view-entry":
          if (tabsController) {
            tabsController.setActiveId('ferment-list');
          }
          break;
        default:
          return;
      }
    }
  });
}