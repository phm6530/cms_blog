"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZWJiaGdleHdrZnpwbWV0bHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDM1MjgsImV4cCI6MjA1OTA3OTUyOH0.nH1zFHpovbkxM5A6eVVY398_RNdDf75jtK0A-XUQO5I";
const supabaseUrl = "https://oeebbhgexwkfzpmetlrs.supabase.co";

export const uploader = async (
  e: React.ChangeEvent<HTMLInputElement>,
  path: string
) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const file = e.target.files?.[0];
  if (!file) return;

  const ext = file.name.split(".").pop();
  const uniqueFileName = `${path}/test.${ext}`;

  const { error } = await supabase.storage
    .from("blog")
    .upload(uniqueFileName, file, {
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
