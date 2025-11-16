import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Zona Desert",
  description: "Answers to the top investor, seller, agent, and wholesaler questions."
};

const faqSections = [
  {
    label: "General FAQs",
    faqs: [
      {
        question: "What is Zona Desert?",
        answer:
          "Zona Desert is a real estate solutions and deal-sourcing platform focused on connecting buyers, sellers, agents, and wholesalers. We streamline the deal-flow ecosystem by presenting quality opportunities efficiently and transparently."
      },
      {
        question: "What kinds of deals do you offer?",
        answer:
          "Our inventory includes both on-market and off-market opportunities. Each listing clearly indicates if it is on the MLS, sourced directly by our acquisitions team, or provided by a trusted partner."
      },
      {
        question: "How are your deals sourced?",
        answer:
          "Deals come from targeted seller outreach, licensed agents, vetted wholesalers, and investor partnerships. Every listing includes transparent details about where the opportunity originated."
      },
      {
        question: "What markets do you operate in?",
        answer:
          "We operate nationwide. Some regions may have tighter inventory or more competition, but we continually expand our network to deliver diverse opportunities across the U.S."
      },
      {
        question: "Does Zona Desert charge users for access?",
        answer:
          "All tools and resources on Zona Desert are currently free. Core deal access will remain free even as premium features are introduced in the future."
      },
      {
        question: "How often are new deals added?",
        answer:
          "New opportunities are added regularly as they come in from our acquisitions team and partner network. Buyers on our list receive notifications whenever fresh deals post."
      },
      {
        question: "Does Zona Desert work with cash buyers?",
        answer:
          "Yes. Cash buyers with proof of funds and a strong track record may receive priority when multiple investors pursue the same deal."
      },
      {
        question: "Do you only work with cash buyers?",
        answer:
          "No. While cash is often preferred for speed, we work with investors leveraging private money, hard money, and creative finance strategies."
      },
      {
        question: "What types of financing are typically accepted?",
        answer:
          "Most listings are ideal for cash, private money, or hard money due to timelines. Select opportunities allow alternative or creative financing as the marketplace grows."
      },
      {
        question: "Is my personal information secure?",
        answer:
          "Absolutely. Personal and financial information is stored securely in protected internal systems and never shared with third parties."
      },
      {
        question: "How can I contact Zona Desert for support or questions?",
        answer:
          "Reach our team anytime at info@zonadesert.com. A representative will respond promptly via email or phone."
      }
    ]
  },
  {
    label: "Buyer FAQs",
    faqs: [
      {
        question: "How do I join the Buyers List?",
        answer:
          "Complete the Buyers List form with your investment criteria, preferred markets, and contact details. Once submitted, you’ll start receiving curated deal alerts that fit your profile."
      },
      {
        question: "What happens after I join the Buyers List?",
        answer:
          "Your profile feeds into our internal buyer database. When new opportunities match your criteria, we’ll deliver them straight to your inbox."
      },
      {
        question: "How often will I receive deals in my inbox?",
        answer:
          "Frequency depends on market conditions and your criteria. Some buyers see new options multiple times a week, while more specific buy boxes may receive deals less frequently."
      },
      {
        question: "Can I choose which markets I receive deals from?",
        answer:
          "Yes. Select your preferred states and counties when you join. Deal alerts will focus on those areas, and you can update preferences anytime."
      },
      {
        question: "How do you decide which deals to send me?",
        answer:
          "We match opportunities to your markets, budget, strategies, and return requirements, prioritizing the deals that best align with your stated criteria."
      },
      {
        question: "Do you underwrite or pre-screen deals before sending them?",
        answer:
          "We review each opportunity to ensure core details are accurate and relevant, but every buyer should conduct independent due diligence before investing."
      },
      {
        question: "Do you provide rent estimates, cap rates, and ARV on every deal?",
        answer:
          "Most listings include rent estimates, cap rate projections, ARV analysis, and when available, comps or renovation notes to support your evaluation."
      },
      {
        question: "Can I request custom deal criteria?",
        answer:
          "Yes. Specify preferred returns, strategies, and financing preferences during signup, and we’ll match you with deals that fit those filters."
      },
      {
        question: "What’s the process to lock up a deal once I’m interested?",
        answer:
          "Use the “Submit Offer” or “Request Access” button on the listing. Our team or the deal holder will follow up to confirm terms and verify funding before securing the property."
      },
      {
        question: "Are these assignments, double closes, or direct purchases from sellers?",
        answer:
          "Deal structures vary. Many are assignments, some involve double closes, and others are direct-to-seller agreements. Each listing specifies the structure for transparency."
      },
      {
        question: "Do you help with property management or referrals after closing?",
        answer:
          "While we don’t directly provide property management, we can connect buyers with vetted managers, lenders, contractors, or other pros in select markets."
      },
      {
        question: "Can I buy properties in an LLC or under a different entity?",
        answer:
          "Yes. You can close under an LLC, trust, corporation, or another approved entity. Provide the appropriate documentation during closing."
      },
      {
        question: "How quickly do I need to make decisions on your deals?",
        answer:
          "Many deals move fast. Review listings promptly and submit offers as soon as possible to maximize your chances of securing the property."
      },
      {
        question: "What happens if multiple buyers want the same deal?",
        answer:
          "We evaluate offers based on price, terms, and readiness. Cash buyers or those with verified funding may be prioritized to ensure reliable closings."
      },
      {
        question: "Do you require proof of funds or pre-approval to move forward?",
        answer:
          "Competitive deals may require proof of funds or lender approval before accepting an offer. This helps ensure smooth and dependable closings."
      },
      {
        question: "Are inspection periods or due diligence windows available?",
        answer:
          "Inspection periods vary. Some deals offer limited due diligence windows, while others require “as-is” offers. Each listing outlines its specific terms."
      },
      {
        question: "Can out-of-state buyers work with Zona Desert?",
        answer:
          "Absolutely. Many buyers purchase outside their home state. We provide key information for remote evaluation and, when available, can refer market-specific service providers."
      },
      {
        question: "What fees does Zona Desert charge buyers?",
        answer:
          "Zona Desert doesn’t charge platform or subscription fees. Assignment fees, when applicable, are baked into the deal structure and only paid when a transaction closes."
      }
    ]
  },
  {
    label: "Seller FAQs",
    faqs: [
      {
        question: "What does Zona Desert do for sellers?",
        answer:
          "We connect property owners with serious investors, agents, and qualified buyers nationwide. Your property is analyzed, reviewed for condition, and matched with the best buyers in our network."
      },
      {
        question: "How fast can I get an offer?",
        answer:
          "Most sellers receive an initial response within 24 hours. Offer timelines depend on property specifics, but distressed or investment-ready homes often receive interest quickly."
      },
      {
        question: "Do you buy properties directly?",
        answer:
          "Often. We may purchase directly, assign to a vetted investor, or connect you with buyers through the marketplace—whichever path provides the fastest, cleanest closing."
      },
      {
        question: "Is there any cost to submit my property?",
        answer:
          "No. There are no fees to submit or receive offers. If an assignment or wholesale fee applies, it’s built into the deal structure—not paid upfront by you."
      },
      {
        question: "Will you list my property on the MLS?",
        answer:
          "Only if you want us to. Most sellers choose Zona Desert for speed and investor-friendly terms, not MLS exposure. If needed, we can connect you with an agent, but it’s optional."
      },
      {
        question: "Who are the buyers making offers?",
        answer:
          "Buyers include vetted investors, cash buyers, funds, wholesalers, and licensed agents. All parties are screened to ensure they can close."
      },
      {
        question: "What types of properties do you buy?",
        answer:
          "Single-family homes, multifamily, distressed properties, rentals, vacant homes, inherited houses, pre-foreclosures, and more—if it’s a residential investment opportunity, our network likely has buyers."
      },
      {
        question: "Do you purchase properties as-is?",
        answer:
          "Yes. Investment buyers typically prefer as-is properties and factor repairs into their offers. No need to fix or upgrade beforehand."
      },
      {
        question: "Can I sell if the property needs major repairs?",
        answer:
          "Absolutely. We regularly handle properties needing major rehab or structural work—often attracting investor interest."
      },
      {
        question: "Are there obligations after submitting my property?",
        answer:
          "No. You’re under no obligation to accept any offer. Review, question, or decline as you wish."
      },
      {
        question: "How does the closing process work?",
        answer:
          "Once you accept an offer, we coordinate the contract, disclosures, and timeline with the buyer and title company. Most investments close in 7–21 days."
      },
      {
        question: "Can I sell if I have tenants in place?",
        answer:
          "Yes. Many investors prefer tenant-occupied properties. Just provide accurate lease details when submitting."
      },
      {
        question: "Do you work with wholesalers or agents representing sellers?",
        answer:
          "Yes. Wholesalers and agents are welcome. Agent submissions are guided to the Agent Partnership Program; wholesalers to the Wholesaler Partnership Program."
      },
      {
        question: "Will my personal information remain private?",
        answer:
          "Yes. Seller data is securely stored internally and never shared outside the transaction process."
      },
      {
        question: "Who can I contact about selling questions?",
        answer:
          "Email info@zonadesert.com and a representative will respond promptly via email or phone."
      }
    ]
  },
  {
    label: "Agent FAQs",
    faqs: [
      {
        question: "What is the Zona Desert Agent Partnership Program?",
        answer:
          "It’s a program for licensed agents to submit investment-ready properties, pocket listings, or off-market opportunities. We help move unique or distressed deals quickly with transparency and professionalism."
      },
      {
        question: "What types of properties should agents submit?",
        answer:
          "On-market listings, off-market deals, distressed homes, pre-foreclosures, tenant-occupied rentals, portfolios—anything suited for investors or cash buyers is welcome."
      },
      {
        question: "Do you accept MLS listings from agents?",
        answer:
          "Yes. Provide clear details, photos, and pricing. Each listing displays whether it’s on-market or off-market so buyers know exactly what they’re viewing."
      },
      {
        question: "How do agents submit a property?",
        answer:
          "Complete the Agent Submission Form with property info, pricing guidance, access notes, and supporting documentation. We review and process it for posting or matchmaking."
      },
      {
        question: "Is there a cost for agents to participate?",
        answer:
          "No. Joining the partnership program and submitting deals is completely free."
      },
      {
        question: "How does Zona Desert work with agent commissions?",
        answer:
          "On-market listings follow standard MLS commission rules. For off-market deals, compensation is handled via agreements between the agent, seller, and buyer—agents retain control of their commissions."
      },
      {
        question: "Do agents lose control of their client relationships?",
        answer:
          "No. Agents maintain full representation and control over their clients throughout the transaction."
      },
      {
        question: "How fast will my property be reviewed?",
        answer:
          "Most submissions are reviewed the same day. If more details are needed, we’ll reach out promptly to ensure accurate representation."
      },
      {
        question: "Will you market my listing for me?",
        answer:
          "Yes. Approved listings are showcased to our nationwide buyer network, increasing visibility—especially among cash buyers and investors."
      },
      {
        question: "Who are the buyers that will see my listing?",
        answer:
          "Verified cash investors, landlords, funds, wholesalers, and serious acquisition groups—all screened for credibility."
      },
      {
        question: "Do you verify buyers before sending them my way?",
        answer:
          "Yes. Buyers may need to provide proof of funds or lending approval so you only engage with ready-to-close prospects."
      },
      {
        question: "Are listings exclusive to Zona Desert?",
        answer:
          "Not automatically. You can submit listings whether or not they appear elsewhere. Zona Desert simply offers extra exposure and investor access."
      },
      {
        question: "Does Zona Desert take any portion of my commission?",
        answer:
          "No. Agents keep their full commission unless they have a separate agreement with their client. We don’t deduct or interfere with compensation."
      },
      {
        question: "How does Zona Desert handle disclosures and contracts?",
        answer:
          "Agents remain responsible for contracts, disclosures, and legal compliance. We can assist with communication but do not replace your fiduciary role."
      },
      {
        question: "Can agents submit multiple properties?",
        answer:
          "Absolutely. Submit as many on-market or off-market opportunities as you have. High-volume contributors may receive extra support and visibility."
      },
      {
        question: "How can agents contact Zona Desert for support?",
        answer:
          "Email info@zonadesert.com for deal inquiries, submissions, or partnership assistance."
      }
    ]
  },
  {
    label: "Wholesaler FAQs",
    faqs: [
      {
        question: "What is the Zona Desert Wholesaler Partnership Program?",
        answer:
          "It allows wholesalers to submit deals for underwriting, disposition, and placement with qualified buyers. We connect you with an active investor base to move inventory faster and with confidence."
      },
      {
        question: "What types of deals can wholesalers submit?",
        answer:
          "Single-family homes, small multifamily, distressed assets, rentals, off-market opportunities, pre-foreclosures, creative finance deals—if it works for investors, we can help place it."
      },
      {
        question: "Do you accept daisy-chain deals?",
        answer:
          "Yes, if you have direct communication with the contract holder and can provide accurate terms, access instructions, and documentation. Transparency is essential."
      },
      {
        question: "How are assignment fees structured?",
        answer:
          "We operate on a 70/30 split—wholesalers receive 70% of the assignment fee and Zona Desert receives 30% for disposition, marketing, and transaction support. The split only applies when we successfully move the deal."
      },
      {
        question: "How do wholesalers submit a deal?",
        answer:
          "Complete the Wholesaler Submission Form with property details, contract terms, assignment fee, photos, notes, and access instructions. If it fits investor criteria, we’ll start reviewing right away."
      },
      {
        question: "Will my deal be publicly posted on the platform?",
        answer:
          "Some deals are posted publicly, while others are shared privately through our buyer network. We choose the route that best balances exposure with confidentiality."
      },
      {
        question: "How fast can Zona Desert move a deal?",
        answer:
          "Timing depends on deal quality and pricing, but many attract buyer interest within 24–72 hours when priced well and accompanied by complete details."
      },
      {
        question: "Do wholesalers need to provide photos or comps?",
        answer:
          "Yes, providing photos, comps, repair notes, rent data, and access instructions speeds up underwriting and increases the odds of a quick disposition."
      },
      {
        question: "What happens after I submit a deal?",
        answer:
          "We review it for accuracy and investor readiness. If approved, we determine the best disposition strategy and begin marketing it to buyers, keeping you updated throughout."
      },
      {
        question: "Do I need to sign a JV agreement?",
        answer:
          "If we proceed, we’ll provide a simple JV or marketing agreement outlining the 70/30 split and confirming the working relationship."
      },
      {
        question: "Do you help with creative finance deals?",
        answer:
          "Yes. We work with subject-to, seller-finance, and hybrid structures. Submit full terms, PITI information, underlying loan details, and seller approvals when applicable."
      },
      {
        question: "What if I already have a buyer?",
        answer:
          "If you only need underwriting, marketing, or administrative support, note that in your submission. We’re here to assist, not replace your existing relationships."
      },
      {
        question: "Can wholesalers outside my state submit deals?",
        answer:
          "Yes, as long as you have equitable interest or a clear JV pathway with the contract holder, you can submit deals from any U.S. market."
      },
      {
        question: "How does Zona Desert handle communication between buyers and wholesalers?",
        answer:
          "Our disposition team manages communication, buyer vetting, follow-up, negotiation, and document coordination to keep the process smooth and confidential."
      },
      {
        question: "Are my submissions kept private?",
        answer:
          "Yes. Submitted deals remain confidential and are only shared with vetted investors or posted publicly when appropriate."
      },
      {
        question: "How can wholesalers contact Zona Desert?",
        answer:
          "Email info@zonadesert.com for deal support, submission questions, or partnership inquiries."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zona-purple">FAQ</p>
        <h1 className="text-4xl font-semibold text-slate-900">Questions We Hear The Most.</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {faqSections.map((section) => {
          const anchor = section.label.toLowerCase().replace(/\s+/g, "-");
          return (
            <a
              key={section.label}
              href={`#${anchor}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-zona-purple hover:text-zona-purple"
            >
              {section.label}
            </a>
          );
        })}
      </div>

      <div className="space-y-3">
        {faqSections.map((section) => {
          const anchor = section.label.toLowerCase().replace(/\s+/g, "-");
          return (
            <details
              key={section.label}
              id={anchor}
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <summary className="cursor-pointer text-base font-semibold text-slate-900">
                {section.label}
              </summary>
              {section.faqs.length ? (
                <div className="mt-3 space-y-3">
                  {section.faqs.map((faq) => (
                    <details key={faq.question} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-slate-900">{faq.question}</summary>
                    <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Select frequently asked questions will live here soon.</p>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
