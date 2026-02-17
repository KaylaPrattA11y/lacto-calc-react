import React from "react";
import { 
  HiOutlineDownload, 
  HiOutlineUpload,
  HiTrash,
  HiBadgeCheck,
  HiExclamation
} from "react-icons/hi";
import type { FermentEntry, SetFermentData } from "../../types";
import IconButton from "../IconButton";
import { toast, type ToastContentProps } from "react-toastify";
import importFermentEntries from "../../utils/importFermentEntries";

function DeleteEntriesToast({ closeToast }: ToastContentProps) {
  return ( 
    <div className="toast-cta">
      <div className="toast-cta--message">
        Are you sure you want to delete all ferment entries?
      </div>
      <div className="toast-cta--actions">
        <button onClick={() => closeToast("export-delete-all")} className="is-primary is-sm">Export and delete all</button>
        <button onClick={() => closeToast("delete-all")} className="is-secondary is-sm">Delete all</button>
        <button onClick={() => closeToast("cancel")} className="is-secondary is-sm">Cancel</button>
      </div>
    </div>
  )
}

function ImportEntriesToast({ closeToast }: ToastContentProps) {
  return ( 
    <div className="toast-cta">
      <div className="toast-cta--message">
        Importing ferment data (JSON) will overwrite your current ferment data.
      </div>
      <div className="toast-cta--actions">
        <button onClick={() => closeToast("import")} className="is-primary is-sm">Import</button>
        <button onClick={() => closeToast("cancel")} className="is-secondary is-sm">Cancel</button>
      </div>
    </div>
  )
}

export default function FermentListHeader({data, setData}: {data: FermentEntry[], setData: SetFermentData}) {
  function deleteFermentEntries() {
    localStorage.removeItem('fermentData');
    // Dispatch custom event to notify FermentList of data deletion
    window.dispatchEvent(new Event('fermentDataUpdated'));
    toast.success('All ferments deleted successfully.', {
      icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />,
      position: "bottom-right",
    });
  }
  function exportFermentEntries() {
    // save JSON file to user's device
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LFT_EXPORT_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Ferment data exported successfully.', {
      icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />,
      position: "bottom-right",
    });
  }

  return (
    <div className="ferment-list--header">
      <div className="btn-group">
        <IconButton 
          label="Export (.json)"
          variant="primary"
          size="sm"
          alignment="bottom"
          onClick={exportFermentEntries}
        >
          <HiOutlineDownload size={18} />
        </IconButton>
        <IconButton 
          label="Import (.json)"
          variant="secondary"
          size="sm"
          alignment="bottom"
          onClick={() => {
            toast.warning(ImportEntriesToast, {
              autoClose: false,
              icon: <HiExclamation size="24px" />,
              position: "top-right",
              onClose(reason) {
                switch (reason) {
                  case "import":
                    importFermentEntries(setData);
                    break;
                  case "cancel":
                    return;
                  default:
                    return;
                }
              }
            });
          }}
        >
          <HiOutlineUpload size={18} />
        </IconButton>
        <IconButton 
          label="Delete all"
          variant="secondary"
          size="sm"
          alignment="bottom"
          onClick={() => {

            toast.warning(DeleteEntriesToast, {
              autoClose: false,
              icon: <HiExclamation size="24px" />,
              position: "top-right",
              onClose(reason) {
                switch (reason) {
                  case "export-delete-all":
                    exportFermentEntries();
                    deleteFermentEntries();
                    break;
                  case "delete-all":
                    deleteFermentEntries();
                    break;
                  case "cancel":
                    return;
                  default:
                    return;
                }
              }
            });
          }}
        >
          <HiTrash size={18} />
        </IconButton>
      </div>
    </div>
  );
}