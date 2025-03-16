"use client";

import React, { useEffect } from "react";
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
import { updateIncome, updateExpense } from "@/lib/actions/project-details";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/project";

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  remarks: z.string().optional(),
  expenseType: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onTransactionUpdated: () => void;
  expenseTypeOptions: {
    id: any;
    expenses_type_name: any;
  }[];
}

export default function EditTransactionDialog({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated,
  expenseTypeOptions,
}: EditTransactionDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction.type,
      amount: transaction.amount.toString(),
      remarks: transaction.remarks,
      expenseType: transaction.expenseType || "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: TransactionFormData) => {
    const transactionData = {
      id: transaction.id,
      amount: Number.parseFloat(data.amount),
      remarks: data.remarks,
    };

    if (data.type === "income") {
      await updateIncome(transactionData);
    } else if (data.type === "expense") {
      await updateExpense({
        ...transactionData,
        expenseType: data.expenseType || "",
      });
    }

    onTransactionUpdated();
    onClose();
    reset();
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
