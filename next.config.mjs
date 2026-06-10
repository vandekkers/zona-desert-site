/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Phase 5.5.fix — production listing photos are uploaded to S3 via
    // app/services/aws.py on the backend ({bucket}.s3.{region}.amazonaws.com).
    // Without this whitelist, next/image rejects every external host with a
    // server-side 500 — the 5.5.b listing detail page crashed the moment a
    // listing carried photos. ** matches multi-level subdomains so any
    // bucket/region combination resolves cleanly.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com"
      }
    ]
  }
};

export default nextConfig;
