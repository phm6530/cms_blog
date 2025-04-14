"use client";
import React, { ReactNode } from "react";
import LoadingSpiner from "../animation/loading-spiner";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
export default function MasonryLayout({
  gutter = 50,
  children,
  loading = false,
}: {
  loading?: boolean;
  pending?: boolean;
  gutter?: number;
  children?: ReactNode;
}) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}>
      <Masonry gutter="50px">{loading ? <LoadingSpiner /> : children}</Masonry>
    </ResponsiveMasonry>
  );
}
