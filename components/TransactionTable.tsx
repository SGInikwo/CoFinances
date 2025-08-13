'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatAmount } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pagination } from './Pagination';
import { Loader2 } from 'lucide-react';
import { update_category } from '@/lib/actions/transaction.actions';
import { getLoggedInUser, create_JWT } from '@/lib/actions/user.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface Category {
  name: string;
  colour: string;
  $id: string;
}

interface Transaction {
  $id: string;
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  userCurrency: string;
  transactionType: string;
  categoryId: Category;
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currency: number;
  page: number;
  rowPerPage: number;
  editable?: boolean;
  categoryOptions?: [string, string][];
}

export const TransactionTable = ({
  transactions,
  currency,
  page = 1,
  rowPerPage = 10,
  editable = false,
  categoryOptions = [],
}: TransactionTableProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<
    Transaction[]
  >([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const rowsPerPage = rowPerPage;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = editableTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction,
  );

  useEffect(() => {
    setEditableTransactions(transactions);
  }, [transactions]);

  const handleCategoryChange = (pageIndex: number, categoryId: string) => {
    const selectedCategory = categoryOptions.find(
      ([name, id]) => id === categoryId,
    );
    if (!selectedCategory) return;

    const [name, id] = selectedCategory;
    const globalIndex = indexOfFirstTransaction + pageIndex;

    const updated = [...editableTransactions];
    const original = transactions.find(
      (t) => t.$id === updated[globalIndex].$id,
    );

    // Check if the category changed compared to the original
    const isChanged = original && id !== original.categoryId.$id;

    updated[globalIndex] = {
      ...updated[globalIndex],
      categoryId: {
        ...updated[globalIndex].categoryId,
        $id: id,
        name: name,
        colour: isChanged
          ? '#f97316'
          : original?.categoryId.colour || '#000000', // Orange if changed, else original colour
      },
    };

    setEditableTransactions(updated);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const loggedIn = await getLoggedInUser();

    const changedEntries = editableTransactions
      .map((entry, index) => {
        const original = transactions[index];
        if (entry.categoryId.$id !== original.categoryId.$id) {
          return {
            id: entry.$id,
            categoryId: entry.categoryId.$id,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (changedEntries.length === 0) {
      console.log('No changes to save');
      setIsLoading(false);
      return;
    }

    console.log('Changed entries:', changedEntries);

    try {
      let jwt = await get_jwt(loggedIn?.$id);

      if (await isJWTExpired(jwt)) {
        jwt = await create_JWT();
        await send_jwt(jwt);
        jwt = await get_jwt(loggedIn?.$id);
      }
      await update_category(jwt, changedEntries);

      toast({
        duration: 1000,
        variant: 'succes',
        title: 'Budget is send!',
        description: 'Your budget is being saved.',
      });
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      toast({
        duration: 1000,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-center">Category</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentTransactions.map((t, index) => {
            const convertedAmount = formatAmount(Number(t.amount), currency);

            return (
              <TableRow key={t.$id}>
                <TableCell
                  onClick={() => editable && setEditingRowIndex(index)}
                  className="text-center align-middle"
                >
                  {editable && editingRowIndex === index ? (
                    <select
                      className="border rounded px-2 py-1 w-full text-center"
                      value={t.categoryId?.$id ?? ''}
                      onChange={(e) =>
                        handleCategoryChange(index, e.target.value)
                      }
                      onBlur={() => setEditingRowIndex(null)}
                      autoFocus
                    >
                      {categoryOptions.map(([name, id]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : t.categoryId?.name ? (
                    <span
                      style={{
                        border: `1px solid ${t.categoryId.colour}`,
                        padding: '4px 8px',
                        borderRadius: '30px',
                        display: 'inline-block',
                        color: t.categoryId.colour,
                        textAlign: 'center',
                      }}
                      className="mx-auto"
                    >
                      {t.categoryId.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic block text-center">
                      No category
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <div>
                    <h1>{t.recipient}</h1>
                  </div>
                </TableCell>

                <TableCell>{convertedAmount}</TableCell>

                <TableCell>{t.transactionType}</TableCell>

                <TableCell>{t.date}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination page={page} totalPages={totalPages} />

      {editable && (
        <div className="flex justify-end mt-4">
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
      )}
    </div>
  );
};

export default TransactionTable;
