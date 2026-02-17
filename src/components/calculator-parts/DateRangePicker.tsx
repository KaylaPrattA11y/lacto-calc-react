
import React from "react";
import { DateRangePicker as AriaDateRangePicker, Button, CalendarCell, CalendarGrid, DateInput, DateSegment, Dialog, Group, Heading, Label, Popover, RangeCalendar } from 'react-aria-components';
import {type DateValue} from '@internationalized/date';
import {type RangeValue} from 'react-aria';
import { HiChevronRight, HiChevronDown, HiChevronLeft } from "react-icons/hi";

export default function DateRangePicker({ onChange }: {onChange: (value: RangeValue<DateValue> | null) => void}) {
  return (
    <>
      <AriaDateRangePicker onChange={value => onChange(value)}>
        <Label>Ferment duration (optional)</Label>
        <Group>
          <DateInput slot="start">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <span aria-hidden="true">–</span>
          <DateInput slot="end">
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <Button><HiChevronDown size={28} /></Button>
        </Group>
        <Popover>
          <Dialog>
            <RangeCalendar>
              <header>
                <Button slot="previous"><HiChevronLeft size={24} /></Button>
                <Heading />
                <Button slot="next"><HiChevronRight size={24} /></Button>
              </header>
              <CalendarGrid>
                {(date) => <CalendarCell date={date} />}
              </CalendarGrid>
            </RangeCalendar>
          </Dialog>
        </Popover>
      </AriaDateRangePicker>
    </>
  );
}