"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const MonthCarousel = ({ months = [], selectedMonth, selectedYear }) => {
  // Ensure months is always an array
  const reversedMonths = Array.isArray(months) ? [...months].reverse() : [];
  const carouselRef = useRef(null);

  // Find the index of the selected month or default to the last month
  const getInitialIndex = () => {
    if (reversedMonths.length === 0) return 0; // Handle empty months
    if (selectedMonth) {
      const foundMonth = reversedMonths.find(
        (monthObj) => monthObj.month === selectedMonth && monthObj.year === Number(selectedYear)
      );
      return foundMonth ? reversedMonths.indexOf(foundMonth) : reversedMonths.length - 1;
    }
    return reversedMonths.length - 1; // Default to last month
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);

  const handlePrevious = () => {
    if (reversedMonths.length === 0) return; // Handle empty months
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    handleMonthSelect(reversedMonths[newIndex]);
  };

  const handleNext = () => {
    if (reversedMonths.length === 0) return; // Handle empty months
    const newIndex = Math.min(currentIndex + 1, reversedMonths.length - 1);
    setCurrentIndex(newIndex);
    handleMonthSelect(reversedMonths[newIndex]);
  };

  // Handle month selection and update URL
  const handleMonthSelect = (month) => {
    if (!month) return; // Handle empty months
    const url = new URL(window.location.href);
    url.searchParams.set("month", month.month); // Update the URL with the selected month
    url.searchParams.set("year", month.year); // Update the URL with the selected month
    window.history.pushState({}, "", url); // Update the URL without reloading the page
    window.location.reload();
  };

  useEffect(() => {
    const items = carouselRef.current?.querySelectorAll("[data-carousel-item]");
    if (items && items.length > 0 && currentIndex < items.length) {
      const currentItem = items[currentIndex];
      currentItem?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
  }, [currentIndex]);

  if (reversedMonths.length === 0) {
    return (
      <div className="text-center">
        <p>No months available</p>
      </div>
    );
  }

  return (
    <div>
      <Carousel ref={carouselRef}>
        <CarouselContent>
          {reversedMonths.map((monthObj, index) => (
            <CarouselItem key={index} data-carousel-item>
              <div>
                <Card>
                  <CardContent className="flex items-center justify-center p-1">
                    <span className="font-bold">{monthObj.month} {monthObj.year}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevious} disabled={currentIndex === 0} />
        <CarouselNext onClick={handleNext} disabled={currentIndex === reversedMonths.length - 1} />
      </Carousel>
    </div>
  );
};

export default MonthCarousel;
