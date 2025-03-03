import ProjectPageWrapper from "@/components/projects/project-page-wrapper";
import { getAllProjects, getProjectStatusOptions } from "@/lib/actions/project";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const statusOptions = await getProjectStatusOptions();
  // console.log(projects);
  // console.log(statusOptions);
  return (
    <ProjectPageWrapper
      projects={projects || []}
      statusOptions={statusOptions || []}
    />
  );
}
