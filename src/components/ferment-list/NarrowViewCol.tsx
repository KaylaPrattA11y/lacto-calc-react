import React from "react";
import Details from "../Details";
import { type FermentEntry } from "../../types";
import { formatter, getFormattedVal } from "../../utils/formatter";
import { getDuration, getRemainingDuration } from "../../utils/time";

export default function NarrowViewCol(originalRowProps : FermentEntry) {
  const { 
    status,
    fermentName, 
    brinePercentage, 
    dateStart, 
    dateEnd, 
    notes, 
    tags,
    weight, 
    saltRequired, 
    unit 
  } = originalRowProps;
  const start = dateStart ? new Date(dateStart) : undefined;
  const end = dateEnd ? new Date(dateEnd) : undefined;
  const remainingDuration = (dateStart && dateEnd) ? getRemainingDuration(dateStart, dateEnd) : undefined;

  return (
    <div className="ferment-list--narrow-cell">
      {status && (
      <div className={`badge is-${status.toLowerCase()}`}>
        {status}
      </div>
      )}
      {fermentName && (
      <div>
        <strong>{fermentName}</strong>
      </div>
      )}
      <small>
        {dateStart && dateEnd && (
        <>
        <div>
          {formatter.date.format(start)} - {formatter.date.format(end)} ({getDuration(dateStart, dateEnd)})
        </div>
        {remainingDuration && (
        <div>
          <strong>Remaining:</strong> {remainingDuration}
        </div>
        )}
        </>
        )}
        <div>
          <strong>Salt brine:</strong> {formatter.percent.format(brinePercentage / 100)}
        </div>
        <div>
        <strong>Weight:</strong> {getFormattedVal(weight, unit)}
        </div>
        <div>
          <strong>Salt required:</strong> {getFormattedVal(saltRequired, unit)}
        </div>
      </small>
      {notes && (
      <Details summary="View notes">{notes}</Details>
      )}
      {tags && tags.length > 0 && (
      <ul className="tags">
        {tags.map((tag, index) => (
          <li key={index} className="tag">{tag}</li>
        ))}
      </ul>
      )}
    </div>
  );
}