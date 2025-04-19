"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectHeader from "./project-header";
import TransactionTimeline from "./transaction-timeline";
import ProjectSummary from "./project-summary";
import { Transaction } from "@/types/project";
import TransactionDialog from "./transaction-dialog";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/logout";

export default function ProjectDetailsWrapper({
  project,
  transactions,
  id,
  expenseTypeOptions = [],
}: {
  project: any;
  transactions: Transaction[];
  id: string;
  expenseTypeOptions: {
    id: any;
    expenses_type_name: any;
  }[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const handleTransactionAdded = () => {
    // fetchProjectData();
    console.log("Transaction added");
  };

  function handleBackTransition() {
    router.back();
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleBackTransition}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          <ProjectHeader project={project} />
        </div>
        <div className="mb-6">
          <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionTimeline
              // projectId={id}
              transactions={transactions}
              expenseTypeOptions={expenseTypeOptions}
            />
          </div>

          <div className="lg:col-span-1">
            <ProjectSummary project={project} transactions={transactions} />
          </div>
        </div>
        <TransactionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          projectId={id}
          // onTransactionAdded={handleTransactionAdded}
          expenseTypeOptions={expenseTypeOptions}
        />
      </div>
    </>
  );
}
