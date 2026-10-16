import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SimpleDropdown } from "@/components/ui/dropdown-menu";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [displayMonth, setDisplayMonth] = React.useState(() => 
    props.defaultMonth || new Date(2000, 0)
  );
  const [yearInput, setYearInput] = React.useState(() =>
    (props.defaultMonth || new Date(2000, 0)).getFullYear().toString()
  );
  const yearInputRef = React.useRef<HTMLInputElement>(null);
  const currentYear = new Date().getFullYear();
  const minYear = 0;
  const maxYear = currentYear + 10;
  const clampYear = (year: number) => Math.min(Math.max(year, minYear), maxYear);
  const applyYearToCalendar = (year: number) => {
    const safeYear = clampYear(year);
    if (safeYear === displayMonth.getFullYear()) return;
    const newDate = new Date(safeYear, displayMonth.getMonth(), 1);
    handleMonthChange(newDate);
  };
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Update display month when props.month changes
  React.useEffect(() => {
    if (props.month) {
      setDisplayMonth(props.month);
    }
  }, [props.month]);

  // Update display month when props change
  React.useEffect(() => {
    if (props.defaultMonth) {
      setDisplayMonth(props.defaultMonth);
    }
  }, [props.defaultMonth]);

  React.useEffect(() => {
    setYearInput(displayMonth.getFullYear().toString());
  }, [displayMonth]);

  const handleMonthChange = (newDate: Date) => {
    setDisplayMonth(newDate);
    props.onMonthChange?.(newDate);
  };

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^\d]/g, "");
    console.log("Year input changed to:", digits);
    setYearInput(digits);
    // Auto-focus after state update
    requestAnimationFrame(() => {
      yearInputRef.current?.focus();
    });
  };

  const handleYearInputBlur = () => {
    const parsed = parseInt(yearInput, 10);
    const fallback = displayMonth.getFullYear();
    const safeYear = isNaN(parsed) ? fallback : clampYear(parsed);
    setYearInput(safeYear.toString());
    applyYearToCalendar(safeYear);
  };

  const handleYearInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const incrementYear = () => {
    applyYearToCalendar(displayMonth.getFullYear() + 1);
  };

  const decrementYear = () => {
    applyYearToCalendar(displayMonth.getFullYear() - 1);
  };

  const monthOptions = months.map((month, index) => ({
    label: month,
    value: index
  }));

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={displayMonth}
      onMonthChange={handleMonthChange}
      className={cn("p-4 bg-black/25 backdrop-blur-sm rounded-2xl border border-white/20", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-white/10 p-0 text-white/80 hover:bg-white/20 hover:text-white border border-white/20 rounded-lg transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-white/70 rounded-md flex-1 font-normal text-[0.8rem] text-center min-w-0",
        row: "flex w-full mt-1",
        cell: "flex-1 h-9 text-center text-sm p-0 relative min-w-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/10 [&:has([aria-selected])]:transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-full p-0 font-normal text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors focus:bg-white/20 focus:text-white aria-selected:opacity-100 min-w-0"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-[#DED8D4CC] text-black hover:bg-[#DED8D4] hover:text-black focus:bg-[#DED8D4] focus:text-black font-medium",
        day_today: "bg-white/20 text-white font-medium",
        day_outside: "day-outside text-white/40 opacity-50 aria-selected:bg-white/10 aria-selected:text-white/60 aria-selected:opacity-30",
        day_disabled: "text-white/30 opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-white/10 aria-selected:text-white/80",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: () => {
          const handleMonthSelect = (value: string | number) => {
            const newMonth = typeof value === "string" ? parseInt(value, 10) : value;
            const newDate = new Date(displayMonth.getFullYear(), newMonth, 1);
            handleMonthChange(newDate);
          };

          return (
            <div className="flex items-center justify-center gap-3 relative w-full">
              <div className="flex items-center gap-3">
                {/* Month Dropdown */}
                <SimpleDropdown
                  variant="glass"
                  value={displayMonth.getMonth()}
                  onValueChange={handleMonthSelect}
                  options={monthOptions}
                  className="min-w-[120px]"
                />
                <div className="flex items-center bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/15">
                  <input
                    ref={yearInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    aria-label="Year"
                    value={yearInput}
                    onChange={handleYearInputChange}
                    onBlur={handleYearInputBlur}
                    onKeyDown={handleYearInputKeyDown}
                    className="bg-transparent px-3 py-2 !text-white placeholder:text-white/60 text-sm font-medium w-20 focus:outline-none focus:ring-1 focus:ring-[#DED8D4] rounded-l-lg"
                  />
                  <div className="flex flex-col border-l border-white/20">
                    <button
                      type="button"
                      onClick={incrementYear}
                      disabled={displayMonth.getFullYear() >= maxYear}
                      className="px-2 py-[3px] text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-tr-lg"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={decrementYear}
                      disabled={displayMonth.getFullYear() <= minYear}
                      className="px-2 py-[3px] text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-br-lg"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
