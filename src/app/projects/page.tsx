import ProjectPageWrapper from "@/components/projects/project-page-wrapper";
import { getAllProjects, getProjectStatusOptions } from "@/lib/actions/project";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [projects, statusOptions] = await Promise.all([
    getAllProjects(),
    getProjectStatusOptions(),
  ]);
  return (
    <ProjectPageWrapper
      projects={projects || []}
      statusOptions={statusOptions || []}
    />
  );
}
