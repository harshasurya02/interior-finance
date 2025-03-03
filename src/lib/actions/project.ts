"use server";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/project";

export async function getAllProjects() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const projects = await supabase
    .from("site")
    .select(
      `id, site_name, expenses, incoming, initial_quotation, final_quotation, site_status(site_status_name)`
    )
    .eq("user_id", userId)
    .returns<Project[]>();

  return projects.data;
}

export async function addProject(project: ProjectInsertion) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  console.log("userid:", userId);
  const { error } = await supabase
    .from("site")
    .insert([{ ...project, user_id: userId }]);

  if (error) {
    console.log("An error occured while inserting project =>", error);
    return;
  }
  console.log("Project inserted successfully");
  return "Project inserted successfully";
}

export async function editProject(
  project: ProjectInsertion,
  projectId: string
) {
  // console.log(project, projectId);
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  console.log("userid:", userId);

  if (!userId) {
    console.log("User ID is undefined. User might not be logged in.");
    return;
  }

  const { data, error } = await supabase
    .from("site")
    .update({
      site_name: project.site_name,
      initial_quotation: project.initial_quotation,
      final_quotation: project.final_quotation,
      site_status_id: project.site_status_id,
      user_id: userId,
    })
    .eq("id", projectId)
    .select();
  console.log(data, error);
  if (error) {
    console.log("An error occured while inserting project =>", error);
    return;
  }
  console.log("Project edited successfully");
  return data;
}

export async function getProjectStatusOptions() {
  const supabase = await createClient();

  const statusOptions = await supabase
    .from("site_status")
    .select("id, site_status_name");

  return statusOptions.data;
}

export interface ProjectInsertion {
  site_name: string;
  expenses: number;
  incoming: number;
  initial_quotation: number;
  final_quotation: number;
  site_status_id: string;
}
