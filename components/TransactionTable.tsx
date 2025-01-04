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
import { Pagination } from "./Pagination";

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
  currency: number;
  page: number;
  rowPerPage: number;
}

const TransactionTable = ( {transactions, currency, page=1, rowPerPage=10}: TransactionTableProps ) => {
  const [convertedTransactions, setConvertedTransactions] = useState<
    (Transaction & { convertedAmount: string })[]
  >([]);

  const rowsPerPage = rowPerPage;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;


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
  
  // const latestTenTransactions = convertedTransactions.slice(0, 10);

  const currentTransactions = convertedTransactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )


  return (
    <div>
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
          {currentTransactions.map((t) => {
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

      <Pagination page={page} totalPages={totalPages} />
    </div>
    

  )
}

export default TransactionTable