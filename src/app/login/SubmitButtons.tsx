'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { login, signup } from '@/app/actions/auth'

export function SubmitButtons() {
    const { pending } = useFormStatus()

    return (
        <div className="flex flex-col space-y-2 w-full mt-4">
            <Button
                formAction={login}
                className="w-full"
                disabled={pending}
            >
                {pending ? "Please wait..." : "Login"}
            </Button>
            <Button
                formAction={signup}
                variant="outline"
                className="w-full"
                disabled={pending}
            >
                {pending ? "Please wait..." : "Sign Up"}
            </Button>
        </div>
    )
}
