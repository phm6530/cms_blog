"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import SearchField from "@/components/ui/searchField";
import { useInfiniteQuery } from "@tanstack/react-query";
import SkeletonImage from "@/components/ui/skeleton-img";
import Image from "next/image";
import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { wirtePostSchema } from "./schema";
import { z } from "zod";

type UnsplashApi = {
  total: number;
  total_pages: number;
  results: {
    urls: {
      regular: string;
      raw: string;
      small: string;
    };
    alternative_slugs: {
      ko: string;
    };
  }[];
};

export function DialogCustom({
  view,
  setView,
}: {
  view: boolean;
  setView: Dispatch<SetStateAction<boolean>>;
}) {
  /**------- 섬네일 갯수 ---------- */
  const OFFSET = 30;

  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { setValue: formSetValue } =
    useFormContext<z.infer<typeof wirtePostSchema>>();

  const { data, isFetching, fetchNextPage, refetch, hasNextPage, isFetched } =
    useInfiniteQuery({
      queryKey: ["unsplash", searchValue],
      queryFn: async ({ pageParam }) => {
        if (!searchValue) return { total: 0, total_pages: 0, results: [] };

        const encodingText = encodeURIComponent(searchValue);
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodingText}&client_id=PIkUJ8qatZ2000yVp0DzplIL15unNYVPJ3GsjXtWDSE&per_page=${OFFSET}&page=${pageParam}`
        );

        if (!response.ok) throw new Error("에러");

        return (await response.json()) as Promise<UnsplashApi>;
      },
      enabled: !!searchValue,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage.total_pages;
        if (currentPage < totalPages) {
          return currentPage + 1;
        }
        return undefined;
      },

      initialPageParam: 1,
    });

  const flatDatas = data?.pages.flatMap((e) => e.results) ?? [];

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setSearchValue(value);
    refetch();
  };

  const selectImg = (imgUrl: string) => {
    formSetValue("thumbnail", imgUrl);
    setView(false);
  };

  return (
    <Dialog open={view} onOpenChange={() => setView(false)}>
      <DialogContent className="w-[calc(100%-20px)] max-w-2xl! h-auto max-h-[700px]">
        <DialogHeader>
          <DialogTitle>배너 이미지 생성기</DialogTitle>
          <DialogDescription>
            `UnSlash Api 사용으로 검색어를 영어로 입력하시면 <br></br> 더 정확한
            결과를 검색합니다. animal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmitHandler}>
          <div className="grid gap-4 py-4">
            <SearchField
              name={"search"}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </div>
        </form>

        <div className="max-h-[400px] overflow-hidden">
          {/* {isPending && (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, idx) => {
                void _;
                return <SkeletonImage key={`skeleton:${idx}`} />;
              })}
            </div>
          )} */}
          <>
            {flatDatas.length !== 0 ? (
              <div className="grid gap-3 max-h-[400px] custom-scroll overflow-y-scroll grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {flatDatas.map((e, key) => {
                  return (
                    <div
                      className="cursor-pointer relative [aspect-ratio:16/9] group animate-wiggle"
                      key={`${key}-wrap`}
                      onClick={() => selectImg(e.urls.regular)}
                    >
                      <div className="group-hover:block hidden absolute z-1 animate-wiggle p-2 rounded-full left-2 top-2 bg-emerald-600">
                        <Check className="text-white" />
                      </div>
                      <Image
                        src={e.urls.regular}
                        alt={e.alternative_slugs.ko}
                        style={{ objectFit: "cover" }}
                        fill
                        sizes="(max-width : 768px) 100vw"
                        unoptimized
                      />
                    </div>
                  );
                })}
                {hasNextPage && (
                  <Button
                    className="col-span-2 text-xs"
                    onClick={() => fetchNextPage()}
                    variant={"outline"}
                  >
                    + 30개 더 가져오기
                  </Button>
                )}
              </div>
            ) : (
              <>
                {searchValue && flatDatas.length === 0 && isFetched && (
                  <p className="text-center text-sm text-muted-foreground">
                    <span className="underline">{searchValue}</span> 와 일치하는
                    이미지가 없습니다.
                  </p>
                )}
              </>
            )}
          </>

          {isFetching && (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, idx) => {
                void _;
                return <SkeletonImage key={`skeleton:${idx}`} />;
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => setView(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
