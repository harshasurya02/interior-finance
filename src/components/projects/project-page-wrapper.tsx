"use client";

import { Suspense, useState } from "react";
import ProjectGrid from "@/components/projects/project-grid";
import { Button } from "@/components/ui/button";
import ProjectModal from "@/components/projects/project-modal";
import type { Project } from "@/types/project";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";

export default function ProjectPageWrapper({
  projects,
  statusOptions,
  currentPage,
  limit,
}: {
  projects: Project[];
  statusOptions: { id: string; site_status_name: string }[];
  currentPage: number;
  limit: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const router = useRouter();

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
    // router.refresh();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const onPageChange = (page: number, limit: number, disabled?: boolean) => {
    if (disabled) return;
    router.push(`/projects?page=${page}&limit=${limit}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Finance Tracker</h1>
        <Button onClick={handleAddProject}>Add New Project</Button>
      </div>
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectGrid
          initialProjects={projects}
          onEditProject={handleEditProject}
        />
      </Suspense>
      <Suspense fallback={null}>
        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          project={editingProject}
          statusOptions={statusOptions}
        />
      </Suspense>

      {/* Pagination Controls */}
      {projects.length > 0 && (
        <div className="flex justify-between items-center mt-8">
          {/* <Link
            href={`/projects?page=${currentPage - 1}&limit=${limit}`}
            passHref
          > */}
          <Button
            disabled={currentPage === 1}
            onClick={() =>
              onPageChange(currentPage - 1, limit, currentPage === 1)
            }
          >
            Previous
          </Button>
          {/* </Link> */}
          <span>Page {currentPage}</span>
          {/* <Link
            href={`/projects?page=${currentPage + 1}&limit=${limit}`}
            passHref
          > */}
          <Button
            disabled={projects.length < limit}
            onClick={() =>
              onPageChange(currentPage + 1, limit, projects.length < limit)
            }
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </Button>
          {/* </Link> */}
        </div>
      )}
    </div>
  );
}
