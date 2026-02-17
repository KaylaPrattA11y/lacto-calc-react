import React, { useEffect } from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: string;
  radios: RadioProps[];
  name?: string;
  showLegend?: boolean;
  children?: React.ReactNode;
}

export default function RadioFieldset({ legend, name, showLegend = true, children, radios, ...rest }: FieldsetProps) {
  useEffect(() => {
    
  }, [rest.disabled]);

  return (
    <fieldset {...rest}>
      <legend className={showLegend ? undefined : "visually-hidden"}>{legend}</legend>
      <div className="radio-group">
        {radios.map((radioProps, index) => (
          <div key={index}>
            <input 
              type="radio"
              name={name}
              {...radioProps}
            />
            <label htmlFor={radioProps.id}>{radioProps.label}</label>
          </div>
        ))}
      </div>
      {children}
    </fieldset>
  );
}