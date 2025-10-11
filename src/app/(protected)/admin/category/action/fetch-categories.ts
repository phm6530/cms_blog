"use server";
import getCategories from "@/service/get-category";
import { REVALIDATE } from "@/type/constants";
import { actionWrapper } from "@/util/action-wrapper";

export async function actionCategories() {
  return await actionWrapper(getCategories, {
    cache: {
      keys: [REVALIDATE.POST.CATEGORY],
      options: { tags: [REVALIDATE.POST.CATEGORY] },
    },
  });
}
