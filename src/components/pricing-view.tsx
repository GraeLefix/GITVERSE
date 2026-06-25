export function PricingView() {
  const freeTier = [
    "10 reverse-engineering runs / day",
    "Quick analysis mode",
    "Public repos only",
    "Copy build prompts",
    "Library access",
  ];
  const premiumTier = [
    "Unlimited runs",
    "Deep analysis mode",
    "Private repo support",
    "Priority LLM queue",
    "Prompt history & library",
    "API access",
    "Priority support",
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white">Simple pricing</h1>
        <p className="mt-2 text-sm text-gray-400">Start free. Go premium when you need more.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-[#2a2a3e] bg-[#16161f] p-8">
          <h2 className="text-lg font-semibold text-white">Free</h2>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="mb-1 text-sm text-gray-500">/month</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-gray-400">
            {freeTier.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <button className="mt-8 w-full rounded-xl border border-[#2a2a3e] py-2.5 text-sm font-medium text-gray-300 hover:border-indigo-500/50 hover:text-white transition-colors">
            Get started free
          </button>
        </div>

        <div className="rounded-2xl border border-indigo-500/50 bg-[#16161f] p-8 relative">
          <div className="absolute top-3 right-3 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            Popular
          </div>
          <h2 className="text-lg font-semibold text-white">Premium</h2>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-4xl font-bold text-white">$9</span>
            <span className="mb-1 text-sm text-gray-500">/month</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-gray-400">
            {premiumTier.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <button className="mt-8 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Start premium →
          </button>
        </div>
      </div>
    </div>
  );
}
