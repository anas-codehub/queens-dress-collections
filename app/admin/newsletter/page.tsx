import { db } from "@/lib/db";

export default async function NewsletterPage() {
  const subscribers = await db.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[10px] text-brand-500 tracking-[0.2em] uppercase mb-1">
          Marketing
        </p>
        <h1 className="font-serif text-3xl text-brand-900">Newsletter</h1>
        <p className="text-xs text-brand-400 tracking-wide mt-1">
          {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white border border-brand-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-200 bg-brand-50">
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                #
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Email
              </th>
              <th className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium">
                Subscribed
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-12 text-xs text-brand-400 tracking-wide"
                >
                  No subscribers yet
                </td>
              </tr>
            ) : (
              subscribers.map((sub, i) => (
                <tr
                  key={sub.id}
                  className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-brand-400">{i + 1}</td>
                  <td className="px-4 py-3 text-xs text-brand-800 tracking-wide">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-brand-400 tracking-wide">
                    {new Date(sub.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
