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
import { useMutation } from "@tanstack/react-query";
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
  const [value, setValue] = useState<string>("");
  const { setValue: formSetValue } =
    useFormContext<z.infer<typeof wirtePostSchema>>();
  const {
    mutate: searchMutate,
    data,
    isPending,
  } = useMutation<UnsplashApi, Error, string>({
    mutationFn: async (searchText: string) => {
      const encodingText = encodeURI(searchText);
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodingText}&client_id=PIkUJ8qatZ2000yVp0DzplIL15unNYVPJ3GsjXtWDSE&per_page=30&page=1`
        );

        if (!response.ok) {
          throw new Error("연결 실패");
        }

        return await response.json();
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(err.message);
        }
      }
    },
  });

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    searchMutate(value);
  };

  const selectImg = (imgUrl: string) => {
    formSetValue("thumbnail", imgUrl);
    setView(false);
  };

  return (
    <Dialog open={view} onOpenChange={() => setView(false)}>
      <DialogContent className="w-[calc(100%-20px)] max-w-2xl!">
        <DialogHeader>
          <DialogTitle>배너 이미지 생성기</DialogTitle>
          <DialogDescription></DialogDescription>
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
          {isPending && (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, idx) => {
                void _;
                return <SkeletonImage key={`skeleton:${idx}`} />;
              })}
            </div>
          )}
          <>
            {data?.total !== 0 ? (
              <div className="grid gap-3 max-h-[400px] custom-scroll overflow-y-scroll grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {data?.results.map((e, key) => {
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
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <>과 일치하는 이미지가 없습니다.</>
            )}
          </>
        </div>

        <DialogFooter>
          <Button onClick={() => setView(false)}>닫기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
