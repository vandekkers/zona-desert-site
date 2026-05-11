"use client";

// Layer 5 (Score Breakdown) — expandable bucket score detail.
//
// Per backend schema docstring (apps/api/app/schemas/public_offer.py
// lines 95-99), each bucket entry exposes category + score + max_points
// only (no variables_breakdown — that detail is admin-internal).
//
// Empty bucket_scores → component returns null (Layer hidden entirely).
// Score Breakdown is a detail-tier section; absence is fine without
// a placeholder.

import { useState } from "react";
import type { PublicBucketScore } from "@/lib/types";

interface Props {
  bucketScores: PublicBucketScore[];
}

function titleCaseFromSnake(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function clampPercent(score: number, maxPoints: number): number {
  if (!Number.isFinite(score) || !Number.isFinite(maxPoints) || maxPoints <= 0) {
    return 0;
  }
  const pct = (score / maxPoints) * 100;
  if (pct < 0) return 0;
  if (pct > 100) return 100;
  return pct;
}

export function LayerScoreBreakdown({ bucketScores }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!bucketScores || bucketScores.length === 0) return null;

  return (
    <section
      aria-labelledby="score-breakdown-title"
      className="rounded-2xl border border-zona-purple-mid/15 bg-white shadow-sm"
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="score-breakdown-panel"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-zona-off-white/40 md:px-8"
      >
        <div>
          <h2
            id="score-breakdown-title"
            className="text-2xl text-zona-navy md:text-3xl"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
          >
            Score Breakdown
          </h2>
          <p
            className="mt-1 text-sm text-zona-navy/70"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            How your offer was calculated
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-zona-purple-mid transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {expanded ? (
        <div
          id="score-breakdown-panel"
          className="border-t border-zona-navy/10 px-6 pb-6 pt-5 md:px-8"
        >
          <ul className="space-y-5">
            {bucketScores.map((bucket) => {
              const pct = clampPercent(bucket.score, bucket.max_points);
              return (
                <li key={bucket.category}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className="text-base text-zona-navy"
                      style={{ fontFamily: "var(--font-inter)", fontWeight: 500 }}
                    >
                      {titleCaseFromSnake(bucket.category)}
                    </span>
                    <span
                      className="text-sm text-zona-navy/70"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {bucket.score} / {bucket.max_points}
                    </span>
                  </div>
                  <div
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zona-navy/10"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-zona-purple-mid"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
