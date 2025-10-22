import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Product, Prompt } from "@/types"
import { router } from "@inertiajs/react"
import { Eye, RefreshCw, Save } from "lucide-react"
import { useEffect, useState } from "react"

export default function PromptEditorPage(props: { products: Product[]; prompt: Prompt }) {
    return (
        <main className="container mx-auto py-10">
            <h1 className="mb-6 text-3xl font-bold">Prompt Template Editor</h1>
            <p className="mb-8 text-gray-600">Customize the prompt template used for gift recommendations</p>
            <PromptEditor prompt={props.prompt} products={props.products} />
        </main>
    )
}

const DEFAULT_PROMPT = `You are a gift recommendation assistant.
User Profile:
{userProfile}
Available Products:
{productData}
Based on the user's profile and the available products, recommend the 10 most suitable gift(s) and explain why.`

// Sample data for preview
const SAMPLE_USER = {
    name: "Alex",
    age: "32",
    gender: "non-binary",
    budget: "100",
    interests: ["technology", "cooking", "hiking"],
    occasion: "birthday",
    relationship: "friend",
}

function PromptEditor({ products, prompt }: { products: Product[]; prompt: Prompt }) {
    const [promptTemplate, setPromptTemplate] = useState(prompt.prompt_text)
    const [isSaved, setIsSaved] = useState(true)
    const [previewPrompt, setPreviewPrompt] = useState("")

    // Generate preview with sample data
    const generatePreview = () => {
        let preview = promptTemplate

        // Replace user profile placeholder
        preview = preview.replace("{userProfile}", JSON.stringify(SAMPLE_USER, null, 2))

        // Replace product data placeholder
        preview = preview.replace("{productData}", JSON.stringify(products, null, 2))

        setPreviewPrompt(preview)
    }

    // Generate preview on initial load and when template changes
    useEffect(() => {
        generatePreview()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSave = async () => {
        router.post(route("prompt-editor.update"), { prompt_text: promptTemplate })

        setIsSaved(true)
        alert("Prompt template saved successfully!")
    }

    const handleTemplateChange = (value: string) => {
        setPromptTemplate(value)
        setIsSaved(false)
    }

    const handleReset = () => {
        if (confirm("Are you sure you want to reset to the default template?")) {
            setPromptTemplate(DEFAULT_PROMPT)
            setIsSaved(false)
        }
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="editor">
                <TabsList className="mb-4">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="editor">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Prompt Template</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="md:col-span-2">
                                    <Textarea
                                        value={promptTemplate}
                                        onChange={(e) => handleTemplateChange(e.target.value)}
                                        className="h-[500px] resize-none font-mono"
                                    />
                                </div>
                                <div>
                                    <PromptVariables />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={handleReset}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reset to Default
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={generatePreview}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                                <Button onClick={handleSave} disabled={isSaved}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Template
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="preview">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prompt Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Alert>
                                <AlertDescription>This is how your prompt will look with sample data.</AlertDescription>
                            </Alert>
                            <div className="mt-4 rounded-md bg-gray-50 p-4 dark:bg-gray-900">
                                <pre className="overflow-hidden text-sm whitespace-pre-wrap">{previewPrompt}</pre>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" onClick={generatePreview}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh Preview
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function PromptVariables() {
    const variables = [
        { name: "{userProfile}", description: "JSON of user data (name, age, gender, etc.)" },
        { name: "{productData}", description: "JSON of available products" },
    ]

    const insertVariable = (variable: string) => {
        // In a real implementation, this would insert at cursor position
        // For now, we'll just copy to clipboard
        navigator.clipboard.writeText(variable)
        alert(`Copied ${variable} to clipboard!`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Available Variables</CardTitle>
                <CardDescription>Click on a variable to copy it to your clipboard</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {variables.map((variable) => (
                        <div key={variable.name} className="space-y-1">
                            <Button variant="outline" className="w-full justify-start font-mono" onClick={() => insertVariable(variable.name)}>
                                {variable.name}
                            </Button>
                            <p className="pl-2 text-xs text-gray-500">{variable.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 border-t pt-6">
                    <h4 className="mb-2 text-sm font-medium">Tips:</h4>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500">
                        <li>Use variables to insert dynamic content</li>
                        <li>The system will replace variables with actual data</li>
                        <li>Maintain the JSON structure in your prompt</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
