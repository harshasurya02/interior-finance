"use client";
// import Link from "next/link";
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
import AttachmentDialog from "./attachment-dialog";
import AttachmentsList from "./attachments-list";
import { deleteAttachment } from "@/lib/actions/attachment";

export default function ProjectDetailsWrapper({
  project,
  transactions,
  id,
  expenseTypeOptions = [],
  attachments = [],
}: {
  project: any;
  transactions: Transaction[];
  id: string;
  expenseTypeOptions: {
    id: any;
    expenses_type_name: any;
  }[];
  attachments: any[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const router = useRouter();
  // const handleTransactionAdded = () => {
  //   // fetchProjectData();
  //   console.log("Transaction added");
  // };

  function handleBackTransition() {
    router.back();
  }

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(attachmentId);
      router.refresh(); // Refresh the page to update the attachments list
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
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
        <div className="mb-6 flex gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>Add Transaction</Button>
          <Button 
            variant="outline"
            onClick={() => setIsAttachmentDialogOpen(true)}
          >
            Add Attachment
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TransactionTimeline
              transactions={transactions}
              expenseTypeOptions={expenseTypeOptions}
            />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ProjectSummary project={project} transactions={transactions} />
            <AttachmentsList 
              attachments={attachments}
              onDelete={handleDeleteAttachment}
            />
          </div>
        </div>
        <TransactionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          projectId={id}
          expenseTypeOptions={expenseTypeOptions}
        />
        <AttachmentDialog
          isOpen={isAttachmentDialogOpen}
          onClose={() => setIsAttachmentDialogOpen(false)}
          projectId={id}
        />
      </div>
    </>
  );
}
