"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  initialDateRange?: DateRange; // Optional initial date range
}

export function DatePicker({
  className,
  initialDateRange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialDateRange);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            aria-label="Select date range"
            className={cn(
              "w-[254px] justify-start text-left font-normal rounded border border-[#D4D4D8] ",
              !date && "text-muted-foreground"
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <>
                <span className="text-primary-text_primary mr-2">
                  <CalendarDays size={16} />
                </span>
                <span className="text-[#A1A1AA]">Select Date / Range</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border-[#A1A1AA] rounded" align="center">
          <Calendar
            // initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
