import React, { useRef, useState, useMemo, useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import Input from '../Input';
import RadioFieldset from "../RadioFieldset";
import CheckboxFieldset from "../CheckboxFieldset";
import DateRangePicker from "./DateRangePicker";
import { type DateValue } from '@internationalized/date';
import { type RangeValue } from 'react-aria';
import { type FermentEntry } from "../../types";
import Details from "../Details";
import { getDuration, getFermentStatus } from "../../utils/time";
import { toast } from "react-toastify";
import Tagger from "../Tagger";

type PresetUnit = 'grams' | 'ounces' | 'other';

export default function Calculator() {
  const formRef = useRef<HTMLFormElement|null>(null);
  const [weight, setWeight] = useState<number|null>(null);
  const [presetUnit, setPresetUnit] = useState<PresetUnit>('grams');
  const [customUnit, setCustomUnit] = useState<string>('');
  const [brinePercentage, setBrinePercentage] = useState<number|null>(null);
  const [saltRequired, setSaltRequired] = useState<number|null>(null);
  const [fermentName, setFermentName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [fermentDateRange, setFermentDateRange] = useState<RangeValue<DateValue>|null>(null);
  const [sendNotification, setFermentNotification] = useState<boolean>(false);
  const [fermentTags, setFermentTags] = useState<Set<string>>(new Set());
  const [taggerKey, setTaggerKey] = useState<number>(0);
  // Removed localData state; only use localStorage for persistence

  // Derive unit from presetUnit and customUnit
  const unit = useMemo(() => {
    return presetUnit === 'other' ? customUnit : presetUnit;
  }, [presetUnit, customUnit]);

  const saltWeightFormatted = useMemo(() => {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(saltRequired || 0);
  }, [presetUnit, customUnit, saltRequired]);

  const { dateStart, dateEnd } = useMemo(() => {
    return{
      dateStart: fermentDateRange?.start ? dateToStr(fermentDateRange.start) : undefined,
      dateEnd: fermentDateRange?.end ? dateToStr(fermentDateRange.end) : undefined
    }
  }, [fermentDateRange]);

  useEffect(() => {
    const salt = (Number(weight || 0) * Number(brinePercentage || 0)) / 100;
    setSaltRequired(salt);
  }, [weight, brinePercentage]);

  function dateToStr(date: DateValue | null) {
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  function handleChangePresetUnit(value: PresetUnit) {
    setPresetUnit(value);
    if (value !== 'other') {
      setCustomUnit('');
    }
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const stored = localStorage.getItem('fermentData');
    const parsed: FermentEntry[] = stored ? JSON.parse(stored) : [];
    const newData = [
      ...parsed,
      {
        id: crypto.randomUUID(),
        weight: weight || 0,
        unit,
        brinePercentage: brinePercentage || 0,
        saltRequired: saltRequired || 0,
        fermentName,
        notes,
        status: getFermentStatus(dateStart, dateEnd),
        dateStart,
        dateEnd,
        sendNotification,
        tags: [...fermentTags]
      }
    ];
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('fermentData', JSON.stringify(newData));
      window.dispatchEvent(new Event('fermentDataUpdated'));
    }
    toast.success('Ferment added successfully!');
  }

  function handleReset() {
    setWeight(null);
    setBrinePercentage(null);
    setSaltRequired(null);
    setFermentName('');
    setNotes('');
    setFermentDateRange(null);
    setFermentNotification(false);
    setFermentTags(new Set());
    setTaggerKey(prev => prev + 1);
  }

  return (
    <form ref={formRef} onSubmit={e => handleSubmit(e)} onReset={handleReset} className="calculator">
      <div className="calculator-grid">
        <div className="grid-brine">
          <Input 
            label="Salt brine" 
            id="brine-percentage" 
            addon="%" 
            name="brinePercentage" 
            type="number" 
            step="0.1" 
            value={String(brinePercentage || '')}
            onChange={e => {
              const raw = e.currentTarget.value;
              const v = raw === '' ? null : parseFloat(raw);
              setBrinePercentage(Number.isNaN(v as number) ? null : (v as number));
            }}
            min={2} 
            max={10} 
            list="suggestions" 
            required
            helpText={<p>The percentage of salt relative to the total weight. For example, if you want to use a 2% salt brine, enter 2. Common salt percentages for fermentation range from 2% to 10%, with 2-3% being common for vegetables and up to 5-6% for fish or meat.</p>}
          />
          <datalist id="suggestions">
            <option value="2" label="Green beans, cauliflower, potatoes, tomatoes" />
            <option value="2.2" label="Beets, broccoli, cabbage, carrots" />
            <option value="3" label="Cucumbers, garlic, okra" />
            <option value="4" label="Peppers (spicy/sweet)" />
            <option value="5" label="Onions, radishes" />
            <option value="10" label="Olives" />
          </datalist>
        </div>
        <fieldset className="grid-salt">
          <legend className="visually-hidden">Calculate salt using:</legend>
          <div className="salt-calc-grid">
            <div>
              <Input 
                label="Weight" 
                id="weight"
                name="weight" 
                type="number"
                step="0.01"
                value={String(weight || '')}
                onChange={e => {
                  const raw = e.currentTarget.value;
                  const v = raw === '' ? null : parseFloat(raw);
                  setWeight(Number.isNaN(v as number) ? null : (v as number));
                }}
                required
                helpText={<p>The <em>combined weight</em> of the food and water being fermented in {unit}. For example, if you are fermenting 500 {unit} of vegetables and 500 {unit} of brine, the total weight would be 1,000 {unit}.</p>}
              />
            </div>
            <div>
              <RadioFieldset 
                legend="Unit" 
                name="presetUnit"
                radios={[
                  {
                    label: "Grams",
                    id:"grams",
                    value:"grams",
                    checked:presetUnit === 'grams',
                    onChange:() => handleChangePresetUnit('grams')
                  },
                  {
                    label: "Ounces",
                    id: "ounces",
                    value: "ounces",
                    checked:presetUnit === 'ounces',
                    onChange:() => handleChangePresetUnit('ounces')
                  },
                  {
                    label: "Other",
                    id: "other",
                    value: "other",
                    checked:presetUnit === 'other',
                    onChange:() => handleChangePresetUnit('other')
                  }
                ]}
              >
              {presetUnit === 'other' ? (
                <Input 
                  label="Custom presetUnit" 
                  showLabel={false}
                  id="presetUnit"
                  name="presetUnit" 
                  type="text"
                  onChange={e => setCustomUnit(e.currentTarget.value)}
                  required
                />
                ) : undefined 
              }
              </RadioFieldset>
            </div>
          </div>
        </fieldset>
        <div className="grid-fname">
          <Input 
            label="Ferment name (optional)" 
            id="ferment-name"
            name="fermentName" 
            value={fermentName}
            onChange={e => {
              const v = e.currentTarget.value;
              setFermentName(v);
            }}
            type="text"
          />
        </div>
        <div className="grid-fDate">
          <DateRangePicker onChange={value => setFermentDateRange(value)}/>
          {fermentDateRange && dateStart && dateEnd && (
            <div>Duration: {getDuration(dateStart, dateEnd)}</div>
          )}
          {fermentDateRange && import.meta.env.DEV && (
          <CheckboxFieldset 
            legend="Fermentation completion reminder" 
            showLegend={false}
            checkboxes={[
              {
                label: "Send a notification when this ferment is complete",
                id: "sendNotification",
                name: "sendNotification",
                value: "true",
                onChange: (e) => setFermentNotification(e.currentTarget.checked),
                checked: sendNotification
              }
            ]}
          />
          )}
        </div>
        <div className="grid-fNotes">
          <div>
            <label htmlFor="ferment-notes">Ferment notes (optional)</label>
            <textarea 
              name="notes" 
              id="ferment-notes"
              value={notes}
              maxLength={500}
              onChange={e => {
                const v = e.currentTarget.value;
                setNotes(v);
              }}
              rows={4}></textarea>
          </div>
          <div>
            <Tagger
             key={taggerKey}
             label="Tags (optional)" 
             id="tags" 
             name="tags"
             onChangeTags={setFermentTags}
            />
          </div>
        </div>
        <div className="grid-output">
          <div className="calculator-output">
            <img src="/mason-jar.png" alt="" aria-hidden="true" />
            {saltRequired != null && saltRequired > 0 ? (
            <div>
              <div>
                <output htmlFor="weight brine-percentage" id="salt-required">{saltWeightFormatted}</output>
                <div>{unit} salt required</div>
                <Details summary="What now?">
                  <p>Add the salt to your vegetables/fruits that are submerged in water in your fermenting vessel.</p>
                  <p>Close the lid tight and give it a good shake to distribute the salt evenly, then loosen the lid or add your airlock.</p>
                </Details>
              </div>
              <div className="calculator-submit">
                <button type="submit" className="is-primary"><HiPlus size={16} /> Add ferment</button>
                <button type="reset" className="is-tertiary">Reset</button>
              </div>
            </div>
            ) : (
            <div>
              <p>Please enter <strong>Salt brine</strong> percentage and <strong>Weight</strong> to calculate salt required.</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}