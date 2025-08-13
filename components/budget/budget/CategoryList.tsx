'use client';

import React, { useState, useEffect } from 'react';
import MonthCarousel from './MonthCarousel'; // adjust import if needed
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { create_JWT, getLoggedInUser } from '@/lib/actions/user.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { add_budget } from '@/lib/actions/budget.actions';
import { useToast } from '@/hooks/use-toast';
import { formatAmount } from '@/lib/utils';

interface BudgetEntry {
  $id?: string;
  category: string;
  budget: string;
  actual: string;
  date: string; // 'yyyy-mm'
  isNew?: boolean;
}

interface CategoryListProps {
  budget: [BudgetEntry[], string[]]; // [entries, months]
  categoryNames: [string, string][]; // Array of [name, id]
  userCurrency: number;
}

const CategoryList: React.FC<CategoryListProps> = ({
  budget,
  categoryNames,
  userCurrency,
}) => {
  const { toast } = useToast();
  const allEntriesRaw = budget[0];

  // Sort months ascending by yyyymm to find latest
  const sortedMonths = [...budget[1]].sort(
    (a, b) => Number(a.replace('-', '')) - Number(b.replace('-', '')),
  );
  const latestMonth = sortedMonths[sortedMonths.length - 1] || '';

  // For display, reverse so newest appears first in carousel
  const availableMonths = [...sortedMonths].reverse();

  // Select latest month by default
  const [selectedMonth, setSelectedMonth] = useState<string>(latestMonth);

  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [originalEntries, setOriginalEntries] = useState<BudgetEntry[]>([]);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    field: 'budget' | 'actual' | null;
  }>({ row: -1, field: null });
  const [isLoading, setIsLoading] = useState(false);

  // Set entries for selected month
  useEffect(() => {
    if (!selectedMonth) return;

    const filteredRaw = allEntriesRaw.filter((e) => e.date === selectedMonth);

    const normalized = filteredRaw.map((e) => ({
      $id: e.$id,
      category: e.category.trim(),
      budget: String(e.budget),
      actual: String(e.actual),
      date: e.date,
      isNew: false,
    }));

    setEntries(normalized);
    setOriginalEntries(normalized);
  }, [selectedMonth, allEntriesRaw]);

  const handleInputChange = (
    index: number,
    key: keyof BudgetEntry,
    value: string,
  ) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [key]: value };
    setEntries(updated);
  };

  const handleAddNewRow = () => {
    setEntries([
      ...entries,
      {
        category: categoryNames[0]?.[0] || '',
        budget: '',
        actual: '',
        date: selectedMonth,
        isNew: true,
      },
    ]);
  };

  const handleCellClick = (index: number, field: 'budget' | 'actual') => {
    setEditingCell({ row: index, field });
  };

  const handleBlurOrEnter = () => {
    setEditingCell({ row: -1, field: null });
  };

  const hasChanged = (original: BudgetEntry, updated: BudgetEntry) => {
    return (
      original.category.trim() !== updated.category.trim() ||
      Number(original.budget) !== Number(updated.budget) ||
      Number(original.actual) !== Number(updated.actual)
    );
  };

  const getChanges = (original: BudgetEntry, updated: BudgetEntry) => {
    const changes: Record<string, { from: any; to: any }> = {};
    if (original.category.trim() !== updated.category.trim()) {
      changes.category = { from: original.category, to: updated.category };
    }
    if (Number(original.budget) !== Number(updated.budget)) {
      changes.budget = { from: original.budget, to: updated.budget };
    }
    if (Number(original.actual) !== Number(updated.actual)) {
      changes.actual = { from: original.actual, to: updated.actual };
    }
    return Object.keys(changes).length > 0 ? changes : null;
  };

  const handleSave = async () => {
    setIsLoading(true);
    const loggedIn = await getLoggedInUser();
    try {
      let jwt = await get_jwt(loggedIn?.$id);

      if (await isJWTExpired(jwt)) {
        jwt = await create_JWT();
        await send_jwt(jwt);
        jwt = await get_jwt(loggedIn?.$id);
      }

      const changedEntries = entries.filter((entry) => {
        if (entry.isNew) return true;
        const original = originalEntries.find((e) => e.$id === entry.$id);
        return original ? hasChanged(original, entry) : true;
      });

      if (changedEntries.length === 0) {
        console.log('No changes to save.');
        setIsLoading(false);
        return;
      }

      changedEntries.forEach((entry) => {
        if (!entry.isNew) {
          const original = originalEntries.find((e) => e.$id === entry.$id);
          if (original) {
            console.log(
              `Changes for $id=${entry.$id}:`,
              getChanges(original, entry),
            );
          }
        } else {
          console.log('New entry to save:', entry);
        }
      });

      const payload = changedEntries.map(({ isNew, ...entry }) => ({
        ...entry,
        budget: Number(entry.budget),
        actual: Number(entry.actual),
      }));

      console.log('Payload to save:', payload);
      await add_budget(jwt, payload);

      toast({
        duration: 1000,
        variant: 'succes',
        title: 'Budget is send!',
        description: 'Your budget is being saved.',
      });
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        duration: 1000,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewMonth = () => {
    // Step 1: Get current month in yyyy-mm
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}`;

    console.log('Adding new month:', currentMonthStr);

    // Step 2: Only add if it's not already in the months list
    if (!budget[1].includes(currentMonthStr)) {
      budget[1].push(currentMonthStr); // add to months array
    }

    // Step 3: Set as selected so we can edit right away
    setSelectedMonth(currentMonthStr);
  };

  return (
    <div className="space-y-4">
      {/* New Month Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleAddNewMonth}
          className="bg-gray-50 border text-black"
        >
          + New Month
        </Button>
      </div>
      {/* Month Selector Carousel */}
      <MonthCarousel
        months={availableMonths}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-1/3">Category</TableHead>
            <TableHead className="w-1/3">Budget</TableHead>
            <TableHead className="w-1/3">Actual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => {
            const convertedBudget = formatAmount(
              Number(entry.budget),
              userCurrency,
            );
            const convertedActual = formatAmount(
              Number(entry.actual),
              userCurrency,
            );

            return (
              <TableRow key={entry.$id ?? `new-${index}`}>
                <TableCell>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={entry.category}
                    onChange={(e) =>
                      handleInputChange(index, 'category', e.target.value)
                    }
                  >
                    {categoryNames.map(([name, id]) => (
                      <option key={id} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </TableCell>

                {/* Budget Cell */}
                <TableCell
                  onClick={() => handleCellClick(index, 'budget')}
                  className="cursor-pointer"
                >
                  {editingCell.row === index &&
                  editingCell.field === 'budget' ? (
                    <input
                      type="number"
                      autoFocus
                      value={entry.budget}
                      onChange={(e) =>
                        handleInputChange(index, 'budget', e.target.value)
                      }
                      onBlur={handleBlurOrEnter}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBlurOrEnter();
                      }}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{convertedBudget}</span>
                  )}
                </TableCell>

                {/* Actual Cell */}
                <TableCell
                  onClick={() => handleCellClick(index, 'actual')}
                  className="cursor-pointer"
                >
                  {editingCell.row === index &&
                  editingCell.field === 'actual' ? (
                    <input
                      type="number"
                      autoFocus
                      value={entry.actual}
                      onChange={(e) =>
                        handleInputChange(index, 'actual', e.target.value)
                      }
                      onBlur={handleBlurOrEnter}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBlurOrEnter();
                      }}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <span>{convertedActual}</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Add New Row */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleAddNewRow}
          className="bg-gray-50 border text-black"
        >
          +
        </Button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gray-50 border text-black"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> &nbsp; Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CategoryList;
