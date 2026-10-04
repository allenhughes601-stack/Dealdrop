import { createServerClient } from "@supabase/ssr";
import { cookies } from 'next/headers';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value; } } }
  );

  // Fetch the 10 most recent pipeline runs
  const { data: feedRuns } = await supabase
    .from('feed_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(10);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Recent Feed Ingestions</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Network</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Processed</th>
            <th className="border p-2">Failed</th>
            <th className="border p-2">Started At</th>
          </tr>
        </thead>
        <tbody>
          {feedRuns?.map((run) => (
            <tr key={run.id}>
              <td className="border p-2">{run.network_id}</td>
              <td className="border p-2">{run.category}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  run.status === 'success' ? 'bg-green-100 text-green-800' :
                  run.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100'
                }`}>
                  {run.status.toUpperCase()}
                </span>
              </td>
              <td className="border p-2">{run.records_processed || 0}</td>
              <td className="border p-2">{run.records_failed || 0}</td>
              <td className="border p-2">{new Date(run.started_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}