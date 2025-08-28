"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(data: { email: string; password: string }) {
  try {
    await signIn("credentials", { ...data, redirect: false });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.cause?.err?.message || error.message,
      };
    }
    throw error;
  }
}
