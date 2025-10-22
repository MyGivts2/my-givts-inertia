import { CardStack } from "@/components/ui/card-stack"
import { Product } from "@/types"

const Example = (props: { products: Product[] }) => {
    const items = props.products.map((product, index) => ({
        id: index,
        name: product.price,
        designation: product.name,
        content: (
            <div className="grid gap-2">
                <img src={`/product-image/${product.id}`} alt={product.name} className="aspect-square object-cover" />
                <p className="line-clamp-3">{product.description}</p>
            </div>
        ),
    }))

    return (
        <div className="flex h-[40rem] w-full items-center justify-center">
            <CardStack items={items} />
        </div>
    )
}

export default Example
