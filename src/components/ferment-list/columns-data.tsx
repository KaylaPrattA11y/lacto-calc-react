import React from "react";
import { HiPencil, HiTrash, HiShare } from "react-icons/hi";
import { getDuration, getRemainingDuration } from "../../utils/time";
import { getFormattedVal } from '../../utils/formatter';
import { formatter } from "../../utils/formatter";
import IconButton from '../IconButton';
import NarrowViewCol from './NarrowViewCol';
import type { ColumnsDataProps } from "../../types";
import handleShareFerment from "../../utils/handleShareFerment";
import handleDeleteFerment from "../../utils/handleDeleteFerment";

function getColumnsData({columnHelper, data, setData}: ColumnsDataProps) {
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
    columnHelper.accessor('dateCreated', {
      header: 'Created',
      id: 'dateCreated',
      cell: props => {
        const { dateCreated } = props.row.original;
        if (!dateCreated) return undefined;
        const created = new Date(dateCreated);
        return `${formatter.dateTime.format(created)}`;
      },
      enableHiding: true,
      enableSorting: true,
      sortingFn: 'datetime',
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
          {navigator.share !== undefined && (
            <IconButton 
              size="sm" 
              variant="secondary" 
              label="Share"
              onClick={() => handleShareFerment(props.row.original)}
            >
              <HiShare size={14} />
            </IconButton>
          )}
          <IconButton 
            size="sm" 
            variant="secondary" 
            label="Delete"
            onClick={() => handleDeleteFerment(props.row.original, data, setData)}
          >
            <HiTrash size={14} />
          </IconButton>
        </div>
      ),
    }),
  ]
}

export { getColumnsData };