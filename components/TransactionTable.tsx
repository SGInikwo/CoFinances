'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { convert_currency } from "@/lib/actions/transaction.actions";
import { formatAmount } from "@/lib/utils"
import { useEffect, useState } from "react";
import { number } from "zod"

interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  userCurrency: string;
  transactionType: string;
  icon: string;
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currency: Number;
}

const TransactionTable = ( {transactions, currency}: TransactionTableProps ) => {
  const [convertedTransactions, setConvertedTransactions] = useState<
    (Transaction & { convertedAmount: string })[]
  >([]);

  useEffect(() => {
    const fetchConvertedTransactions = async () => {
      const updatedTransactions = await Promise.all(
        transactions.map(async (t) => {
          const rate = await convert_currency(t.currency, currency);
          const convertedAmount = formatAmount(Number(t.amount) * rate, currency);
          return { ...t, convertedAmount };
        })
      );
      setConvertedTransactions(updatedTransactions);
    };

    fetchConvertedTransactions();
  }, [transactions]);
  
  const latestTenTransactions = convertedTransactions.slice(0, 10);

  return (
    <Table className="flex-col">
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {latestTenTransactions.map((t) => {
          return(
            <TableRow key={t.id}>
            <TableCell>
              <div>
                <h1>
                  {t.recipient}
                </h1>
              </div>
            </TableCell>

            <TableCell>
              {t.convertedAmount}
            </TableCell>

            <TableCell>
              {t.transactionType}
            </TableCell>

            <TableCell>
              {t.icon}
            </TableCell>
            
            <TableCell>
              {t.date}
            </TableCell>
          </TableRow>
          )
        })}
      </TableBody>
    </Table>

  )
}

export default TransactionTable