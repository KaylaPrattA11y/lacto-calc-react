import React from "react";
import type { FermentEntry } from "../types";
import { HiExclamation, HiBadgeCheck } from "react-icons/hi";
import { toast, type ToastContentProps } from "react-toastify";

function DeleteEntryToast({ closeToast }: ToastContentProps) {
  return ( 
    <div className="toast-cta">
      <div className="toast-cta--message">
        Are you sure you want to delete this ferment?
      </div>
      <div className="toast-cta--actions">
        <button onClick={() => closeToast("delete")} className="is-primary is-sm">Delete</button>
        <button onClick={() => closeToast("cancel")} className="is-secondary is-sm">Cancel</button>
      </div>
    </div>
  )
}

export default function handleDeleteFerment(
  ferment: FermentEntry, 
  data: FermentEntry[], 
  setData: React.Dispatch<React.SetStateAction<FermentEntry[]>>
) {
  const rowElement = document.querySelector(
    `[data-row-id="${ferment.id}"]`
  );
  
  toast.warning(DeleteEntryToast, {
    autoClose: false,
    icon: <HiExclamation size="24px" />,
    position: "top-right",
    onOpen() {
      // Keep the row highlighted while the toast is open
      if (rowElement) {
        rowElement.classList.add('highlight-row');
      }
    },
    onClose(reason) {
      const newData = data.filter(d => d.id !== ferment.id);

      if (rowElement) {
        rowElement.classList.remove('highlight-row');
      }

      switch (reason) {
        case "delete":
          setData(newData);
          localStorage.setItem('fermentData', JSON.stringify(newData));
          if (ferment.fermentName) {
            toast.success(`Deleted ferment: ${ferment.fermentName}`, {
              icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />,
              position: "bottom-right",
            });
          } else {
            toast.success(`Deleted ferment entry.`, {
              icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />,
              position: "bottom-right",
            });
          }
          break;
        case "cancel":
          return;
        default:
          return;
      }
    }
  });
}