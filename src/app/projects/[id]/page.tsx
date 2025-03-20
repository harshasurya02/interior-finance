import { notFound } from "next/navigation";
import {
  getExpenseTypeOptions,
  getProjectDetails,
  getProjectTransactions,
} from "@/lib/actions/project-details";
import ProjectDetailsWrapper from "@/components/project-details/project-details-wrapper";

export const revalidate = 30;

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  // const project = await getProjectDetails(id);

  const [project, transactions, expenseTypeOptions] = await Promise.all([
    getProjectDetails(id),
    getProjectTransactions(id),
    getExpenseTypeOptions(),
  ]);

  console.log(project, transactions);

  if (!project) {
    notFound();
  }

  // const transactions = await getProjectTransactions(id);
  // const expenseTypeOptions = await getExpenseTypeOptions();
  return (
    <ProjectDetailsWrapper
      transactions={transactions}
      project={project}
      id={id}
      expenseTypeOptions={expenseTypeOptions}
    />
  );
}
