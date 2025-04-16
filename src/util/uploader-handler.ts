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

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // 허용된 이미지 MIME 타입들
  if (!allowedTypes.includes(file.type)) {
    alert("이미지가 아닌거같음");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("5MB넘는 파일입니다.");
    return;
  }

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
