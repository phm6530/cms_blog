"use server";
import getCategories from "@/service/get-category";

export async function actionCategories() {
  return await getCategories();
}
