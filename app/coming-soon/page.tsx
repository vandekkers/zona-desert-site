import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zona Desert | Coming soon",
  description: "Zona Desert Property Solutions — coming soon."
};

const FACEBOOK_URL = "https://www.facebook.com/share/1J4m5omk6L/?mibextid=wwXIfr";
const INSTAGRAM_URL =
  "https://www.instagram.com/zona.desert?igsh=MXNkbTNzM205bGg0MQ%3D%3D&utm_source=qr";
const SOCIAL_HANDLE = "@zona.desert";

const FACEBOOK_PATH =
  "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z";
const INSTAGRAM_PATH =
  "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0Zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03Zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162ZM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4Zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439Z";

export default function ComingSoonPage() {
  return (
    <main
      data-zona-gate="1"
      className="min-h-screen w-full bg-[#4A1988] text-white flex flex-col items-center justify-between px-6 py-16"
      style={{
        backgroundImage: "url(/brand/desert-site-wall-background.png)",
        backgroundSize: "cover",
        backgroundPosition: "65% center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/brand/zona-logo-secondary-light.png"
            alt="Zona Desert Property Solutions"
            width={480}
            height={320}
            priority
            className="w-auto h-auto max-w-[88vw] sm:max-w-[480px] mt-8 mb-6"
          />

          <h1
            className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-3"
            style={{ fontFamily: "var(--font-sora), system-ui, sans-serif" }}
          >
            Coming soon...
          </h1>

          <p
            className="text-base sm:text-lg text-white/85 mb-16"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", fontWeight: 300 }}
          >
            Something <span style={{ fontWeight: 600 }}>extraordinary</span> is on the horizon.
          </p>

          <div
            className="flex flex-col items-center gap-6"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            <p className="text-sm text-white/70">Follow us</p>
            <div className="flex items-stretch gap-8">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook — ${SOCIAL_HANDLE}`}
                className="group flex flex-col items-center gap-2 text-white transition-colors hover:text-white/70"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="currentColor"
                  aria-hidden="true"
                  role="img"
                >
                  <path d={FACEBOOK_PATH} />
                </svg>
                <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                  {SOCIAL_HANDLE}
                </span>
              </a>
              <div
                aria-hidden="true"
                className="self-stretch w-px bg-white/25"
              />
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram — ${SOCIAL_HANDLE}`}
                className="group flex flex-col items-center gap-2 text-white transition-colors hover:text-white/70"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="currentColor"
                  aria-hidden="true"
                  role="img"
                >
                  <path d={INSTAGRAM_PATH} />
                </svg>
                <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                  {SOCIAL_HANDLE}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/__owner-access"
        className="text-white/40 hover:text-white/70 text-sm transition-colors mt-16"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        Access code →
      </Link>
    </main>
  );
}
