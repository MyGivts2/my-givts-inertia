import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PRODUCT_CATEGORIES } from "@/lib/constants"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { router } from "@inertiajs/react"
import { AlertCircle, FileText, Info, Upload } from "lucide-react"
import Papa from "papaparse"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Products(props: any) {
    const [products, setProducts] = useState<Product[]>(props.products ?? [])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const addProduct = (product: Product) => {
        // setProducts([...products, { ...product, id: Date.now().toString() }])
    }

    const addMultipleProducts = (newProducts: Omit<Product, "id">[]) => {
        // const productsWithIds = newProducts.map((product) => ({
        //     ...product,
        //     id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        // }))
        // setProducts([...products, ...productsWithIds])
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="mb-6 text-3xl font-bold">Product Management</h1>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Products ({products.length ?? 0})</h2>
                    <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
                </div>

                <ProductTable products={products} />

                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddProduct={addProduct}
                    onAddMultipleProducts={addMultipleProducts}
                />
            </div>
        </main>
    )
}

interface ProductTableProps {
    products: Product[]
}

function ProductTable({ products }: ProductTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-muted-foreground py-6 text-center">
                                No products added yet. Add your first product to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url || "/placeholder.svg"}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-md object-cover"
                                            onError={(e) => {
                                                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                                            }}
                                        />
                                    ) : (
                                        <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md">
                                            No img
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="text-right">€{product.price}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onAddProduct: (product: Product) => void
    onAddMultipleProducts: (products: Omit<Product, "id">[]) => void
}

export function AddProductModal({ isOpen, onClose, onAddProduct, onAddMultipleProducts }: AddProductModalProps) {
    const [activeTab, setActiveTab] = useState("manual")

    const handleClose = () => {
        setActiveTab("manual")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your inventory. You can add products manually or import from a CSV file.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                        <TabsTrigger value="csv">CSV Import</TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="py-4">
                        <ManualEntryForm
                            onSubmit={(product) => {
                                onAddProduct(product)
                                handleClose()
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="csv" className="py-4">
                        <CsvUploadForm
                            onSubmit={(products) => {
                                onAddMultipleProducts(products)
                                handleClose()
                            }}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    category: z.string().min(1, {
        message: "Category is required.",
    }),
    price: z.coerce.number().positive({
        message: "Price must be a positive number.",
    }),
    stock: z.coerce.number().int().nonnegative({
        message: "Stock must be a non-negative integer.",
    }),
    imageUrl: z.string().url({ message: "Please enter a valid URL" }).optional(),
})

interface ManualEntryFormProps {
    onSubmit: (product: Product) => void
}

function ManualEntryForm({ onSubmit }: ManualEntryFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            price: 0,
            stock: 0,
            imageUrl: "",
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // onSubmit({
        //     id: "", // This will be set by the parent component
        //     name: values.name,
        //     description: values.description || "",
        //     category: values.category,
        //     price: values.price,
        //     stock: values.stock,
        //     imageUrl: values.imageUrl,
        // })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter product description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter category" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" min="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" step="1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>Enter a URL for the product image (optional)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Add Product
                </Button>
            </form>
        </Form>
    )
}

interface CsvUploadFormProps {
    onSubmit: (products: Omit<Product, "id">[]) => void
}

export function CsvUploadForm({ onSubmit }: CsvUploadFormProps) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<Omit<Product, "id">[]>([])
    const [error, setError] = useState<string | null>(null)
    const [warnings, setWarnings] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
            setError("Please upload a valid CSV file")
            setFile(null)
            return
        }

        setFile(selectedFile)
        setError(null)
        setWarnings([])
        parseCSV(selectedFile)
    }

    const parseCSV = (file: File) => {
        setIsLoading(true)
        setError(null)
        setWarnings([])

        Papa.parse(file, {
            header: true, // Automatically extracts headers
            skipEmptyLines: true,
            complete: (result) => {
                try {
                    const { data, errors } = result
                    const newWarnings: string[] = []
                    const validCategoryValues = PRODUCT_CATEGORIES.map((c) => c.value)

                    if (errors.length > 0) {
                        setError(`CSV Parsing Errors: ${errors.map((e) => e.message).join(", ")}`)
                        setIsLoading(false)
                        return
                    }

                    // Validate and format parsed data
                    const parsedProducts = data.map((row: any, index) => {
                        const product: any = {}
                        const translateKeys = {
                            product: "name",
                            productomschrijving: "description",
                            categorie: "category",
                            prijs: "price",
                            url: "url",
                            image_url: "imageUrl",
                            geslacht: "gender",
                        }
                        const keys = Object.keys(row)
                        keys.forEach((key) => {
                            // @ts-ignore
                            const newKey = translateKeys[key.toLowerCase().trim().replace(/\s/g, "_")]
                            if (newKey) {
                                product[newKey] = row[key]
                            }
                        })

                        // Assign values
                        // product.name = row.name?.trim() || null
                        // product.description = row.description?.trim() || ""
                        // product.imageUrl = row.imageUrl?.trim() || ""

                        // // Validate category
                        // const categoryValue = row.category?.trim().toLowerCase()
                        // if (!validCategoryValues.includes(categoryValue)) {
                        //     newWarnings.push(`Line ${index + 2}: Unknown category "${row.category}" changed to "Other"`)
                        //     product.category = "other"
                        // } else {
                        //     product.category = categoryValue
                        // }

                        // // Validate price
                        // product.price = parseFloat(row.price)
                        // if (isNaN(product.price) || product.price < 0) {
                        //     throw new Error(`Invalid price on line ${index + 2}`)
                        // }

                        // // Validate stock
                        // product.stock = parseInt(row.stock, 10)
                        // if (isNaN(product.stock) || product.stock < 0) {
                        //     throw new Error(`Invalid stock on line ${index + 2}`)
                        // }

                        // // Ensure required fields are present
                        // if (!product.name || !product.category || product.price === undefined || product.stock === undefined) {
                        //     throw new Error(`Missing required fields on line ${index + 2}`)
                        // }

                        return product
                    })
                    setPreview(parsedProducts)
                    // setWarnings(newWarnings)
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to parse CSV file")
                    setPreview([])
                } finally {
                    setIsLoading(false)
                }
            },
            error: (err) => {
                setError(`CSV Parsing Error: ${err.message}`)
                setIsLoading(false)
            },
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (preview.length > 0) {
            router.post(route("products.import"), { products: preview })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
                <label htmlFor="csv-upload" className="text-sm font-medium">
                    Upload CSV File
                </label>
                <div className="flex items-center gap-2">
                    <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="flex-1" />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("csv-upload")?.click()} className="shrink-0">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse
                    </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                    CSV must include name, category, price, and stock columns. Description and imageUrl are optional.
                </p>
                <div className="text-muted-foreground mt-1 text-sm">
                    <span className="font-medium">Valid categories:</span> {PRODUCT_CATEGORIES.map((c) => c.label).join(", ")}
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {warnings.length > 0 && (
                <Alert variant="destructive" className="border-amber-200 bg-amber-50">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Warnings</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            {warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {isLoading && <p className="text-center">Processing CSV file...</p>}

            {preview.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Preview</span>
                        <span className="text-muted-foreground text-sm">
                            ({preview.length} product{preview.length !== 1 ? "s" : ""})
                        </span>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted sticky top-0">
                                <tr>
                                    <th className="p-2 text-left">Image</th>
                                    <th className="p-2 text-left">Name</th>
                                    <th className="p-2 text-left">Category</th>
                                    <th className="p-2 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((product, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-2">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="h-8 w-8 rounded-md object-cover"
                                                    onError={(e) => {
                                                        // @ts-ignore
                                                        e.target.src = "/placeholder.svg?height=32&width=32"
                                                    }}
                                                />
                                            ) : (
                                                <div className="bg-muted h-8 w-8 rounded-md"></div>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {/* @ts-ignore */}
                                            <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                {product.name}
                                            </a>
                                        </td>
                                        <td className="p-2">{product.category}</td>
                                        <td className="p-2 text-right">{product.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Button type="submit" className="w-full" disabled={preview.length === 0}>
                Import {preview.length} Product{preview.length !== 1 ? "s" : ""}
            </Button>
        </form>
    )
}
