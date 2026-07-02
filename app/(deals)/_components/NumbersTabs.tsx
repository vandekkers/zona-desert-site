"use client";

// BREAKAWAY: deals board — remove at platform launch
//
// Tiny tab switcher for the analysis sections. Tab CONTENT is rendered on
// the server and passed in as children — this island only swaps which
// panel is visible.

import { useState } from "react";

interface Props {
  labels: string[];
  children: React.ReactNode[];
}

export function NumbersTabs({ labels, children }: Props) {
  const [active, setActive] = useState(0);
  const panels = Array.isArray(children) ? children : [children];

  if (labels.length === 1) return <>{panels[0]}</>;

  return (
    <div className="space-y-4">
      <div className="flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(index)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              index === active
                ? "bg-zona-purple-deep text-white"
                : "text-slate-600 hover:text-zona-purple-deep"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div key={labels[index]} className={index === active ? "" : "hidden"}>
          {panel}
        </div>
      ))}
    </div>
  );
}
