"use client";

import type React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addIncome, addExpense } from "@/lib/actions/project-details"; // Import separate functions for income and expense
import { useRouter } from "next/navigation";

// Define the schema using zod
const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  //   date: z.string().min(1, "Date is required"),
  //   description: z.string().min(1, "Description is required"),
  remarks: z.string().optional(),
  expenseType: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTransactionAdded: () => void;
  expenseTypeOptions: {
    id: any;
    expenses_type_name: any;
  }[];
}

export default function TransactionDialog({
  isOpen,
  onClose,
  projectId,
  onTransactionAdded,
  expenseTypeOptions,
}: TransactionDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "income",
      amount: "",
      //   date: "",
      //   description: "",
      remarks: "",
      expenseType: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: TransactionFormData) => {
    const transactionData = {
      projectId,
      amount: Number.parseFloat(data.amount),
      //   date: data.date,
      //   description: data.description,
      remarks: data.remarks,
    };

    if (data.type === "income") {
      // Call the function for income
      await addIncome(transactionData);
      router.refresh();
    } else if (data.type === "expense") {
      // Call the function for expense
      await addExpense({
        ...transactionData,
        expenseType: data.expenseType || "", // Include expenseType for expenses
      });
      router.refresh();
    }

    onTransactionAdded(); // Notify parent component
    onClose(); // Close the dialog
    reset(); // Reset the form
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-red-500">{errors.type.message}</p>
            )}
          </div>
          <Controller
            name="type"
            control={control}
            render={({ field }) =>
              field.value === "expense" ? (
                <div className="space-y-2">
                  <Label htmlFor="expenseType">Expense Type</Label>
                  <Controller
                    name="expenseType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select expense type" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseTypeOptions &&
                            expenseTypeOptions.map((expenseType) => (
                              <SelectItem
                                value={expenseType.id}
                                key={expenseType.id}
                              >
                                {expenseType.expenses_type_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.expenseType && (
                    <p className="text-red-500">{errors.expenseType.message}</p>
                  )}
                </div>
              ) : (
                <></>
              )
            }
          />
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input id="amount" type="number" {...field} />
              )}
            />
            {errors.amount && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => <Input id="date" type="date" {...field} />}
            />
            {errors.date && (
              <p className="text-red-500">{errors.date.message}</p>
            )}
          </div> */}
          {/* <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Input id="description" {...field} />}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Controller
              name="remarks"
              control={control}
              render={({ field }) => <Textarea id="remarks" {...field} />}
            />
            {errors.remarks && (
              <p className="text-red-500">{errors.remarks.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
