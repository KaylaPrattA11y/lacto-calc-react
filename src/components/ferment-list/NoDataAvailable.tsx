import React from "react";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { default as syntaxTheme } from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import { 
  HiOutlineUpload, 
} from "react-icons/hi";
import { 
  type SetFermentData, 
} from "../../types";
import importFermentEntries from "../../utils/importFermentEntries";

export default function NoDataAvailable({setData}: {setData: SetFermentData}) {
  return (
    <div className="ferment-list--nodata">
      <h3>Save your first ferment</h3>
      <p>Save your ferment data by importing a JSON file. You can get one by exporting from the Calculator tool.</p>
      <button 
        type="button" 
        className="is-primary"
        onClick={() => importFermentEntries(setData)}
      >
        <HiOutlineUpload size={18} /> Import (.json)
      </button>
      <h4>Manual import</h4>
      <p>If you wish to create a JSON file manually, you can use any text editor to write the JSON data following the format used by this app:</p>
      <h5>Example JSON format:</h5>
<SyntaxHighlighter 
  language="json" 
  style={syntaxTheme} 
  wrapLines={true} 
  wrapLongLines={true} 
  showLineNumbers={true}
  customStyle={{
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowX: 'auto',
    background: 'var(--border-color)',
    padding: '1rem',
    borderRadius: '6px'
  }}
>
{`[
  {
    "id": "UNIQUE_ID_123",
    "weight": 123,
    "unit": "grams",
    "brinePercentage": 2.2,
    "saltRequired": 321,
    "dateCreated": "2024-01-01T12:00:00.000Z",
    "fermentName": "Pickled Radishes",
    "notes": "Tangy and delicious!",
    "tags": ["vegetables", "quick"],
    "status": "Planned",
    "dateStart": "2024-01-01",
    "dateEnd": "2024-01-10",
    "sendNotification": true
  }
]`}
</SyntaxHighlighter>
<h5>TypeScript type definition:</h5>
<SyntaxHighlighter 
  language="typescript" 
  style={syntaxTheme} 
  wrapLines={true} 
  wrapLongLines={true}
  customStyle={{
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowX: 'auto',
    background: 'var(--border-color)',
    padding: '1rem',
    borderRadius: '6px'
  }}
>
{`type FermentEntry = {
  id: string;
  weight: number;
  unit: string;
  brinePercentage: number;
  saltRequired: number;
  dateCreated: Date;
  fermentName?: string;
  notes?: string;
  tags?: string[];
  status?: 'Planned' | 'Active' | 'Complete' | undefined;
  sendNotification?: boolean;
  dateStart?: string;
  dateEnd?: string;
}`}
</SyntaxHighlighter>
  </div>
  );
}