'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from '../../Pagination';
import { formatAmount } from '@/lib/utils';

export const GoalsTable = ({
  goals,
  page = 1,
  rowPerPage = 10,
  userCurrency = 0,
}) => {
  const rowsPerPage = rowPerPage;
  const totalPages = Math.ceil(goals.length / rowsPerPage);

  const indexOfLastGoal = page * rowsPerPage;
  const indexOfFirstGoal = indexOfLastGoal - rowsPerPage;

  const currentGoals = goals.slice(indexOfFirstGoal, indexOfLastGoal);
  return (
    <div className="space-y-4">
      <Table className="flex-col">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Date</TableHead>
            <TableHead>Actual Balance</TableHead>
            <TableHead>Virtual Balance</TableHead>
            <TableHead>Actual Saving</TableHead>
            <TableHead>Virtual Saving</TableHead>
            <TableHead>Actual Investing</TableHead>
            <TableHead>Virtual Investing</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentGoals.map((t) => {
            const convertedActualBalance = formatAmount(
              t.actualBalance,
              userCurrency,
            );
            const convertedVirtualBalance = formatAmount(
              t.virtualBalance,
              userCurrency,
            );
            const convertedActualSaving = formatAmount(
              t.actualSaving,
              userCurrency,
            );
            const convertedVirtualSaving = formatAmount(
              t.virtualSaving,
              userCurrency,
            );
            const convertedActualInvesting = formatAmount(
              t.actualInvesting,
              userCurrency,
            );
            const convertedVirtualInvesting = formatAmount(
              t.virtualInvesting,
              userCurrency,
            );
            return (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>

                <TableCell>{convertedActualBalance}</TableCell>

                <TableCell>{convertedVirtualBalance}</TableCell>

                <TableCell>{convertedActualSaving}</TableCell>

                <TableCell>{convertedVirtualSaving}</TableCell>

                <TableCell>{convertedActualInvesting}</TableCell>

                <TableCell>{convertedVirtualInvesting}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default GoalsTable;
