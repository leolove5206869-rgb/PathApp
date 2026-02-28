import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Download, Play, MessageSquare, LayoutTemplate } from 'lucide-react'
import Link from 'next/link'

export default async function EditorPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Next up: we will fetch the specific report using params.id
    // const { data: report } = await supabase.from('reports').select('*').eq('id', params.id).single()

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            {/* Top Bar */}
            <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-sm font-semibold">Editing Report: #{params.id}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                    <Button size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                </div>
            </header>

            {/* 3-Panel Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Navigation */}
                <aside className="w-64 border-r bg-gray-50/30 flex flex-col">
                    <div className="p-4 font-medium text-sm text-gray-500 uppercase tracking-wider">
                        Sections
                    </div>
                    <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                        <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-gray-200/50 font-medium">
                            1. Basic Info
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600">
                            2. Timeline Stages
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600">
                            3. Funnel Layers
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600">
                            4. Revenue Nodes
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-600">
                            5. Product Matrix
                        </button>
                    </nav>
                </aside>

                {/* Middle Panel: Main Editor */}
                <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Report Title</label>
                                <input
                                    type="text"
                                    className="w-full text-3xl font-bold border-none placeholder:text-gray-300 focus:ring-0 p-0"
                                    placeholder="Untitled Report"
                                    defaultValue={"Guan Yadi Career Path"}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Core Concept</label>
                                <textarea
                                    className="w-full h-32 resize-none border-none placeholder:text-gray-300 focus:ring-0 p-0 text-gray-600"
                                    placeholder="Describe the core concept..."
                                    defaultValue={"Using extreme sports content as a vehicle to bridge..."}
                                />
                            </div>

                            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                                <LayoutTemplate className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p>Select a section on the left to edit specific data nodes.</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Panel: AI Assistant */}
                <aside className="w-80 border-l bg-gray-50/50 flex flex-col">
                    <div className="h-12 border-b flex items-center px-4 font-medium text-sm gap-2">
                        <MessageSquare className="h-4 w-4" />
                        AI Assistant
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                        <div className="bg-white border rounded-lg p-3 shadow-sm">
                            <p className="text-gray-600">Hello! I'm your AI analyst. Click below to auto-generate the selected section based on the user's basic info.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-white border-t">
                        <Button className="w-full" variant="default">
                            ✨ Auto-Generate Content
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
