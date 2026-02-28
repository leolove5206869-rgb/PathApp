import { login, signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <Card className="w-full max-w-md">
                <form>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">
                            Welcome to PathApp
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email below to login or create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {searchParams?.message && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {searchParams.message}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button formAction={login} className="w-full">
                            Login
                        </Button>
                        <Button formAction={signup} variant="outline" className="w-full">
                            Sign Up
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
