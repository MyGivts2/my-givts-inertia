import BlogEditor from "@/components/blog-editor"
import { Switch } from "@/components/ui/switch"
import { BlogType } from "@/types"

export default function EditBlog(props: { post: BlogType }) {
    return (
        <main className="container mx-auto max-w-3xl px-4 py-10">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Bewerk Blog Post</h1>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase" htmlFor="is_published">
                        Gepubliceerd
                    </label>
                    <Switch id="is_published" />
                </div>
            </div>
            <BlogEditor blog={props.post} />
        </main>
    )
}
