import BlogEditor from "@/components/blog-editor"

export default function CreateBlog() {
    return (
        <main className="container mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-8 text-3xl font-bold">Create a New Blog Post</h1>
            <BlogEditor />
        </main>
    )
}
