'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const Calendar = ({ summaries, currency }) => {
  const [today, setToday] = useState(new Date());
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const currentMonth = today.getMonth();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const firstWeekDay = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  const changeMonth = (direction: number) => {
    const newMonth = month + direction;
    if (newMonth < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (newMonth > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(newMonth);
    }
  };

  const handleDayClick = (day: number) => {
    setActiveDay(day);
  };

  useEffect(() => {
    setActiveDay(today.getDate());
  }, [today]);

  // Filter summaries for the current month and year
  const filteredSummaries = summaries.filter((summary) => {
    const summaryDate = new Date(summary.date);
    return summaryDate.getMonth() === month && summaryDate.getFullYear() === year;
  });

  // Summing up the amounts for each day
  const summedAmounts = filteredSummaries.reduce((acc, summary) => {
    const { day, amount } = summary;
    const amountValue = parseFloat(amount);
    
    // Accumulate the amount for each day
    if (!acc[day]) {
      acc[day] = 0;
    }

    acc[day] += amountValue;

    return acc;
  }, {});

  const formatAmount = (amount) => {
    if (currency === 1) {
      // Format with thousands separator for currency 1
      return Math.abs(amount)
        .toFixed(0) // Remove decimals if no fractional value is needed
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add period as thousand separator
    }

    // For other currencies, format with two decimals and replace the dot with a comma
    return Math.abs(amount)
      .toFixed(2) // Ensure two decimals
      .replace('.', ',') // Replace dot with comma
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add period as thousand separator
  };

  return (
    <div className="flex-col">
      <div className="bg-white rounded-lg shadow-md">
        {/* Month Navigation */}
        <div className="flex justify-between items-center bg-gray-600 text-white px-4 py-2 rounded-t-lg">
          <Button
            onClick={() => changeMonth(-1)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-600"
          >
            <ChevronsLeft />
          </Button>
          <div className="text-lg font-semibold">
            {months[month]} {year}
          </div>
          <Button
            onClick={() => changeMonth(1)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-600"
          >
            <ChevronsRight />
          </Button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-semibold text-gray-700 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {/* Previous Month Days */}
          {Array.from({ length: firstWeekDay }).map((_, i) => (
            <div key={`prev-${i}`} className="text-gray-400 px-1">
              <p className="text-center text-[12px]">
                {prevDays - firstWeekDay + i + 1}
              </p>
            </div>
          ))}

          {/* Current Month Days */}
          {Array.from({ length: lastDate }).map((_, i) => {
            const day = i + 1;
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;
            const summedAmount = summedAmounts[day] || 0; // Get the summed amount for the day

            // Determine if the amount is positive or negative
            const isPositive = summedAmount >= 0;

            // Get the formatted amount
            const displayAmount = formatAmount(summedAmount);

            return (
              <div
                key={`current-${i}`}
                onClick={() => handleDayClick(day)}
                className={`px-1 cursor-pointer h-12 ${
                  isToday && activeDay === day && currentMonth === month
                    ? "bg-financeSidebar border border-financeGradient text-gray-700"
                    : isToday
                    ? "border border-financeGradient"
                    : activeDay === day
                    ? "bg-financeSidebar text-gray-700"
                    : "text-gray-700 hover:bg-financeSidebar"
                }`}
              >
                <p className="text-center text-[12px]">
                  {day}
                </p>
                {/* Only show sum if it is non-zero */}
                {summedAmount !== 0 && (
                  <div
                    className={`text-[12px] text-center mt-1 ${
                      isPositive ? "text-green-600" : "text-red-600"  // Green for positive, Red for negative
                    }`}
                  >
                    {displayAmount}
                  </div>
                )}
              </div>
            );
          })}

          {/* Next Month Days */}
          {Array.from({ length: nextDays }).map((_, i) => (
            <div key={`next-${i}`} className="text-gray-400 text-center px-1">
              <p className="text-center text-[12px]">
                {i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
