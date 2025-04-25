import { z } from "zod";
import { wirtePostSchema } from "./schema";
import { POST_STATUS } from "@/type/constants";
import { BlogDetailResponse } from "@/type/blog.type";
import { HtmlContentNormalizer } from "@/util/baseurl-slice";

const defaultValues: z.infer<typeof wirtePostSchema> = {
  title: "",
  contents: "",
  postGroup: {
    category: null,
    group: null,
  },
  thumbnail: null,
  defaultThumbNail: false,
  imgKey: "",
  status: POST_STATUS.PUBLISHED,
};

export const setDefaultValues = (editData: BlogDetailResponse | undefined) => {
  return {
    ...(!!editData
      ? {
          ...defaultValues,
          title: editData.blog_metadata.post_title,
          contents: HtmlContentNormalizer.setImgUrl(
            editData.blog_contents.contents
          ),
          status:
            editData.blog_metadata.status === POST_STATUS.DRAFT
              ? POST_STATUS.PUBLISHED
              : (editData.blog_metadata.status as Exclude<
                  POST_STATUS,
                  POST_STATUS.DRAFT
                >),
          postGroup: {
            category: editData.blog_metadata.category_id,
            group: editData.blog_metadata.sub_group_id,
          },
          thumbnail: editData.blog_metadata.thumbnail_url,
          imgKey: editData.blog_metadata.img_key,
        }
      : { ...defaultValues }),
  };
};
