import type { MetadataRoute } from "next";
import { getDeals } from "./(v2)/_lib/deals";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zonadesert.com";
  const routes = [
    "",
    "/deals",
    "/sell",
    "/buyers",
    "/agents",
    "/wholesalers",
    "/about",
    "/how-it-works",
    "/faq",
    "/privacy",
    "/terms",
    "/cookie-policy"
  ];

  const dealPages = getDeals()
    .filter((deal) => deal.status !== "sold")
    .map((deal) => ({
      url: `${baseUrl}/deals/${deal.id}`,
      lastModified: new Date()
    }));

  return [
    ...routes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...dealPages
  ];
}
