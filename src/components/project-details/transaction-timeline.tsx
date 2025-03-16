"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/types/project";
import { Button } from "../ui/button";
import EditTransactionDialog from "./edit-transaction-dialog";
import { deleteExpense, deleteIncome } from "@/lib/actions/project-details";
import { useRouter } from "next/navigation";
import DeleteConfirmationDialog from "./delete-confirmation-dialog";
// import { getProjectTransactions } from "@/lib/actions/project-details";

interface TransactionTimelineProps {
  // projectId: string;
  transactions: Transaction[];
  expenseTypeOptions: {
    id: any;
    expenses_type_name: any;
  }[];
}

export default function TransactionTimeline({
  // projectId,
  transactions,
  expenseTypeOptions,
}: TransactionTimelineProps) {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState("all");
  const [expenseType, setExpenseType] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      if (transactionToDelete.type === "income") {
        await deleteIncome(transactionToDelete.id);
      } else if (transactionToDelete.type === "expense") {
        await deleteExpense(transactionToDelete.id);
      }

      // Refresh the transactions list or update state
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
      // Optionally, refresh the transactions list
      router.refresh();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleTransactionUpdated = () => {
    setIsEditDialogOpen(false);
    // Optionally, refresh the transactions list
  };
  const filteredTransactions = transactions.filter(
    (transaction: Transaction) => {
      // Filter by transaction type
      if (transactionType !== "all" && transaction.type !== transactionType) {
        return false;
      }

      // Filter by expense type if it's an expense
      if (
        transaction.type === "expense" &&
        expenseType !== "all" &&
        transaction.expenseType !== expenseType
      ) {
        return false;
      }

      return true;
    }
  );

  // Get unique expense types for the filter
  const expenseTypes = Array.from(
    new Set(
      transactions
        .filter((t: Transaction) => t.type === "expense")
        .map((t: Transaction) => t.expenseType)
    )
  );

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Financial Timeline</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expense">Expenses Only</SelectItem>
                </SelectContent>
              </Select>

              {(transactionType === "expense" || transactionType === "all") && (
                <Select value={expenseType} onValueChange={setExpenseType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Expense Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expense Types</SelectItem>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type} value={type as string}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-8">
                {filteredTransactions.map(
                  (transaction: Transaction, index: number) => (
                    <div key={transaction.id} className="relative">
                      {/* Timeline connector */}
                      {index < filteredTransactions.length - 1 && (
                        <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-muted-foreground/20" />
                      )}

                      <div className="flex gap-4">
                        <div
                          className={`mt-1 h-7 w-7 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-600" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                            <div className="font-medium">
                              {transaction.description}
                              {transaction.type === "expense" && (
                                <Badge variant="outline" className="ml-2">
                                  {transaction.expenseType}
                                </Badge>
                              )}
                            </div>
                            <div
                              className={`${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              } font-semibold`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground mb-2">
                            {formatDate(transaction.date)}
                          </div>

                          {transaction.remarks && (
                            <div className="text-sm bg-muted p-3 rounded-md">
                              {transaction.remarks}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>

                      {index < filteredTransactions.length - 1 && (
                        <Separator className="mt-8" />
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No transactions found matching your criteria.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      {selectedTransaction && (
        <EditTransactionDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          transaction={selectedTransaction}
          onTransactionUpdated={handleTransactionUpdated}
          expenseTypeOptions={expenseTypeOptions}
        />
      )}
      {transactionToDelete && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
