import React, { useEffect } from "react";
import Details from "./Details";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  addon?: string | React.ReactNode;
  showLabel?: boolean;
  helpText?: string | React.ReactNode;
  description?: string;
}

export default function Input({ label, id, addon, helpText, showLabel = true, description, ...rest }: InputProps) {
  useEffect(() => {
    
  }, [addon, rest.disabled]);

  return (
    <div className="input">
      {showLabel && <label htmlFor={id || label.toLowerCase().replace(' ', '-')}>{label}</label>}
      {description && <p className="input-description">{description}</p>}
      <div className="input-group">
        <div className="input-field">
          <input 
            id={id}
            {...(showLabel ? {} : { 'aria-label': label })}
            {...rest} 
            />
        </div>
        {addon && (
        <div className="input-addon">
          {addon}
        </div>
        )}
      </div>
      {helpText && (
      <Details summary={`${label} help`}>
        <div className="help-text">{helpText}</div>
      </Details>
      )}
    </div>
  );
}