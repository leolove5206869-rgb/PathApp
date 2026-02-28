import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch reports for this user
    const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold tracking-tight">PathApp Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <form action={logout}>
                        <Button variant="ghost" size="sm">Log out</Button>
                    </form>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Your Reports</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and view your generated individual path reports.</p>
                    </div>
                    <Button>+ Generate New Report</Button>
                </div>

                {reports && reports.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No reports</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by generating your first path report.</p>
                        <div className="mt-6">
                            <Button>+ Generate New Report</Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reports?.map((report) => (
                            <div key={report.id} className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-medium text-lg mb-1">{report.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{report.core_concept || 'No description provided.'}</p>
                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" size="sm" className="w-full">View</Button>
                                    <Button variant="outline" size="sm" className="w-full">Edit</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
