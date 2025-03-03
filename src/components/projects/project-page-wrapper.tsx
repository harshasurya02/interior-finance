"use client";

import { useState } from "react";
import ProjectGrid from "@/components/projects/project-grid";
import { Button } from "@/components/ui/button";
import ProjectModal from "@/components/projects/project-modal";
import type { Project } from "@/types/project";

export default function ProjectPageWrapper({
  projects,
  statusOptions,
}: {
  projects: Project[];
  statusOptions: { id: string; site_status_name: string }[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Finance Tracker</h1>
        <Button onClick={handleAddProject}>Add New Project</Button>
      </div>
      <ProjectGrid
        initialProjects={projects}
        onEditProject={handleEditProject}
      />
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={editingProject}
        statusOptions={statusOptions}
      />
    </div>
  );
}
