import React from "react";
import type { IconButtonProps } from "../types";

export default function IconButton({label, children, size, variant, ...rest} : IconButtonProps) {
  function getClassList() {
    const classList = ["icon-button"];
    if (variant) {
      classList.push(`is-${variant}`);
    }
    if (size) {
      classList.push(`is-${size}`);
    }
    return classList.join(" ");
  }
  return (
    <button 
      className={getClassList()}
      {...rest} 
      aria-label={label}
    >
      {children}
    </button>
  );
}