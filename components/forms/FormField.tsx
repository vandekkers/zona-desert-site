"use client";

import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> &
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    multiline?: boolean;
    component?: "input" | "textarea" | "select";
    children?: ReactNode;
  };

export default function FormField({ label, multiline, className, component, children, ...props }: Props) {
  const tag = component ?? (multiline ? "textarea" : "input");
  const sharedClassName = `rounded-2xl border border-slate-200 px-4 py-2 focus:border-zona-purple focus:outline-none ${
    multiline ? "min-h-[120px]" : ""
  } ${className || ""}`;

  let control: ReactNode;
  if (tag === "textarea") {
    control = <textarea {...props} className={sharedClassName} />;
  } else if (tag === "select") {
    control = (
      <select {...props} className={sharedClassName}>
        {children}
      </select>
    );
  } else {
    control = <input {...props} className={sharedClassName} />;
  }

  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      {control}
    </label>
  );
}
