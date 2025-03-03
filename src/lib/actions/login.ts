"use server";

// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: { email: string; password: string }) {
  // console.log("login data: ", formData);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  // revalidatePath("/", "layout");
  redirect("/projects");
}
