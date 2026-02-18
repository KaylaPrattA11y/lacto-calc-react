const formatter = {
  number: new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }),
  date: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
  dateTime: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
  percent: new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 1 }),
  gram: new Intl.NumberFormat(undefined, { style: "unit", unit: "gram", compactDisplay: "short", maximumFractionDigits: 0 }),
  ounce: new Intl.NumberFormat(undefined, { style: "unit", unit: "ounce", compactDisplay: "short", maximumFractionDigits: 0 }),
  pound: new Intl.NumberFormat(undefined, { style: "unit", unit: "pound", compactDisplay: "short", maximumFractionDigits: 0 })
};

export function getFormattedVal(val: number, unit: string) : string {
  switch (unit) {
    case 'grams':
    case 'gram':
    case 'g':
      return formatter.gram.format(val)
    case 'ounces':
    case 'ounce':
    case 'oz':
      return formatter.ounce.format(val)
    case 'pounds':
    case 'pound':
    case 'lbs':
    case 'lb':
      return formatter.pound.format(val)
    default:
      return `${formatter.number.format(val)} ${unit}`;
  }
}

export { formatter };