"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    multiline?: boolean;
  };

export default function FormField({ label, multiline, className, ...props }: Props) {
  const Component = multiline ? "textarea" : "input";
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <Component
        {...props}
        className={`rounded-2xl border border-slate-200 px-4 py-2 focus:border-zona-purple focus:outline-none ${
          multiline ? "min-h-[120px]" : ""
        } ${className || ""}`}
      />
    </label>
  );
}
