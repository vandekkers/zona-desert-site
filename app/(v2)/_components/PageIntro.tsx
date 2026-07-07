// SITE V2 — shared page intro block (eyebrow + display heading + lede),
// used by every content and intake page for a consistent voice.

export function PageIntro({
  eyebrow,
  title,
  lede,
  center = false
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"}>
      <div
        className={`mb-3.5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-zona-purple-deep`}
      >
        <span className="h-[1.5px] w-[18px] bg-zona-purple-mid" />
        {eyebrow}
      </div>
      <h1 className="font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-zona-navy sm:text-[44px]">
        {title}
      </h1>
      {lede && (
        <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[17px]">{lede}</p>
      )}
    </div>
  );
}
