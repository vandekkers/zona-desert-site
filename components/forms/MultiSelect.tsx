"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  label: string;
  placeholder: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  helperText?: string;
  disabled?: boolean;
  emptyText?: string;
  required?: boolean;
};

export default function MultiSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  helperText,
  disabled,
  emptyText,
  required
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  function toggleOption(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  function handleSelectAll() {
    onChange(options.map((option) => option.value));
  }

  function handleClear() {
    onChange([]);
  }

  const buttonLabel = value.length ? `${value.length} selected` : placeholder;

  return (
    <div className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          className={`w-full rounded-2xl border px-4 py-2 text-left text-sm focus:border-zona-purple focus:outline-none ${
            disabled ? "border-slate-100 text-slate-400" : "border-slate-200 text-slate-700"
          }`}
        >
          {buttonLabel}
        </button>
        {isOpen && !disabled && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 px-4 py-2">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="w-full border border-slate-200 px-3 py-1 text-sm focus:border-zona-purple focus:outline-none"
              />
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredOptions.length ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => toggleOption(option.value)}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                        isSelected ? "bg-zona-purple/10 text-zona-purple" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                          isSelected ? "border-zona-purple bg-zona-purple text-white" : "border-slate-300 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      {option.label}
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-6 text-center text-xs text-slate-400">{emptyText || "No matches"}</p>
              )}
            </div>
            <div className="flex justify-between border-t border-slate-100 px-4 py-2 text-xs font-semibold text-zona-purple">
              <button type="button" onClick={handleSelectAll}>
                Select All
              </button>
              <button type="button" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
