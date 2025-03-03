"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./project-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/project";
// import { projects } from "@/data/projects";

export default function ProjectGrid({
  initialProjects,
  onEditProject,
}: {
  initialProjects: Project[] | null;
  onEditProject: (project: Project) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
    // console.log("initialProjects", initialProjects);
    setProjects(initialProjects);
    // console.log("projects", projects);
  }, [initialProjects]);

  const filteredProjects =
    projects?.filter((project: Project) => {
      const matchesSearch = project.site_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        project.site_status.site_status_name.toLowerCase() ===
          statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="under_negotiation">
                Under Negotiation
              </SelectItem>

              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.length > 0 ? (
          filteredProjects.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No projects found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
