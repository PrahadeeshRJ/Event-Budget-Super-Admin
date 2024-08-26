import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            " justify-between text-left font-normal rounded-[6px] border border-[#D4D4D8] ",
            !value && "text-muted-foreground"
          )}
        >
          
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-[#D4D4D8] rounded">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          className="bg-white rounded"
        />
      </PopoverContent>
    </Popover>
  );
}
