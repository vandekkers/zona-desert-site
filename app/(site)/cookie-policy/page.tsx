export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">Cookie Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Effective Date: 12/15/2025 • Last Updated: 12/15/2025</p>
          <p className="mt-4 text-slate-700">
            This Cookie Policy explains how Zona Desert Property Solutions LLC (&quot;Zona Desert&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies
            on our websites and apps. It should be read together with our <a href="/privacy" className="text-indigo-600 underline">Privacy Notice</a>.
          </p>

          <section className="mt-6 space-y-6 text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">1) Cookie Categories</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li><span className="font-semibold">Essential</span>: Required for core site functionality (security, load, preferences). Always active.</li>
                <li><span className="font-semibold">Analytics</span>: Help us understand traffic and usage so we can improve the experience. Opt-in.</li>
                <li><span className="font-semibold">Marketing</span>: Used for personalization and remarketing. Opt-in.</li>
              </ul>
              <p className="text-sm text-slate-600">You can manage preferences anytime via the “Cookie Settings” link in the footer.</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">2) Cookies We Use</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-800">Cookie</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Purpose</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Category</th>
                      <th className="px-4 py-3 font-semibold text-slate-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">zd_cookie_consent</td>
                      <td className="px-4 py-3">Stores your cookie preferences (analytics/marketing).</td>
                      <td className="px-4 py-3">Essential</td>
                      <td className="px-4 py-3">Up to 6 months</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">Analytics cookies (if enabled)</td>
                      <td className="px-4 py-3">Help measure traffic and usage (e.g., Vercel Analytics).</td>
                      <td className="px-4 py-3">Analytics (opt-in)</td>
                      <td className="px-4 py-3">Varies by provider</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-slate-900">Marketing cookies (if enabled)</td>
                      <td className="px-4 py-3">Support personalization/remarketing pixels.</td>
                      <td className="px-4 py-3">Marketing (opt-in)</td>
                      <td className="px-4 py-3">Varies by provider</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">3) Managing Your Preferences</h2>
              <p>You can:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Set your preferences on first visit via our cookie banner.</li>
                <li>Change them anytime using the “Cookie Settings” link in the footer.</li>
                <li>Use your browser settings to block or delete cookies (may affect functionality).</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
