import React from "react";
import { HiInformationCircle } from "react-icons/hi";

interface DetailsProps {
  summary: string | React.ReactNode;
  children: string | React.ReactNode;
}

export default function Details({summary, children} : DetailsProps) {
  return (
    <details className="details">
      <summary className="details--summary"><HiInformationCircle size={18} />{summary}</summary>
      <div className="details--content">
        <div>{children}</div>
      </div>
    </details>
  )
}