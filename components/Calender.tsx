'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  const [today, setToday] = useState(new Date());
  const [activeDay, setActiveDay] = useState<number | null>(null);
  // const [currentMonth, setActiveDay] = useState(null);
  const currentMonth = today.getMonth()
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

  return (
    <div className="flex">
      <div className="bg-white rounded-lg shadow-md h-[365px]">
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
        <div className="grid grid-cols-7 gap-1 p-2 w-[330px] h-[180px]">
          {/* Previous Month Days */}
          {Array.from({ length: firstWeekDay }).map((_, i) => (
            <div key={`prev-${i}`} className="text-gray-400 px-1 border">
              <p className="text-end text-[12px]">
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

            return (
              <div
                key={`current-${i}`}
                onClick={() => handleDayClick(day)}
                className={`px-1 cursor-pointer h-12 border ${
                  isToday && activeDay === day && currentMonth === month
                  ? "bg-green-500 text-white border-financeGradient"
                  :isToday
                    ? "border-green-500 bg-financeSidebar"
                    : activeDay === day 
                    ? "bg-financeGradient text-white"
                    : "text-gray-700 hover:bg-financeSidebar"
                }`}
              >
                <p className="text-end text-[12px]">
                  {day}
                </p>
                
              </div>
            );
          })}

          {/* Next Month Days */}
          {Array.from({ length: nextDays }).map((_, i) => (
            <div key={`next-${i}`} className="text-gray-400 text-center px-1 border">
              <p className="text-end text-[12px]">
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
