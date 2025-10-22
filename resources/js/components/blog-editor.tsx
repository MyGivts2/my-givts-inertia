import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogType } from "@/types"
import { router } from "@inertiajs/react"
import Heading from "@tiptap/extension-heading"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useState } from "react"
import BlogPreview from "./blog-preview"
import EditorToolbar from "./editor-toolbar"

export default function BlogEditor({ blog }: { blog?: BlogType }) {
    const [title, setTitle] = useState(blog?.title || "My Awesome Blog Post")
    const [featuredImage, setFeaturedImage] = useState<File | string | null>(blog?.featured_image || null)
    const [activeTab, setActiveTab] = useState("edit")

    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: `
            <h2>Welcome to your new blog post</h2>
            <p>This is a paragraph with some <strong>bold</strong> and <em>italic</em> text.</p>
            <p>Try adding some content and see how it looks in the preview tab!</p>
            <h3>Features of this editor:</h3>
            <ul>
                <li>Rich text formatting</li>
                <li>Image uploads</li>
                <li>Headings and lists</li>
                <li>And much more!</li>
            </ul>
        `,
        editorProps: {
            attributes: {
                class: "prose prose-lg dark:prose-invert focus:outline-none max-w-none",
            },
        },
    })

    const handlePublish = () => {
        const content = editor?.getHTML()

        if (!title || !content || !featuredImage) {
            alert("Vul alle velden in voordat u publiceert.")
            return
        }

        router.post(
            "/blogs",
            {
                title,
                featured_image: featuredImage,
                content,
                is_published: true,
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    window.location.href = "/blogs"
                },
                onError: (error) => {
                    console.error("Failed to publish blog post:", error)
                    alert("Er is een fout opgetreden bij het publiceren van de blogpost.")
                },
            },
        )
        alert("Blog post published successfully!")
    }

    const handleDraft = () => {
        const content = editor?.getHTML()

        if (!title || !content || !featuredImage) {
            alert("Vul alle velden in voordat u een concept opslaat.")
            return
        }

        router.post(
            "/blogs",
            {
                title,
                content,
                featured_image: featuredImage,
            },
            {
                onSuccess: () => {
                    window.location.href = "/blogs"
                },
                onError: (error) => {
                    console.error("Failed to save draft:", error)
                    alert("Er is een fout opgetreden bij het opslaan van het concept.")
                },
            },
        )
    }

    const handleUpdate = () => {
        const content = editor?.getHTML()

        const withFeaturedImage = {
            title,
            featured_image: featuredImage,
            content,
        }
        const withoutFeaturedImage = {
            title,
            content,
        }
        const updateOptions = featuredImage instanceof File ? withFeaturedImage : withoutFeaturedImage

        router.post(
            `/blogs/${blog?.slug}`,
            { ...updateOptions },
            {
                // forceFormData: featuredImage instanceof File ? true : false,
                onSuccess: () => {
                    alert("Blog post updated successfully!")
                    window.location.href = "/blogs/" + blog?.slug
                },
                onError: (error) => {
                    console.error("Failed to update blog post:", error)
                    alert("Er is een fout opgetreden bij het bijwerken van de blogpost.")
                },
            },
        )
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-4">
                <div>
                    <label htmlFor="title" className="mb-1 block text-sm font-medium">
                        Blog Title
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-medium text-black dark:text-white"
                        placeholder="Enter your blog title"
                    />
                </div>

                <div>
                    <label htmlFor="featured-image" className="mb-1 block text-sm font-medium">
                        Featured Image
                    </label>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Input
                                id="featured-image"
                                type="file"
                                accept="image/*"
                                className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setFeaturedImage(file)
                                    }
                                }}
                            />
                            {featuredImage && (
                                <Button variant="outline" size="sm" onClick={() => setFeaturedImage(null)}>
                                    Reset
                                </Button>
                            )}
                        </div>
                        <div className="mt-2">
                            <img
                                src={
                                    featuredImage
                                        ? featuredImage instanceof File
                                            ? URL.createObjectURL(featuredImage)
                                            : `/storage/${featuredImage}`
                                        : "/placeholder.svg"
                                }
                                alt="Featured"
                                className="h-40 w-full rounded-md border object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="rounded-md border p-4">
                    {editor && <EditorToolbar editor={editor} />}
                    <Card className="mt-4">
                        <CardContent className="p-4">
                            <EditorContent editor={editor} className="min-h-[400px]" />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="preview">
                    <BlogPreview title={title} content={editor?.getHTML() || ""} featuredImage={featuredImage} />
                </TabsContent>
            </Tabs>

            {blog ? (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            window.location.href = "/blogs/" + blog?.slug
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate}>Save</Button>
                </div>
            ) : (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleDraft}>
                        Save Draft
                    </Button>
                    <Button onClick={handlePublish}>Publish</Button>
                </div>
            )}
        </div>
    )
}
