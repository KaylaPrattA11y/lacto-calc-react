import React, { useEffect } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: string;
  checkboxes: CheckboxProps[];
  name?: string;
  showLegend?: boolean;
  children?: React.ReactNode;
}

export default function CheckboxFieldset({ legend, name, showLegend = true, children, checkboxes, ...rest }: FieldsetProps) {
  useEffect(() => {
    
  }, [rest.disabled]);

  return (
    <fieldset {...rest}>
      <legend className={showLegend ? undefined : "visually-hidden"}>{legend}</legend>
      <div className="radio-group">
        {checkboxes.map((checkboxProps, index) => (
          <div key={index}>
            <input 
              type="checkbox"
              name={name}
              {...checkboxProps}
            />
            <label htmlFor={checkboxProps.id}>{checkboxProps.label}</label>
          </div>
        ))}
      </div>
      {children}
    </fieldset>
  );
}