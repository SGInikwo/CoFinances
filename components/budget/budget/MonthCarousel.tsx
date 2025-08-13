// @ts-nocheck
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import clsx from 'clsx';

interface MonthCarouselProps {
  months: string[]; // Format: ['2025-08', '2025-07', ...]
  selectedMonth: string;
  onMonthChange: (value: string) => void;
}

const formatMonthYear = (value: string) => {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(year, (month || 1) - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const toYyyymmNumber = (value: string) => {
  const [year, month] = value.split('-').map(Number);
  // Defensive: if month missing or NaN, treat as 0
  return (year || 0) * 100 + (Number.isFinite(month) ? month : 0);
};

const MonthCarousel: React.FC<MonthCarouselProps> = ({
  months,
  selectedMonth,
  onMonthChange,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Sort months by numeric yyyymm (ascending: 202412, 202506, ...)
  const sortedMonths = useMemo(
    () =>
      [...(months || [])].sort((a, b) => toYyyymmNumber(a) - toYyyymmNumber(b)),
    [months],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Keep currentIndex synced when selectedMonth or sortedMonths change
  useEffect(() => {
    if (!sortedMonths || sortedMonths.length === 0) {
      setCurrentIndex(0);
      return;
    }
    const newIndex = sortedMonths.findIndex((m) => m === selectedMonth);
    setCurrentIndex(newIndex >= 0 ? newIndex : 0);
  }, [selectedMonth, sortedMonths]);

  // Ensure currentIndex is within bounds if sortedMonths length changes
  useEffect(() => {
    if (currentIndex >= sortedMonths.length) {
      setCurrentIndex(
        sortedMonths.length - 1 >= 0 ? sortedMonths.length - 1 : 0,
      );
    }
  }, [sortedMonths.length, currentIndex]);

  // Scroll the selected item into view whenever currentIndex changes
  useEffect(() => {
    if (!contentRef.current || currentIndex === -1) return;
    const child = contentRef.current.children[currentIndex] as
      | HTMLElement
      | undefined;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [currentIndex, sortedMonths]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onMonthChange(sortedMonths[newIndex]);
    }
  };

  const handleNext = () => {
    if (currentIndex < sortedMonths.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onMonthChange(sortedMonths[newIndex]);
    }
  };

  if (!sortedMonths || sortedMonths.length === 0) {
    return <div className="text-center">No months available</div>;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Carousel>
        <CarouselPrevious
          onClick={handlePrevious}
          disabled={currentIndex <= 0}
        />
        <CarouselContent
          ref={contentRef}
          className="hide-scrollbar flex overflow-x-auto scrollbar-none pl-12 pr-12"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {sortedMonths.map((monthStr, index) => (
            <CarouselItem
              key={monthStr}
              onClick={() => {
                setCurrentIndex(index);
                onMonthChange(monthStr);
              }}
              className={clsx(
                'flex shrink-0 cursor-pointer rounded-xl px-6 py-2 select-none transition',
                'justify-center items-center text-center',
                index === currentIndex
                  ? 'bg-financeGradient text-white shadow-lg'
                  : 'bg-white hover:bg-gray-100',
                'scroll-snap-align-center',
              )}
            >
              {formatMonthYear(monthStr)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext
          onClick={handleNext}
          disabled={currentIndex >= sortedMonths.length - 1}
        />
      </Carousel>
    </div>
  );
};

export default MonthCarousel;
