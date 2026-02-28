'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createReport() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data, error } = await supabase
        .from('reports')
        .insert([{ user_id: user.id, title: 'Untitled Path Report' }])
        .select()
        .single()

    if (error || !data) {
        console.error(error)
        throw new Error('Failed to create report')
    }

    redirect(`/editor/${data.id}`)
}
