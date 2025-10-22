import { Product } from "@/types"

export const productUrl = (gift: Product): string => {
    if (gift.vendor === "bol.com") {
        return `https://partner.bol.com/click/click?&t=url&s=1436631&url=${gift.product_url}&f=txl`
    }

    if (gift.product_url) {
        return gift.product_url
    }
    return `https://mygivts.nl/product/${gift.id}`
}
