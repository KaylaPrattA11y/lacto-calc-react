import React from "react";

type IconButtonAlignment = "top" | "bottom";
type IconButtonSizes = 'md' | 'sm';
type IconButtonVariants = 'primary' | 'secondary';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: React.ReactNode;
  size?: IconButtonSizes;
  variant?: IconButtonVariants;
  alignment?: IconButtonAlignment;
}

export default function IconButton({label, children, size, variant, alignment = "top", ...rest} : IconButtonProps) {
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
      data-alignment={alignment}
      {...rest} 
      aria-label={label}
    >
      {children}
    </button>
  );
}