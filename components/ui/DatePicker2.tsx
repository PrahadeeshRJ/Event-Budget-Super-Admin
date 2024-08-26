import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X as ClearIcon, Eraser, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker1({ value, onChange }: DatePickerProps) {
  // Handler to clear the selected date
  const handleClearDate = () => {
    onChange(undefined); // Clear the date by passing undefined
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex w-[500px] justify-between text-left font-normal rounded-[6px]  border-[#D4D4D8] border",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center">
            {/* Display selected date or placeholder */}
            <span>{value ? format(value, "PP") : "Pick a date"}</span>
            
          </div>
          <div className="flex items-center">
          <Pencil width={18} className="mr-4"/>
          
            <div
              onClick={handleClearDate}
            >
              <Eraser width={18} />
            </div>
          
          </div>
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
