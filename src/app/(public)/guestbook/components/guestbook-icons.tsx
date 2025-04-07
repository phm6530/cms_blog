"use client";
import { FormField, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function GuestBookIcons() {
  const arr = Array.from({ length: 6 }).map((_, idx) => idx);
  const { control, watch } = useFormContext();
  const selectIcon = watch("user_icon");

  return (
    <div className="bg-black/5 p-2 rounded-full mb-3 inline-block ">
      <FormField
        control={control}
        name="user_icon"
        render={({ field }) => {
          return (
            <RadioGroup onValueChange={field.onChange}>
              <div className="flex items-center space-x-1">
                {arr.map((_, idx) => {
                  return (
                    <React.Fragment key={`user_icon_${idx}`}>
                      <RadioGroupItem
                        value={`person_${idx + 1}`}
                        id={`person_${idx + 1}`}
                        className="hidden"
                      />
                      <Label htmlFor={`person_${idx + 1}`}>
                        <div
                          className={cn(
                            "size-13 relative rounded-full shadow-lg  grayscale border-6 border-transparent hover:scale-110 transition cursor-pointer",
                            selectIcon === `person_${idx + 1}` &&
                              "border-input grayscale-0"
                          )}
                        >
                          <div
                            className={cn(
                              "size-4 rounded-full bg-gradient-to-l from-primary to-primary z-10 absolute left-[-5px] top-[-5px] transition-transform duration-300 border-3 border-purple-300",
                              selectIcon === `person_${idx + 1}`
                                ? "scale-100 "
                                : "scale-0"
                            )}
                          />

                          <Image
                            alt={`person_${idx + 1}`}
                            src={`/img/guestbook/person_${idx + 1}.jpg`}
                            fill
                            className="rounded-full"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </Label>
                    </React.Fragment>
                  );
                })}
              </div>
              <FormMessage />
            </RadioGroup>
          );
        }}
      />
    </div>
  );
}
