"use server";
import { createClient } from "@/lib/supabase/server";

export async function uploadAttachment(
  file: File,
  attachmentName: string,
  projectId: string
) {
  const supabase = await createClient();

  try {
    // Upload file to Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    // Insert record in attachment table
    const { data: attachmentData, error: dbError } = await supabase
      .from('attachment')
      .insert({
        attachment_name: attachmentName,
        attachment_url: publicUrl,
        site_id: projectId
      })
      .select()
      .single();

    if (dbError) {
      // If database insert fails, delete the uploaded file
      await supabase.storage
        .from('attachments')
        .remove([filePath]);
      throw new Error(`Database error: ${dbError.message}`);
    }

    return { data: attachmentData };
  } catch (error) {
    console.error("Error in uploadAttachment:", error);
    throw error;
  }
}

export async function deleteAttachment(attachmentId: string) {
  const supabase = await createClient();

  try {
    // First get the attachment details to get the file path
    const { data: attachment, error: fetchError } = await supabase
      .from('attachment')
      .select('attachment_url')
      .eq('attachment_id', attachmentId)  // This is correct
      .single();

      console.log(attachment) // Log the attachment object to see what it looks like

    if (fetchError) {
      throw new Error(`Fetch error: ${fetchError.message}`);
    }

    // Extract the file path from the URL
    const urlParts = attachment.attachment_url.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Gets "projectId/filename"

    console.log("File path to delete:", filePath);
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('attachments')
      .remove([filePath]);

    if (storageError) {
      throw new Error(`Storage delete error: ${storageError.message}`);
    }

    // Delete the record from the database
    const { error: dbError } = await supabase
      .from('attachment')
      .delete()
      .eq('attachment_id', attachmentId);  // This is correct

    if (dbError) {
      throw new Error(`Database delete error: ${dbError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteAttachment:", error);
    throw error;
  }
}

export async function getProjectAttachments(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('attachment')
    .select('*')
    .eq('site_id', projectId)
    .order('created_at', { ascending: false });
    console.log(data)
  if (error) {
    console.error("Error fetching attachments:", error);
    return [];
  }

  return data;
}