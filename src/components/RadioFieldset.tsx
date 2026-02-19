import React from "react";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  subLabel?: string;
}

interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend: string;
  radios: RadioProps[];
  name?: string;
  showLegend?: boolean;
  children?: React.ReactNode;
  onChangeRadios?: React.ChangeEventHandler<HTMLInputElement>;
  orientation?: 'vertical' | 'horizontal';
}

export default function RadioFieldset({ legend, name, showLegend = true, children, radios, onChangeRadios, orientation = 'vertical', ...rest }: FieldsetProps) {
  const id = `legend-${crypto.randomUUID()}`;

  return (
    <fieldset {...rest}>
      <legend 
        id={id}
        className={showLegend ? undefined : "visually-hidden"}
      >
        {legend}
      </legend>
      <div 
        className={`radio-group is-${orientation}`} 
        role="radiogroup" 
        aria-orientation={orientation}
        aria-labelledby={id}
      >
        {radios.map((radioProps, index) => {
          const { label, subLabel, ...inputProps } = radioProps;
          return (
            <div key={index}>
              <input 
                type="radio"
                name={name}
                {...inputProps}
                onChange={onChangeRadios}
              />
              <label htmlFor={inputProps.id}>
                {label} {subLabel && <small className="sub-label">- {subLabel}</small>}
              </label>
            </div>
          );
        })}
      </div>
      {children}
    </fieldset>
  );
}