"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { ButtonHTMLAttributes, ReactElement, useState } from "react";

export default function ConfirmButton({
  title,
  children,
  description,
  cb,
}: {
  title: string;
  children: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: (..._arg: any) => Promise<void> | void;
}) {
  const [view, setView] = useState<boolean>(false);

  const ModalTriggerButton = React.cloneElement(children, {
    onClick: () => setView(true),
  });

  const submitHandler = async () => {
    await cb();
    setView(false);
  };

  return (
    <AlertDialog open={view}>
      {ModalTriggerButton}
      <AlertDialogContent className="w-[95%]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={() => setView(false)}
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={submitHandler}>
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
