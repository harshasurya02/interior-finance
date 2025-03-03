import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import ProjectHeader from "@/components/project-details/project-header";
import TransactionTimeline from "@/components/project-details/transaction-timeline";
import ProjectSummary from "@/components/project-details/project-summary";
import { Project } from "@/types/project";
import {
  getProjectDetails,
  getProjectTransactions,
} from "@/lib/actions/project-details";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectDetails(id);

  if (!project) {
    notFound();
  }

  const transactions = await getProjectTransactions(id);

  return (
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
    </div>
  );
}
