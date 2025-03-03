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

  const handleTransactionAdded = () => {
    // fetchProjectData();
    console.log("Transaction added");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/projects">
            <Button variant="outline" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>

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
          onTransactionAdded={handleTransactionAdded}
          expenseTypeOptions={expenseTypeOptions}
        />
      </div>
    </>
  );
}
