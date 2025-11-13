import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zonadesert.com";
  const routes = [
    "",
    "/listings",
    "/sell",
    "/buyers/join",
    "/agents/apply",
    "/wholesalers/apply",
    "/about",
    "/how-it-works",
    "/faq"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));
}
