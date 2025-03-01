'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';

interface DateRange {
  startDate: string;
  endDate: string;
}

const DATE_FORMAT_OPTIONS = {
  month: 'short' as const,
  day: 'numeric' as const,
  year: 'numeric' as const
};

export default function DateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return {
      month: today.getMonth(),
      year: today.getFullYear()
    };
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateUrl = useCallback((range: DateRange) => {
    const params = new URLSearchParams();
    if (range.startDate) params.set('startDate', range.startDate);
    if (range.endDate) params.set('endDate', range.endDate);
    router.push(`/gallery${params.toString() ? `?${params.toString()}` : ''}`);
  }, [router]);

  const clearSelection = () => {
    setSelectedRange({ startDate: '', endDate: '' });
    router.push('/gallery');
    setIsOpen(false);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (dateString: string) => {
    if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
      setSelectedRange({
        startDate: dateString,
        endDate: ''
      });
    } else {
      const start = new Date(selectedRange.startDate);
      const end = new Date(dateString);
      
      setSelectedRange({
        startDate: start <= end ? selectedRange.startDate : dateString,
        endDate: start <= end ? dateString : selectedRange.startDate
      });
    }
  };

  useEffect(() => {
    if (selectedRange.startDate && selectedRange.endDate) {
      updateUrl(selectedRange);
    }
  }, [selectedRange, updateUrl]);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
    const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(currentMonth.year, currentMonth.month, day);
      const isSelected = (selectedRange.startDate && dateString === selectedRange.startDate) ||
                        (selectedRange.endDate && dateString === selectedRange.endDate);
      const isInRange = selectedRange.startDate && selectedRange.endDate &&
                       dateString > selectedRange.startDate && dateString < selectedRange.endDate;
      const isToday = dateString === new Date().toISOString().split('T')[0];

      days.push(
        <button
          key={dateString}
          onClick={() => handleDateClick(dateString)}
          className={`
            h-9 w-9 rounded-full text-sm relative flex items-center justify-center
            transition-all duration-200
            ${isSelected 
              ? 'bg-blue-500 text-white dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600' 
              : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}
            ${isInRange 
              ? 'bg-blue-50 dark:bg-blue-900/20' 
              : ''}
            ${isToday && !isSelected 
              ? 'border border-blue-500' 
              : ''}
            dark:text-gray-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const navigateMonth = (delta: number) => {
    setCurrentMonth(prev => {
      const nextMonth = prev.month + delta;
      return {
        year: prev.year + Math.floor(nextMonth / 12),
        month: ((nextMonth % 12) + 12) % 12
      };
    });
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
          ${selectedRange.startDate || selectedRange.endDate
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          dark:text-gray-200
        `}
      >
        {selectedRange.startDate || selectedRange.endDate ? (
          <>
            {selectedRange.startDate ? formatDisplayDate(selectedRange.startDate) : ''}
            {selectedRange.endDate ? ` - ${formatDisplayDate(selectedRange.endDate)}` : ' (Selecting end date)'}
          </>
        ) : (
          'Select Dates'
        )}
      </button>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[320px]">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              ‹
            </button>
            <span className="font-medium dark:text-gray-200">
              {new Date(currentMonth.year, currentMonth.month).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="h-9 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <button
              onClick={clearSelection}
              className={`text-sm font-medium px-3 py-1.5 rounded transition-colors
                ${selectedRange.startDate || selectedRange.endDate
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
              disabled={!selectedRange.startDate && !selectedRange.endDate}
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}