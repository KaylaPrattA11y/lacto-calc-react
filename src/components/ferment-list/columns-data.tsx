import React from "react";
import { HiPencil, HiTrash, HiBadgeCheck, HiExclamation } from "react-icons/hi";
import { getDuration, getRemainingDuration } from "../../utils/time";
import { getFormattedVal } from '../../utils/formatter';
import { formatter } from "../../utils/formatter";
import IconButton from '../IconButton';
import NarrowViewCol from './NarrowViewCol';
import { toast, type ToastContentProps } from "react-toastify";
import type { ColumnsDataProps } from "../../types";

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

export default function getColumnsData({columnHelper, data, setData}: ColumnsDataProps) {
  return [
    columnHelper.display({
      id: 'narrowViewCol',
      cell: props => <NarrowViewCol {...props.row.original} />,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      id: 'status',
      cell: props => <span className={`badge is-${props.row.original.status?.toLowerCase()}`}>{props.row.original.status}</span>,
      enableSorting: true,
      sortingFn: 'alphanumeric',
      enableColumnFilter: true,
    }),
    columnHelper.accessor('fermentName', {
      header: "Ferment name",
      id: 'fermentName',
      enableSorting: true,
      sortingFn: 'alphanumeric'
    }),
    columnHelper.accessor('dateStart', {
      header: 'Date start',
      id: 'dateStart',
      cell: props => {
        const { dateStart } = props.row.original;
        if (!dateStart) return undefined;
        const start = new Date(dateStart);
        return `${formatter.date.format(start)}`;
      },
      enableSorting: true,
      sortingFn: 'datetime'
    }),
    columnHelper.accessor('dateEnd', {
      header: 'Date end',
      id: 'dateEnd',
      cell: props => {
        const { dateEnd } = props.row.original;
        if (!dateEnd) return undefined;
        const end = new Date(dateEnd);
        return `${formatter.date.format(end)}`;
      },
      enableSorting: true,
      sortingFn: 'datetime'
    }),
    columnHelper.display({
      header: 'Total duration',
      id: 'colTotalDuration',
      cell: props => {
        const { dateStart, dateEnd } = props.row.original;
        if (dateStart && dateEnd) {
          return getDuration(dateStart, dateEnd);
        }
        return undefined;
      }
    }),
    columnHelper.accessor('dateEnd', {
      header: 'Remaining duration',
      id: 'colRemainingDuration',
      cell: props => {
        const { dateStart, dateEnd } = props.row.original;
        if (dateStart && dateEnd) {
          return getRemainingDuration(dateStart, dateEnd);
        }
        return undefined;
      },
      enableSorting: true,
      sortingFn: 'alphanumeric'
    }),
    columnHelper.accessor('brinePercentage', {
      header: "Salt brine",
      id: 'brinePercentage',
      cell: props => <span>{formatter.percent.format(props.row.original.brinePercentage / 100)}</span>,
      enableSorting: true,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('weight', {
      header: "Weight",
      id: 'weight',
      cell: props => getFormattedVal(props.row.original.weight, props.row.original.unit),
      enableSorting: true,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('saltRequired', {
      header: "Salt required",
      id: 'saltRequired',
      cell: props => getFormattedVal(props.row.original.saltRequired, props.row.original.unit),
      enableSorting: true,
      sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('notes', {
      header: "Notes",
      id: 'notes',
      cell: props => <small>{props.row.original.notes}</small>,
      enableSorting: false,
    }),
    columnHelper.accessor('tags', {
      header: "Tags",
      id: 'tags',
      cell: props => {
        const { tags } = props.row.original;
        if (tags && tags.length > 0) {
          return (
            <ul className="tags">
            {tags.map((tag, index) => (
              <li key={index} className="tag">{tag}</li>
            ))}
            </ul>
          );
        }
        return undefined;
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <div className="ferment-list--actions">
          {import.meta.env.DEV && (
            <IconButton size="sm" variant="secondary" label="Edit"><HiPencil size={14} /></IconButton>
          )}
          <IconButton 
            size="sm" 
            variant="secondary" 
            label="Delete"
            onClick={() => {
              const { fermentName } = props.row.original;
              const rowElement = document.querySelector(
                `[data-row-id="${props.row.id}"]`
              );
              
              toast.warning(DeleteEntryToast, {
                autoClose: false,
                icon: <HiExclamation size="24px" />,
                onOpen() {
                  // Keep the row highlighted while the toast is open
                  if (rowElement) {
                    rowElement.classList.add('highlight-row');
                  }
                },
                onClose(reason) {
                  const newData = data.filter(d => d.id !== props.row.original.id);

                  if (rowElement) {
                    rowElement.classList.remove('highlight-row');
                  }

                  switch (reason) {
                    case "delete":
                      setData(newData);
                      localStorage.setItem('fermentData', JSON.stringify(newData));
                      if (fermentName) {
                        toast.success(`Deleted ferment: ${fermentName}`, {
                          icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />
                        });
                      } else {
                        toast.success(`Deleted ferment entry.`, {
                          icon: <HiBadgeCheck color="var(--accent-color)" size="24px" />
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
            }}
          >
            <HiTrash size={14} />
          </IconButton>
        </div>
      ),
    }),
  ]
}