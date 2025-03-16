"use server";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/project";

export async function getAllProjects(
  page: number,
  limit: number
): Promise<Project[]> {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const offset = (page - 1) * limit;

  const { data, error } = await supabase
    .from("site")
    .select(
      `id, site_name, expenses, incoming, initial_quotation, final_quotation, site_status(site_status_name)`
    )
    .eq("user_id", userId)
    .range(offset, offset + limit - 1) // Pagination using range
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data;
}

export async function addProject(project: ProjectInsertion) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return { error: "User ID is undefined. User might not be logged in." };
  }

  try {
    const { data, error } = await supabase
      .from("site")
      .insert([{ ...project, user_id: userId }])
      .select();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("An error occurred while adding the project:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function editProject(
  project: ProjectInsertion,
  projectId: string
) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return { error: "User ID is undefined. User might not be logged in." };
  }

  try {
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

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("An error occurred while editing the project:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
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
