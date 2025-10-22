import { AuthDialog } from "@/components/auth-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { productUrl } from "@/helpers/utils"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { Head, Link, router, usePage } from "@inertiajs/react"
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTiktok } from "@tabler/icons-react"
import { Heart, Menu, Trash, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
    const { auth, url } = usePage<{
        auth: any
    }>().props
    const [showAuthDialog, setShowAuthDialog] = useState(false)

    useEffect(() => {
        // @ts-ignore
        window.dataLayer = window.dataLayer || []
        // @ts-ignore
        window.dataLayer.push({
            event: "pageview",
            page: url,
        })
    }, [url])

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Toaster />
            <div
                onScroll={(e) => {
                    console.log(e)
                }}
                className="flex min-h-screen flex-col bg-[#eae1f3]"
            >
                <Header setShowAuthDialog={setShowAuthDialog} />
                <main className="relative flex-1">
                    {children}
                    {/* <section className="relative rounded-tr-[80px] py-12 md:py-20"></section> */}
                </main>
                <Footer />
                <Dialog
                    open={showAuthDialog}
                    onOpenChange={(open) => {
                        setShowAuthDialog(open)
                    }}
                >
                    <DialogTrigger asChild>
                        <Button size={"icon"} className="fixed right-4 bottom-8 z-40 h-12 w-12 cursor-pointer bg-[#2e1a57]/80">
                            {auth.user && auth.user.favorites && auth.user.favorites.length > 0 && (
                                <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-black">
                                    {auth.user.favorites.length}
                                </div>
                            )}
                            <Heart className="size-9 h-6 w-6" />
                        </Button>
                    </DialogTrigger>
                    {auth && auth.user ? <FavoritesModal products={auth.user.favorites} /> : <AuthDialog setShowAuthDialog={setShowAuthDialog} />}
                </Dialog>
            </div>
        </>
    )
}

const Header = (props: { setShowAuthDialog: (open: boolean) => void }) => {
    const [showSideBar, setShowSideBar] = useState(false)

    const links = [
        {
            href: "/",
            label: "Home",
        },
        {
            href: "/how-does-it-work",
            label: "Hoe werkt het?",
        },
    ]
    return (
        <>
            <div
                className={`fixed inset-0 z-50 block transform bg-[#2e1a57] text-white duration-500 sm:hidden ${showSideBar ? "translate-x-0" : "-translate-x-full"}`}
            >
                <ul className="flex flex-col items-start justify-between gap-3 px-10 py-8 text-base">
                    <button onClick={() => setShowSideBar(false)} className="ml-auto">
                        <X size={30} />
                    </button>
                    {links.map(({ href, label }) => (
                        <li onClick={() => setShowSideBar(false)} className="pb-2" key={`${href}-${label}`}>
                            <Link href={href} className={window.location.pathname === href ? "font-bold" : ""}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <header className="w-full overflow-hidden bg-[#2e1a57] py-6 backdrop-blur sm:py-12">
                <div className="container mx-auto grid max-w-7xl grid-cols-6 items-center px-8 sm:grid-cols-3">
                    <button onClick={() => setShowSideBar(true)} className="text-white sm:hidden">
                        <Menu />
                    </button>
                    <Link href="/" className="col-span-4 flex items-center justify-center space-x-2 sm:col-span-1 sm:justify-start">
                        <img src="/logo.svg" className="w-7" alt="" />
                        <span className="text-3xl font-bold text-white">MyGivts</span>
                    </Link>
                    <div className="mx-auto hidden items-center sm:flex">
                        <nav className="flex items-center justify-end rounded-xl bg-white/10 p-1 text-[#eae2f3] sm:p-2">
                            <button
                                className={cn(
                                    "w-24 rounded-md py-2 text-xs sm:w-32 sm:text-sm",
                                    window.location.pathname === "/" ? "bg-[#2e1a57] text-white" : "",
                                )}
                            >
                                <Link href="/">Home</Link>
                            </button>
                            <button
                                className={cn(
                                    "w-24 rounded-md py-2 text-xs sm:w-32 sm:text-sm",
                                    window.location.pathname === "/how-does-it-work" ? "bg-[#2e1a57] text-white" : "",
                                )}
                            >
                                <Link href="/how-does-it-work">Hoe werkt het?</Link>
                            </button>
                        </nav>
                    </div>
                    <button onClick={() => props.setShowAuthDialog(true)} className="ml-auto sm:hidden">
                        <User className="h-6 w-6 text-white" />
                    </button>
                    <ul className="hidden items-center justify-end gap-8 font-semibold text-[#eae2f3] sm:flex">
                        <li onClick={() => props.setShowAuthDialog(true)}>
                            <button className="cursor-pointer">Login</button>
                        </li>
                        <li onClick={() => props.setShowAuthDialog(true)}>
                            <button className="cursor-pointer rounded bg-[#eae2f3] px-4 py-1.5 text-black">Sign Up</button>
                        </li>
                    </ul>
                </div>
            </header>
        </>
    )
}

const Footer = () => {
    return (
        <footer className="py-6 md:py-0">
            <div className="container mx-auto flex max-w-5xl flex-col-reverse items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="grid gap-1">
                    <p className="text-center text-sm leading-loose text-gray-500 md:text-left">© 2025 MyGivts. Alle rechten voorbehouden.</p>
                    <nav className="flex items-center justify-center gap-4 text-xs font-bold text-gray-400 uppercase md:justify-start">
                        <Link href="/" className={window.location.pathname === "/" ? "text-[#2e1a57]" : ""}>
                            Home
                        </Link>
                        <Link href="/profile" className={window.location.pathname === "/profile" ? "text-[#2e1a57]" : ""}>
                            Profiel
                        </Link>
                        <Link href="/about-us" className={window.location.pathname === "/about-us" ? "text-[#2e1a57]" : ""}>
                            Over ons
                        </Link>
                        <a href="/blogs" className={window.location.pathname === "/blogs" ? "text-[#2e1a57]" : ""}>
                            Blogs
                        </a>
                    </nav>
                </div>
                <div className="text-muted-foreground flex items-center gap-4">
                    <a href="https://www.facebook.com/p/MyGivts-NL-100089637376205/?_rdr" target="_blank">
                        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                            <IconBrandFacebook className="h-6! w-6!" />
                            <span className="sr-only">Facebook</span>
                        </Button>
                    </a>
                    <a href="https://www.linkedin.com/company/mygivts/" target="_blank">
                        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                            <IconBrandLinkedin className="h-6! w-6!" />
                            <span className="sr-only">LinkedIn</span>
                        </Button>
                    </a>
                    <a href="https://www.instagram.com/mygivts/" target="_blank">
                        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                            <IconBrandInstagram className="h-6! w-6!" />
                            <span className="sr-only">Instagram</span>
                        </Button>
                    </a>
                    <a href="https://www.tiktok.com/@mygivtsnl?_t=ZN-8u53lLch7Hq&_r=1" target="_blank">
                        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                            <IconBrandTiktok className="h-6! w-6!" />
                            <span className="sr-only">TikTok</span>
                        </Button>
                    </a>
                </div>
            </div>
        </footer>
    )
}

function FavoritesModal({ products }: { products: Product[] }) {
    const { auth, items } = usePage<{
        auth: any
        items: Product[]
    }>().props
    const removeFromFavorites = (id: number) => {
        if (auth?.user) {
            router.post(
                route("favorites.remove"),
                {
                    product_id: id,
                    items: JSON.stringify(items),
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        toast.success("Givt is verwijderd uit favorieten!")
                    },
                },
            )
        }
    }
    return (
        <DialogContent className="z-[500] bg-[#eae1f3]">
            <DialogHeader>
                <DialogTitle className="font-bold text-[#2e1a57]/80">Favoriete producten</DialogTitle>
                <DialogDescription className="text-[#2e1a57]/40">Producten die je aan je favorietenlijst hebt toegevoegd.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-4 pr-2">
                {products.length === 0 ? (
                    <div className="py-8 text-center">
                        <Heart className="text-muted-foreground mx-auto h-12 w-12 stroke-1" />
                        <p className="text-muted-foreground mt-4">Je favorietenlijst is leeg</p>
                        <p className="text-muted-foreground text-sm">Voeg producten toe aan je favorieten door op het harticoon te klikken</p>
                    </div>
                ) : (
                    <div className="grid w-full gap-4">
                        {products.map((product: Product) => (
                            <div key={product.id} className="flex items-start gap-4 rounded-lg border bg-white p-2">
                                <div className="flex items-center gap-2">
                                    <a href={productUrl(product)} target="_blank">
                                        <img
                                            src={product.image_url ?? `https://mygivts.nl/product-image/${product.id}`}
                                            alt={product.name}
                                            className="h-24 w-24 rounded-md object-cover"
                                        />
                                        <div className="grid min-w-0 flex-1">
                                            <h3 className="font-medium">{product.name}</h3>
                                            <p className="text-muted-foreground line-clamp-3 text-sm">{product.description}</p>
                                            <p className="mt-1 font-medium">€{product.price}</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="flex h-full flex-1 flex-col justify-between">
                                    <Button variant="ghost" size="icon" className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700">
                                        <Heart className="h-5 w-5 fill-current" />
                                        <span className="sr-only">Remove from favorites</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFromFavorites(product.id)}
                                        className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash className="h-5 w-5" />
                                        <span className="sr-only">Remove from favorites</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DialogContent>
    )
}
