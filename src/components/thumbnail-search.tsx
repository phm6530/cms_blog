"use client";

import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { useMutation } from "@tanstack/react-query";
// unplashe Api Type임

export default function ThumbnailSearch() {
  const { mutate: searchMutate, data } = useMutation({
    mutationFn: async (searchText: string) => {
      const encodingText = encodeURI(searchText);
      const response = await withFetchRevaildationAction<UnsplashApi>({
        endPoint: `https://api.unsplash.com/search/photos?query=${encodingText}&client_id=PIkUJ8qatZ2000yVp0DzplIL15unNYVPJ3GsjXtWDSE&per_page=30&page=1`,
      });

      if (!response.success) {
        throw new Error("");
      }

      return response.result;
    },
  });

  return <></>;
}
