import React, { useEffect } from "react";
import { HiCheck } from "react-icons/hi";

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
            <div className="checkbox-wrapper">
              <input 
                type="checkbox"
                name={name}
                {...checkboxProps}
              />
              {checkboxProps.checked && <HiCheck color="var(--accent)" size="var(--radio-size)" />}
            </div>
            <label htmlFor={checkboxProps.id}>{checkboxProps.label}</label>
          </div>
        ))}
      </div>
      {children}
    </fieldset>
  );
}