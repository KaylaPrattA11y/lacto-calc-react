import React from "react";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act, } from '@testing-library/react';
import FermentList from '../FermentList';
import type { FermentEntry } from "../../../types";

vi.mock('node:fs');

describe('NoDataAvailable', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.removeItem("fermentData");
  });

  it('renders a <NoDataAvailable /> layout when there is no ferment data', () => {
    // localStorage is empty, so no data exists
    const { container } = render(<FermentList />);
    const contextEl = container.querySelector('.ferment-list--nodata');

    expect(contextEl).toBeInTheDocument();
    if (contextEl) {
      expect(contextEl.querySelector(':scope > h3')).toBeInTheDocument();
      expect(contextEl.querySelector(':scope > h3')).toHaveTextContent('Save your first ferment');
      expect(contextEl.querySelector(':scope > h4')).toBeInTheDocument();
      expect(contextEl.querySelector(':scope > h4')).toHaveTextContent('Manual import');
      
      // Check both h5 elements
      const h5Elements = contextEl.querySelectorAll(':scope > h5');
      expect(h5Elements).toHaveLength(2);
      expect(h5Elements[0]).toHaveTextContent('Example JSON format:');
      expect(h5Elements[1]).toHaveTextContent('TypeScript type definition:');
      
      expect(contextEl.querySelector(':scope > pre > code.language-json')).toBeInTheDocument();
      expect(contextEl.querySelector(':scope > pre > code.language-typescript')).toBeInTheDocument();
    }
  });

  it('allows importing of ferment data', async () => {
    // Mock FileReader before rendering the component
    const mockReadAsText = vi.fn();
    const mockFileReaderInstance = {
      readAsText: mockReadAsText,
      onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
      result: null as string | null,
    };

    // Mock the FileReader constructor
    (globalThis as Record<string, unknown>).FileReader = vi.fn(function(this: typeof mockFileReaderInstance) {
      return mockFileReaderInstance;
    });

    const { container } = render(<FermentList />);
    const importedFermentEntries = [
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
    ] as FermentEntry[];
    
    // Create a mock File object with JSON content
    const mockFile = new File(
      [JSON.stringify(importedFermentEntries)], 
      'mock-ferment-data.json', 
      { type: 'application/json' }
    );

    // Click the Import button to set up the file input's onchange handler
    const importButton = screen.getByRole('button', { name: /import/i });
    fireEvent.click(importButton);

    // Get the file input element
    expect(container.querySelector('[data-testid="file-input"]')).toBeInTheDocument();
    const fileInput = screen.getByTestId('file-input');

    // Simulate file selection by firing the 'change' event
    fireEvent.change(fileInput, { 
      target: { 
        files: [mockFile] 
      } as unknown as EventTarget
    }); 

    // Verify readAsText was called with the mock file
    expect(mockReadAsText).toHaveBeenCalledWith(mockFile);

    // Manually trigger the 'onload' event to simulate the read completion
    mockFileReaderInstance.result = JSON.stringify(importedFermentEntries);
    
    // Call the onload handler that was set by the component
    await act(async () => {
      if (mockFileReaderInstance.onload) {
        const mockEvent = {
          target: { result: JSON.stringify(importedFermentEntries) }
        } as ProgressEvent<FileReader>;
        mockFileReaderInstance.onload(mockEvent);
      }
    });

    // Verify the data was stored in localStorage
    const storedData = localStorage.getItem('fermentData');
    expect(storedData).toBeTruthy();
    expect(JSON.parse(storedData!)).toEqual(importedFermentEntries);
  });

});
