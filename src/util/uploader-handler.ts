"use client";

import { SupabaseStorage } from "@/lib/supabase-instance";

export const imgUploader = async ({
  event,
  path,
  folderName,
  filename,
}: {
  event: File;
  path: string;
  folderName: string;
  filename: string;
}) => {
  const supabase = SupabaseStorage.getInstance();
  const file = event;
  if (!file) return;

  const ext = file.name.split(".").pop();
  const fullPath = `${path}/${folderName}/${filename}.${ext}`;

  const { error } = await supabase.storage.from("blog").upload(fullPath, file, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    alert("업로드 에러: " + error.message);
    return;
  }

  const { data } = supabase.storage.from("blog").getPublicUrl(fullPath);
  return data.publicUrl ?? null;
};
