import { notFound } from "next/navigation";
import {
  getExpenseTypeOptions,
  getProjectDetails,
  getProjectTransactions,
} from "@/lib/actions/project-details";
import ProjectDetailsWrapper from "@/components/project-details/project-details-wrapper";
import { getProjectAttachments } from "@/lib/actions/attachment";

export const revalidate = 30;

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({
  params,
}: {
  params:  Promise<{ id: string }>;
}) {

  const {id} = await params;

  const [project, transactions, expenseTypeOptions, attachments] = await Promise.all([
    getProjectDetails(id),
    getProjectTransactions(id),
    getExpenseTypeOptions(),
    getProjectAttachments(id),
  ]);

  return (
    <ProjectDetailsWrapper
      project={project}
      transactions={transactions}
      id={id}
      expenseTypeOptions={expenseTypeOptions}
      attachments={attachments}
    />
  );
}
