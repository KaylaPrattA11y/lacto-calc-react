import React from "react";

export default function Spinner({isVisible = true}: {isVisible?: boolean}) {
  if (!isVisible) return null;
  return (
    <div className="spinner" aria-hidden="true"></div>
  );
}