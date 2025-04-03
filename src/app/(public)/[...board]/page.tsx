import { Button } from "@/components/ui/button";
import { BlogGroupModel } from "@/type/blog-group";
import Link from "next/link";
import React from "react";

type CacheAllParams = {
  params: {
    board: string[];
  };
};

export default async function Posts({ params }: CacheAllParams) {
  //Inital
  const test = await fetch("http://localhost:3000/api/blogGroup", {
    cache: "force-cache",
    next: {
      tags: ["blog-group"],
    },
  });

  const { result }: { result: BlogGroupModel[] } = await test.json();

  return (
    <div className=" w-full gap-2 flex flex-wrap">
      {result.map((group) => {
        return group.subGroups.map((e) => {
          return (
            <Button
              variant={"outline"}
              asChild
              key={e.subGroupId}
              className="rounded-full text-xs"
            >
              <Link href={`/blog/${e.subGroupName}`}>{e.subGroupName} (0)</Link>
            </Button>
          );
        });
      })}
    </div>
  );
}
