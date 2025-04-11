"use client";
import { signOut } from "next-auth/react";
import React, { ButtonHTMLAttributes, ReactElement } from "react";

export default function ClientClick({
  children,
}: {
  children: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
}) {
  const ModalTriggerButton = React.cloneElement(children, {
    onClick: async () => await signOut(),
  });

  return <>{ModalTriggerButton}</>;
}
