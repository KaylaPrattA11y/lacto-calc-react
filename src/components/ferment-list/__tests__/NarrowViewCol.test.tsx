import React from "react";
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import NarrowViewCol from '../NarrowViewCol';
import type { FermentEntry } from '../../../types';

describe('NarrowViewCol', () => {
  const baseFerment: FermentEntry = {
    id: 'test-1',
    weight: 1000,
    unit: 'grams',
    brinePercentage: 2.2,
    saltRequired: 22,
    dateCreated: new Date('2024-01-01'),
    status: 'Active',
    fermentName: 'Pickled Carrots',
    notes: 'Testing notes',
    dateStart: '2024-01-01',
    dateEnd: '2024-01-15',
    sendNotification: false,
    tags: ['vegetables', 'carrots']
  };

  it('renders ferment name when provided', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const nameElement = container.querySelector('strong');
    expect(nameElement?.textContent).toBe('Pickled Carrots');
  });

  it('displays status badge when status is provided', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const statusBadge = container.querySelector('.badge.is-active');
    expect(statusBadge?.textContent).toBe('Active');
  });

  it('displays notification badge when sendNotification is true and status is not Complete', () => {
    const ferment = { ...baseFerment, sendNotification: true, status: 'Active' as const };
    const { container } = render(<NarrowViewCol {...ferment} />);
    const notificationBadge = container.querySelector('.badge.is-info');
    expect(notificationBadge?.textContent).toContain('Notifications On');
  });

  it('does not display notification badge when status is Complete', () => {
    const ferment = { ...baseFerment, sendNotification: true, status: 'Complete' as const };
    const { container } = render(<NarrowViewCol {...ferment} />);
    const notificationBadge = container.querySelector('.badge.is-info');
    expect(notificationBadge).toBeNull();
  });

  it('displays salt brine percentage', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const text = container.textContent;
    expect(text).toContain('Salt brine:');
  });

  it('displays weight information', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const text = container.textContent;
    expect(text).toContain('Weight:');
  });

  it('displays salt required information', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const text = container.textContent;
    expect(text).toContain('Salt required:');
  });

  it('displays date range when dateStart and dateEnd are provided', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const text = container.textContent;
    // Check for date separator and duration text
    expect(text).toContain('-');
    expect(text).toContain('weeks');
  });

  it('displays notes in Details component when notes are provided', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const detailsSummary = container.querySelector('summary');
    expect(detailsSummary?.textContent).toBe('View notes');
  });

  it('does not display notes section when notes are not provided', () => {
    const fermentWithoutNotes = { ...baseFerment, notes: undefined };
    const { container } = render(<NarrowViewCol {...fermentWithoutNotes} />);
    const detailsSummary = container.querySelector('summary');
    expect(detailsSummary).toBeNull();
  });

  it('displays tags when provided', () => {
    const { container } = render(<NarrowViewCol {...baseFerment} />);
    const tags = container.querySelectorAll('.tag');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toBe('vegetables');
    expect(tags[1].textContent).toBe('carrots');
  });

  it('does not display tags section when tags array is empty', () => {
    const fermentWithoutTags = { ...baseFerment, tags: [] };
    const { container } = render(<NarrowViewCol {...fermentWithoutTags} />);
    const tagsList = container.querySelector('.tags');
    expect(tagsList).toBeNull();
  });

  it('does not display tags section when tags are undefined', () => {
    const fermentWithoutTags = { ...baseFerment, tags: undefined };
    const { container } = render(<NarrowViewCol {...fermentWithoutTags} />);
    const tagsList = container.querySelector('.tags');
    expect(tagsList).toBeNull();
  });

  it('renders with minimal required props', () => {
    const minimalFerment: FermentEntry = {
      id: 'test-minimal',
      weight: 500,
      unit: 'grams',
      brinePercentage: 3,
      saltRequired: 15,
      dateCreated: new Date('2024-01-01')
    };
    const { container } = render(<NarrowViewCol {...minimalFerment} />);
    expect(container.querySelector('.ferment-list--narrow-cell')).toBeTruthy();
  });

  it('displays remaining duration for active ferments', () => {
    // Create a ferment that ends in the future
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 7);
    
    const activeFerment = {
      ...baseFerment,
      dateStart: today.toISOString().split('T')[0],
      dateEnd: futureDate.toISOString().split('T')[0],
      status: 'Active' as const
    };
    
    const { container } = render(<NarrowViewCol {...activeFerment} />);
    const text = container.textContent;
    expect(text).toContain('Remaining:');
  });
});
