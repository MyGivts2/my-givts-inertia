import { zodResolver } from "@hookform/resolvers/zod"
import { router, usePage } from "@inertiajs/react"
import { CircleAlert } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "./ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

export function AuthDialog(props: { setShowAuthDialog: (open: boolean) => void }) {
    const [activeTab, setActiveTab] = useState("login")
    const [error, setError] = useState(false)
    const { auth } = usePage<{
        auth: any
    }>().props
    // Login form
    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const signupForm = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    function onLoginSubmit(data: LoginFormValues) {
        router.post(route("login"), data, {
            preserveState: true,
            onError: (errors) => {
                console.error("Login error:", errors)
                setError(true)
            },
            onSuccess: () => {
                props.setShowAuthDialog(false)
            },
        })
    }

    function onSignupSubmit(data: SignupFormValues) {
        router.post(route("register"), data, {
            preserveState: true,
            onError: (errors) => {
                console.error("Register error:", errors)
                setError(true)
            },
            onSuccess: () => {
                props.setShowAuthDialog(false)
                toast.success("Account created successfully! Please log in.")
            },
        })
    }
    return (
        <DialogContent className="border-[#1a0f31] bg-[#2e1a57] sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className="text-white">Authenticatie</DialogTitle>
                <DialogDescription>Meld je aan bij je account of maak een nieuw account aan.</DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/20">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Registreren</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-4">
                    <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="border-2 border-white/20 text-white" placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wachtwoord</FormLabel>
                                        <FormControl>
                                            <Input className="border-2 border-white/20 text-white" type="password" placeholder="••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="mt-4 flex items-start rounded-md border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800 dark:bg-red-950">
                                    <CircleAlert className="mt-0.5 mr-2 h-5 w-5 shrink-0 text-red-500" />

                                    <div className="text-red-400 dark:text-red-200">
                                        <p>Email of wachtwoord is onjuist. Probeer het opnieuw of maak een nieuw account aan.</p>
                                    </div>
                                </div>
                            )}
                            <Button type="submit" className="w-full bg-[#eae2f3] text-black">
                                Login
                            </Button>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="signup" className="mt-4">
                    <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                            <FormField
                                control={signupForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input className="border-2 border-white/20 text-white" placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={signupForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="border-2 border-white/20 text-white" placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={signupForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input className="border-2 border-white/20 text-white" type="password" placeholder="••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-[#eae2f3] text-black">
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </DialogContent>
    )
}
