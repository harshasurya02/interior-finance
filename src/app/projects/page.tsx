import ProjectPageWrapper from "@/components/projects/project-page-wrapper";
import { getAllProjects, getProjectStatusOptions } from "@/lib/actions/project";

export const revalidate = 30;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page, limit } = await searchParams;

  const [projects, statusOptions] = await Promise.all([
    getAllProjects(
      (page && parseInt(page)) || 1,
      (limit && parseInt(limit)) || 10
    ),
    getProjectStatusOptions(),
  ]);
  return (
    <ProjectPageWrapper
      projects={projects || []}
      statusOptions={statusOptions || []}
      currentPage={(page && parseInt(page)) || 1}
      limit={(limit && parseInt(limit)) || 10}
    />
  );
}
