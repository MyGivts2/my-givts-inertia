import { AuthDialog } from "@/components/auth-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CardStack } from "@/components/ui/card-stack"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { productUrl } from "@/helpers/utils"
import GeneralLayout from "@/layouts/general-layout"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { Link, router, usePage } from "@inertiajs/react"
import Clarity from "@microsoft/clarity"
import { Gift, Heart, Info, ShoppingCart, Star } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export default function RecommendationsPage(props: { items: Product[] }) {
    const searchParams = useMemo(() => {
        return Object.fromEntries(new URL(window.location.href).searchParams)
    }, [])
    const profileParam = searchParams.profile ?? null
    const [profile, setProfile] = useState<any>(null)
    const [items, setItems] = useState<Product[]>(props.items)
    const [loading, setLoading] = useState(false)

    const { auth } = usePage<{
        auth: any
    }>().props

    useEffect(() => {
        const items = localStorage.getItem("items")

        if ((!props.items || props.items.length === 0) && !items) {
            router.visit("/profile")
            return
        } else {
            localStorage.setItem("items", JSON.stringify(props.items))
        }
        if (profileParam) {
            try {
                const parsedProfile = JSON.parse(decodeURIComponent(profileParam))
                localStorage.setItem("profile", JSON.stringify(parsedProfile))
                setProfile(parsedProfile)
            } catch (error) {
                console.error("Error parsing profile:", error)
            }
        }
        setItems(props.items || JSON.parse(items!))
    }, [profileParam, props.items])

    if (!profile) {
        return (
            <div className="container flex min-h-screen items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Geen Profiel Gevonden</CardTitle>
                        <CardDescription>Maak een profiel aan om cadeau-aanbevelingen te ontvangen.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/profile">Profiel Aanmaken</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <GeneralLayout>
            <div className="container mx-auto max-w-6xl">
                {items.length === 0 ? (
                    <div className="py-10 text-center">
                        <Gift className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <h2 className="mb-2 text-xl font-semibold">No recommendations found</h2>
                        <p className="text-muted-foreground mb-6">Try adjusting your profile preferences to see more gift options.</p>
                        <Button asChild>
                            <Link href="/profile">Update Profile</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((gift) => (
                                <ProductRecommendation key={gift.id} gift={gift} />
                            ))}
                        </div>
                        {loading && (
                            <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white/80">
                                <CardStack
                                    items={items.map((product, index) => ({
                                        id: index,
                                        name: product.price,
                                        designation: product.name,
                                        content: (
                                            <div className="grid gap-2">
                                                <img src={product.image_url} alt={product.name} className="aspect-square object-cover" />
                                                <p className="line-clamp-3">{product.description}</p>
                                            </div>
                                        ),
                                    }))}
                                />
                            </div>
                        )}
                    </>
                )}

                <div className="mx-auto mt-10 flex items-center justify-center gap-2 text-center">
                    <Link href="/profile" className="text-muted-foreground text-sm">
                        <Button variant="outline" className="border border-[#2e1a57]/60 bg-transparent text-[#2e1a57] hover:bg-[#2e1a57]/60">
                            Reset zoeken
                        </Button>
                    </Link>
                    <Button
                        onClick={() => {
                            setLoading(true)
                            router.post(
                                `/recommendations?profile=${encodeURIComponent(JSON.stringify(profile))}`,
                                { ...profile, productIds: items.map((item) => item.id) },
                                {
                                    onProgress: () => {
                                        setLoading(true)
                                    },
                                    onSuccess: (response) => {
                                        console.log("Recommendations refreshed:", response)
                                        setLoading(false)
                                        toast.success("Producten zijn gereset!")
                                    },
                                },
                            )
                        }}
                        variant="outline"
                        className="border-none bg-[#2e1a57]/60 text-white hover:bg-[#2e1a57]/60"
                    >
                        Ververs
                    </Button>
                </div>
            </div>
            {auth && auth.user && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"icon"} className="fixed right-4 bottom-8 h-12 w-12 cursor-pointer bg-[#2e1a57]/80">
                            {auth.user.favorites && auth.user.favorites.length > 0 && (
                                <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-black">
                                    {auth.user.favorites.length}
                                </div>
                            )}
                            <Heart className="size-9 h-6 w-6" />
                        </Button>
                    </DialogTrigger>
                    <FavoritesModal products={auth.user.favorites} />
                </Dialog>
            )}
        </GeneralLayout>
    )
}

function FavoritesModal({ products }: { products: Product[] }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Favoriete producten</DialogTitle>
                <DialogDescription>Producten die je aan je favorietenlijst hebt toegevoegd.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-4">
                {products.length === 0 ? (
                    <div className="py-8 text-center">
                        <Heart className="text-muted-foreground mx-auto h-12 w-12 stroke-1" />
                        <p className="text-muted-foreground mt-4">Je favorietenlijst is leeg</p>
                        <p className="text-muted-foreground text-sm">Voeg producten toe aan je favorieten door op het harticoon te klikken</p>
                    </div>
                ) : (
                    <div className="grid w-full gap-4">
                        {products.map((product: Product) => (
                            <div key={product.id} className="flex items-start gap-4 rounded-lg border p-2">
                                <div className="flex items-center gap-2">
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
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    // onClick={() => removeFromFavorites(product.id)}
                                    className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Heart className="h-5 w-5 fill-current" />
                                    <span className="sr-only">Remove from favorites</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DialogContent>
    )
}

function ProductRecommendation(props: { gift: Product }) {
    const { gift } = props
    const { auth, items } = usePage<{
        auth: any
        items: Product[]
    }>().props
    const [showAuthDialog, setShowAuthDialog] = useState(false)

    const saveFavorite = (id: number) => {
        if (auth?.user) {
            router.post(
                route("favorites"),
                {
                    product_id: id,
                    items: JSON.stringify(items),
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        toast.success("Givt is toegevoegd aan favoriete!")
                    },
                },
            )
        } else {
            setShowAuthDialog(true)
        }
    }

    return (
        <Card className="overflow-hidden border-slate-200 bg-white pt-0">
            <div className="relative aspect-square">
                <Button
                    onClick={() => {
                        saveFavorite(gift.id)
                    }}
                    variant="outline"
                    className={cn(
                        "absolute top-2 left-2 z-50 shrink-0 cursor-pointer",
                        auth.user && auth.user.favorites.map((x: any) => x.id).includes(gift.id) ? "bg-[#2e1a57] text-white" : "",
                    )}
                    size="icon"
                >
                    <Heart className="h-4 w-4" />
                </Button>
                <div className="relative">
                    <img
                        src={gift.image_name ? `https://mygivts.nl/product-image/${gift.id}` : gift.image_url}
                        alt={gift.name}
                        className="aspect-square object-cover"
                    />
                    {gift.vendor === "bol.com" && <img className="absolute right-2 bottom-2 z-50 h-12 w-12" src="/images/bolcom.png" alt="" />}
                </div>
                <Dialog>
                    <DialogTrigger asChild className="absolute top-2 right-2">
                        <Button className="cursor-pointer" variant={"outline"} size={"icon"}>
                            <Info className="h-6 w-6" size={18} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Why we chose this gift for you?</DialogTitle>
                            <DialogDescription>{gift.explanation}</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-[#2e1a57]">{gift.name}</CardTitle>
                    <Badge className="bg-[#eae2f3] text-purple-900" variant="default">
                        €{gift.price}
                    </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#eae2f3]">
                    <Star className="h-4 w-4 fill-[#eae2f3] text-[#eae2f3]" />
                    <span>4.5/5</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground text-sm">{gift.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-none bg-gradient-to-br from-[#2e1a57] to-[#eae2f3] text-xs text-white">
                        {gift.category}
                    </Badge>
                </div>
            </CardContent>
            <Separator className="mt-auto bg-slate-100" />
            <CardFooter className="flex gap-2 p-4 pb-2">
                <a className="h-full w-full" href={productUrl(gift)} target="_blank">
                    <Button
                        onClick={() => {
                            // @ts-ignore
                            window.dataLayer.push({ event: "vendor_click", vendor: gift.vendor })
                            Clarity.setTag("product", gift.name)
                        }}
                        className="w-full"
                        variant={"outline"}
                        size="sm"
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Koop Product
                    </Button>
                </a>

                <Dialog onOpenChange={(setOpen) => setShowAuthDialog(setOpen)} open={showAuthDialog}>
                    <AuthDialog setShowAuthDialog={setShowAuthDialog} />
                </Dialog>
            </CardFooter>
        </Card>
    )
}
