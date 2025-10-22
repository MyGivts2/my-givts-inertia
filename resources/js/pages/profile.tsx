import { CardStack } from "@/components/ui/card-stack"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { productUrl } from "@/helpers/utils"
import GeneralLayout from "@/layouts/general-layout"
import { cn } from "@/lib/utils"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react"
import {
    Baby,
    BookOpen,
    ChefHat,
    CircleHelp,
    Dumbbell,
    Flame,
    Gamepad2,
    HeartHandshake,
    House,
    Laptop,
    Music,
    Palette,
    PawPrint,
    Plane,
    Shirt,
    ShoppingBag,
    Utensils,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Naam moet minimaal 2 tekens bevatten.",
    }),
    age: z.string(),
    gender: z.string().nonempty({
        message: "Selecteer alstublieft een geslacht.",
    }),
    budget: z.number().min(10).max(1000),
    categories: z.array(z.string()).nonempty({
        message: "Selecteer alstublieft minimaal één interesse.",
    }),
    occasion: z.string(),
    relationship: z.string(),
})

export default function Profile(props: { categories: any; products: Product[] }) {
    const defaultValues = {
        name: "",
        age: "",
        gender: "",
        budget: 100,
        categories: [],
        occasion: "",
        relationship: "",
    }
    const [budget, setBudget] = useState(defaultValues.budget || 100)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        router.post(`/recommendations?profile=${encodeURIComponent(JSON.stringify(values))}`, values, {
            onProgress: () => {
                setLoading(true)
            },
        })
    }

    const iconsClassName = "h-5 w-5 flex-shrink-0 text-[#2e1a57]/60"

    const RadioIcons = {
        wonen: <House className={iconsClassName} />,
        sport: <Dumbbell className={iconsClassName} />,
        kunst: <Palette className={iconsClassName} />,
        reizen: <Plane className={iconsClassName} />,
        boeken: <BookOpen className={iconsClassName} />,
        fashion: <Shirt className={iconsClassName} />,
        verzorging: <HeartHandshake className={iconsClassName} />,
        "tech & gadgets": <Laptop className={iconsClassName} />,
        muziek: <Music className={iconsClassName} />,
        koken: <ChefHat className={iconsClassName} />,
        "kids & familie": <Baby className={iconsClassName} />,
        "fashion & accessoires": <ShoppingBag className={iconsClassName} />,
        "pikant & verkleden": <Flame className={iconsClassName} />,
        "eten & drinken": <Utensils className={iconsClassName} />,
        dieren: <PawPrint className={iconsClassName} />,
        games: <Gamepad2 className={iconsClassName} />,
        default: <CircleHelp className={iconsClassName} />,
    }

    const items = props.products.map((product, index) => ({
        id: index,
        name: product.price,
        designation: product.name,
        content: (
            <a href={productUrl(product)} target="_blank" rel="noopener noreferrer">
                <div className="relative grid gap-2">
                    <div className="relative">
                        <img src={product.image_url} alt={product.name} className="aspect-square object-cover" />
                        {product.vendor === "bol.com" && <img className="absolute right-2 bottom-2 z-50 h-12 w-12" src="/images/bolcom.png" alt="" />}
                    </div>
                    <p className="line-clamp-3">{product.description}</p>
                </div>
            </a>
        ),
    }))

    return (
        <GeneralLayout>
            <div className="container mx-auto max-w-xl rounded-md bg-white px-6 py-8 shadow-md">
                {loading && (
                    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white/80">
                        <CardStack items={items} />
                    </div>
                )}
                <h2 className="mb-4 text-2xl font-bold text-[#2e1a57]/80">Start met zoeken.</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wie wil je iets bijzonders geven?</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Voer naam ontvanger in" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hoe oud is de ontvanger?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="Leeftijdsgroep kiezen" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="under18">Onder 18</SelectItem>
                                                <SelectItem value="18-24">18-24</SelectItem>
                                                <SelectItem value="25-34">25-34</SelectItem>
                                                <SelectItem value="35-44">35-44</SelectItem>
                                                <SelectItem value="45-54">45-54</SelectItem>
                                                <SelectItem value="55plus">55+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Wat is het geslacht van de ontvanger?</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                <div className="flex items-center space-x-6">
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem value="male" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Man</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem value="female" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Vrouw</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-2">
                                                        <FormControl>
                                                            <RadioGroupItem value="other" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Anders</FormLabel>
                                                    </FormItem>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Welk bedrag had je in gedachten?: €{budget}</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={10}
                                            max={500}
                                            step={10}
                                            defaultValue={[field.value]}
                                            onValueChange={(vals) => {
                                                setBudget(vals[0])
                                                field.onChange(vals[0])
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Schuif om je bedrag te kiezen</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categories"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Kies één of meer categorieën</FormLabel>
                                        <FormDescription>Wat zijn de interesses van de ontvanger?</FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                        {props.categories.map((item: string) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name="categories"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item}
                                                            className={cn(
                                                                "flex flex-row items-center space-y-0 space-x-3 rounded-md border border-slate-200 p-4",
                                                                field.value?.includes(item) ? "bg-[#eae2f3]" : "bg-transparent",
                                                            )}
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item])
                                                                            : field.onChange(field.value?.filter((value) => value !== item))
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="flex items-center gap-1">
                                                                {/* @ts-ignore */}
                                                                {RadioIcons[item as any] || RadioIcons.default}
                                                                <span className="font-normal capitalize">{item}</span>
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="occasion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wat is de gelegenheid?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecteer gelegenheid" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="birthday">Verjaardag</SelectItem>
                                                <SelectItem value="anniversary">Jubileum</SelectItem>
                                                <SelectItem value="wedding">Bruiloft</SelectItem>
                                                <SelectItem value="graduation">Afstuderen</SelectItem>
                                                <SelectItem value="holiday">Vakantie</SelectItem>
                                                <SelectItem value="justbecause">Zomaar</SelectItem>
                                                <SelectItem value="other">Anders</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="relationship"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wat is de relatie tot de ontvanger?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecteer relatie" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="partner">Partner/Echtgenoot</SelectItem>
                                                <SelectItem value="family">Familielid</SelectItem>
                                                <SelectItem value="friend">Vriend</SelectItem>
                                                <SelectItem value="colleague">Collega</SelectItem>
                                                <SelectItem value="acquaintance">Kennis</SelectItem>
                                                <SelectItem value="other">Anders</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <button className="relative inline-flex h-11 w-full overflow-hidden rounded-full p-[2px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#eae2f3] px-3 py-1 text-sm font-medium text-[#2e1a57] backdrop-blur-3xl">
                                {/* <Sparkles className="mr-2 h-5 w-5" /> */}
                                Ontvang Kado Aanbevelingen
                            </span>
                        </button>
                    </form>
                </Form>
            </div>
        </GeneralLayout>
    )
}
