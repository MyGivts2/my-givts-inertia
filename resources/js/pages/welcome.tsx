import { AuthDialog } from "@/components/auth-dialog"
import FancySearch from "@/components/fancy-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { productUrl } from "@/helpers/utils"
import GeneralLayout from "@/layouts/general-layout"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { router, usePage } from "@inertiajs/react"
import Clarity from "@microsoft/clarity"
import { Heart, Info, Loader2, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const CLARITY_PROJECT_ID = "riv1w17lcy"

export default function Welcome(props: { categories: any[]; products: Product[] }) {
    const [products, setProducts] = useState(props.products)
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    useEffect(() => {
        Clarity.init(CLARITY_PROJECT_ID)
    }, [])

    useEffect(() => {
        document.body.onscroll = async () => {
            if (loading) return
            // do something when it hits the bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                fetchMoreProducts()
            }
        }
    }, [])

    const fetchMoreProducts = async () => {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000)) // simulate loading
        fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                products: [...products].map((p) => p.id),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts((prev) => [...prev, ...data.products])
                setLoading(false)
            })
    }

    const searchProducts = (query: string) => {
        if (searchLoading) return
        setSearchLoading(true)
        fetch("/api/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.products)
                setSearchLoading(false)
            })
    }

    return (
        <GeneralLayout>
            <div className="relative mx-auto bg-[#2e1a57] pb-12">
                <div className="mx-auto grid h-[160vh] min-h-screen max-w-7xl grid-cols-1 gap-4 sm:h-[70vh] sm:min-h-0 md:grid-cols-2">
                    {/* Left big image */}
                    <div className="relative min-h-0 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 mx-auto flex flex-col items-start justify-center gap-4 p-6">
                            <h2 className="text-3xl leading-tight font-bold text-white md:text-5xl">
                                <span className="text-[#eae2f3]">MyGivts</span>.nl is <span className="text-[#eae2f3]">dé kado</span> zoeker van
                                Nederland.
                            </h2>
                            <p className="text-lg text-white/60">
                                {" "}
                                Binnen 5 minuten voorzien wij je van een aantal originele ideeën en kun je het leukste kado kopen!
                            </p>
                            <a href="#search">
                                <button className="rounded bg-white px-6 py-2 text-black shadow">Zoeken</button>
                            </a>
                        </div>
                    </div>
                    <div className="-mt-[20vh] flex flex-col gap-2 p-4 sm:mt-0 sm:p-0">
                        {/* <h2 className="text-xl font-bold text-white uppercase">Hot Products🔥</h2> */}
                        <div className="grid h-full min-h-0 auto-rows-fr grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-4 sm:pr-8 md:grid-cols-2">
                            <div className="relative col-span-2 overflow-hidden rounded-sm">
                                <img
                                    src="https://yoishomatcha.com/cdn/shop/files/image000004.jpg?v=1755949903&width=1646"
                                    alt="Jewellery"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-end justify-start bg-black/20 p-4">
                                    <a className="cursor-pointer" href="https://yoishomatcha.com/products/baking-matcha-100-grams" target="_blank">
                                        <button className="cursor-pointer rounded bg-white px-4 py-2 text-black shadow">Baking matcha</button>
                                    </a>
                                </div>
                            </div>

                            {/* Homeware */}
                            <div className="relative overflow-hidden rounded-sm">
                                <img
                                    src="https://www.kamera-express.nl/_ipx/b_%23ffffff00,f_webp,fit_contain,s_484x484/https://www.kamera-express.nl/media/d3906880-ba1f-4377-9e95-440212159f63/kodak-fz55bl-5-jpg.jpg"
                                    alt="Homeware"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-end justify-start bg-black/20 p-4">
                                    <a href="https://www.kamera-express.nl/kodak-fz55bl" target="_blank">
                                        <button className="cursor-pointer rounded bg-white px-4 py-2 text-black shadow">Kodak pixpro FZ55</button>
                                    </a>
                                </div>
                            </div>

                            {/* Clothing (wide on mobile, normal on md+) */}
                            <div className="relative col-span-2 overflow-hidden rounded-sm md:col-span-1">
                                <img
                                    src="https://www.therabody.eu/cdn/shop/files/Mini-Black-Hero-4.jpg?v=1740448308&width=1646"
                                    alt="Clothing"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-end justify-start bg-black/20 p-4">
                                    <a href="https://www.therabody.eu/en-bn/products/theragun-mini-black" target="_blank">
                                        <button className="cursor-pointer rounded bg-white px-4 py-2 text-black shadow">Theragun Mini</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="search" className="px-6 py-20">
                <FancySearch
                    onSearch={(query: string) => {
                        searchProducts(query)
                    }}
                    searchLoading={searchLoading}
                />
            </div>
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2 lg:grid-cols-4">
                {products.map((gift) => (
                    <ProductRecommendation key={gift.id} gift={gift} />
                ))}
                {searchLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="animate-spin opacity-30" />
                    </div>
                )}
                {loading && (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="animate-spin opacity-30" />
                    </div>
                )}
            </div>
        </GeneralLayout>
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
                route("favorites.add"),
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
        <Card className="gap-2 overflow-hidden border-slate-200 bg-white pt-0">
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
                    <img src={gift.image_url} alt={gift.name} className="aspect-square object-cover" />
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
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground line-clamp-3 text-sm">{gift.description}</p>
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
