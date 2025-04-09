"use client";

import { SupabaseStorage } from "@/config/supabase-instance";

export const imgUploader = async ({
  event,
  path,
  filename,
}: {
  event: React.ChangeEvent<HTMLInputElement>;
  path: string;
  filename: string;
}) => {
  const supabase = SupabaseStorage.getInstance();

  const file = event.target.files?.[0];
  if (!file) return;

  const ext = file.name.split(".").pop();

  const { error } = await supabase.storage
    .from("blog")
    .upload(`${path}/${filename}.${ext}`, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    alert("업로드 에러: " + error.message);
    return;
  }

  const { data } = supabase.storage.from("blog").getPublicUrl(uniqueFileName);
  return data.publicUrl;
};
