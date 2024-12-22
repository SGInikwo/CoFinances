import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const TransactionTable = ( {transactions}: TransactionTableProps ) => {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>To</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
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
              {t.amount}
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