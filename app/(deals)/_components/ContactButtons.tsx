// BREAKAWAY: deals board — remove at platform launch
//
// No forms by design: contact is tel:/sms:/mailto: links prefilled with
// the deal address, pointing at the phone/email in content/deals-config.json.

import type { Deal, DealsConfig } from "../_lib/deals";

function contactLinks(deal: Deal, config: DealsConfig) {
  const shortAddress = `${deal.address}, ${deal.city}`;
  const smsBody = encodeURIComponent(
    `Hi — I'm interested in ${shortAddress}. Is it still available?`
  );
  const emailSubject = encodeURIComponent(`${shortAddress} — deal inquiry`);
  const emailBody = encodeURIComponent(
    `Hi,\n\nI saw ${shortAddress} on the Zona Desert deal board and I'm interested. Can you send more details?\n`
  );
  return {
    // "?&body=" (not "?body=") is deliberate — the quirk that works across
    // both iOS and Android SMS URL parsing.
    call: `tel:${config.phone}`,
    text: `sms:${config.phone}?&body=${smsBody}`,
    email: `mailto:${config.email}?subject=${emailSubject}&body=${emailBody}`
  };
}

interface Props {
  deal: Deal;
  config: DealsConfig;
  layout: "row" | "stack";
}

export function ContactButtons({ deal, config, layout }: Props) {
  const links = contactLinks(deal, config);
  const base =
    "flex flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition";
  return (
    <div className={`flex gap-2 ${layout === "stack" ? "flex-col" : "flex-row"}`}>
      <a
        href={links.call}
        className={`${base} border border-zona-purple-deep text-zona-purple-deep hover:bg-zona-purple-deep/10`}
      >
        Call
      </a>
      <a
        href={links.text}
        className={`${base} border border-zona-purple-mid text-zona-purple-mid hover:bg-zona-purple-mid/10`}
      >
        Text
      </a>
      <a
        href={links.email}
        className={`${base} border border-slate-300 text-slate-700 hover:bg-slate-100`}
      >
        Email
      </a>
    </div>
  );
}
