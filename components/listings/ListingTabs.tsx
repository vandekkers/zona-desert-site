"use client";

import { ReactNode, useState } from "react";

// Phase 5.5.b — public listing 3-tab shell.
//
// SSR DISCIPLINE: this is a TINY client island that toggles visibility
// CSS classes on already-rendered server panels. Tab content is rendered
// server-side by the parent page so search-engine crawlers see the full
// listing payload in the initial HTML. JavaScript only swaps which panel
// is visible; turning JS off leaves the user on Overview with no broken
// UI.

type TabId = "overview" | "bid-buy" | "deal-data";

interface TabDefinition {
  id: TabId;
  label: string;
}

const TABS: readonly TabDefinition[] = [
  { id: "overview", label: "Overview" },
  { id: "bid-buy", label: "Bid & Buy" },
  { id: "deal-data", label: "Deal Data" }
];

interface ListingTabsProps {
  overview: ReactNode;
  bidBuy: ReactNode;
  dealData: ReactNode;
}

export default function ListingTabs({ overview, bidBuy, dealData }: ListingTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const panels: Record<TabId, ReactNode> = {
    overview,
    "bid-buy": bidBuy,
    "deal-data": dealData
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Listing detail sections"
        className="sticky top-0 z-10 -mx-4 flex gap-1 overflow-x-auto border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:mx-0 sm:gap-2 sm:px-0"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "border-zona-purple text-zona-purple"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {TABS.map((tab) => (
          <section
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className={activeTab === tab.id ? "space-y-8" : ""}
          >
            {panels[tab.id]}
          </section>
        ))}
      </div>
    </div>
  );
}
