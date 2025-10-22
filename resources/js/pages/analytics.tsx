// import { CreateLinkForm } from "@/components/create-link-form"
// import { LinkAnalytics } from "@/components/link-analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-4 md:px-6">
                <div className="flex flex-1 items-center gap-2">
                    <h1 className="text-xl font-semibold">Social Link Tracker</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                        Help
                    </Button>
                    <Button size="sm">Export Data</Button>
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                            <p className="text-muted-foreground text-xs">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-muted-foreground text-xs">+2 new this week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Instagram</div>
                            <p className="text-muted-foreground text-xs">428 clicks this week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24.3%</div>
                            <p className="text-muted-foreground text-xs">+5.2% from last week</p>
                        </CardContent>
                    </Card>
                </div>
                <Tabs defaultValue="links">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="links">My Tracking Links</TabsTrigger>
                            <TabsTrigger value="create">Create New Link</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="links" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media Tracking Links</CardTitle>
                                <CardDescription>Manage and monitor all your social media tracking links.</CardDescription>
                            </CardHeader>
                            <CardContent>{/* <LinksList /> */}</CardContent>
                        </Card>
                    </TabsContent>
                    {/* <TabsContent value="create" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Social Media Tracking Link</CardTitle>
                                <CardDescription>Generate a tracking link for your social media post.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CreateLinkForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media Performance</CardTitle>
                                <CardDescription>View detailed analytics for your social media tracking links.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LinkAnalytics />
                            </CardContent>
                        </Card>
                    </TabsContent> */}
                </Tabs>
            </main>
        </div>
    )
}

// function LinksList() {
//     const [links, setLinks] = useState(mockLinks)
//     const [searchQuery, setSearchQuery] = useState("")

//     const filteredLinks = links.filter(
//         (link) => link.title.toLowerCase().includes(searchQuery.toLowerCase()) || link.platform.toLowerCase().includes(searchQuery.toLowerCase()),
//     )

//     const copyToClipboard = (trackingUrl: string) => {
//         navigator.clipboard.writeText(trackingUrl)
//         toast({
//             title: "Link copied!",
//             description: "The tracking link has been copied to your clipboard.",
//         })
//     }

//     const deleteLink = (id: string) => {
//         setLinks(links.filter((link) => link.id !== id))
//         toast({
//             title: "Link deleted",
//             description: "The tracking link has been removed.",
//         })
//     }

//     const getPlatformColor = (platform: string) => {
//         const colors: Record<string, string> = {
//             instagram: "bg-purple-100 text-purple-800",
//             facebook: "bg-blue-100 text-blue-800",
//             twitter: "bg-sky-100 text-sky-800",
//             linkedin: "bg-indigo-100 text-indigo-800",
//             tiktok: "bg-slate-100 text-slate-800",
//             pinterest: "bg-red-100 text-red-800",
//         }
//         return colors[platform] || "bg-gray-100 text-gray-800"
//     }

//     return (
//         <div className="space-y-4">
//             <div className="flex items-center gap-2">
//                 <Input
//                     placeholder="Search by title or platform..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="max-w-sm"
//                 />
//             </div>
//             <div className="rounded-md border">
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Post Title</TableHead>
//                             <TableHead>Platform</TableHead>
//                             <TableHead className="hidden md:table-cell">Destination URL</TableHead>
//                             <TableHead className="hidden md:table-cell">Clicks</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {filteredLinks.map((link) => (
//                             <TableRow key={link.id}>
//                                 <TableCell className="font-medium">{link.title}</TableCell>
//                                 <TableCell>
//                                     <Badge variant="outline" className={getPlatformColor(link.platform)}>
//                                         {link.platform}
//                                     </Badge>
//                                 </TableCell>
//                                 <TableCell className="hidden md:table-cell">
//                                     <div className="flex items-center gap-2">
//                                         <span className="max-w-[200px] truncate">{link.originalUrl}</span>
//                                         <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
//                                             <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
//                                                 <ExternalLink className="h-3.5 w-3.5" />
//                                                 <span className="sr-only">Open original URL</span>
//                                             </a>
//                                         </Button>
//                                     </div>
//                                 </TableCell>
//                                 <TableCell className="hidden md:table-cell">{link.clicks}</TableCell>
//                                 <TableCell className="text-right">
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild>
//                                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                                                 <MoreHorizontal className="h-4 w-4" />
//                                                 <span className="sr-only">Open menu</span>
//                                             </Button>
//                                         </DropdownMenuTrigger>
//                                         <DropdownMenuContent align="end">
//                                             <DropdownMenuItem onClick={() => copyToClipboard(link.trackingUrl)}>
//                                                 <Copy className="mr-2 h-4 w-4" />
//                                                 Copy tracking link
//                                             </DropdownMenuItem>
//                                             <DropdownMenuItem>
//                                                 <BarChart2 className="mr-2 h-4 w-4" />
//                                                 View analytics
//                                             </DropdownMenuItem>
//                                             <DropdownMenuItem onClick={() => deleteLink(link.id)}>
//                                                 <Trash2 className="mr-2 h-4 w-4" />
//                                                 Delete
//                                             </DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </div>
//         </div>
//     )
// }
