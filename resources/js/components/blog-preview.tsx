import { Card, CardContent } from "@/components/ui/card"

interface BlogPreviewProps {
    title: string
    content: string
    featuredImage: File | null | string
}

export default function BlogPreview({ title, content, featuredImage }: BlogPreviewProps) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
                <img
                    src={
                        featuredImage
                            ? featuredImage instanceof File
                                ? URL.createObjectURL(featuredImage)
                                : `/storage/${featuredImage}`
                            : "/placeholder.svg"
                    }
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>
            <CardContent className="p-6">
                <h1 className="mb-6 text-3xl font-bold">{title}</h1>
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
        </Card>
    )
}
