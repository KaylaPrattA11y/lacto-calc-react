import React, { useEffect } from "react";

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
  useEffect(() => {
  }, [rest.disabled]);

  return (
    <fieldset {...rest}>
      <legend className={showLegend ? undefined : "visually-hidden"}>{legend}</legend>
      <div className={`radio-group is-${orientation}`} role="group" aria-orientation={orientation}>
        {radios.map((radioProps, index) => (
          <div key={index}>
            <input 
              type="radio"
              name={name}
              {...radioProps}
              onChange={onChangeRadios}
            />
            <label htmlFor={radioProps.id}>
              {radioProps.label} {radioProps.subLabel && <small className="sub-label">- {radioProps.subLabel}</small>}
            </label>
          </div>
        ))}
      </div>
      {children}
    </fieldset>
  );
}