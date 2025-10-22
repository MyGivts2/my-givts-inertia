import { Card, CardContent } from "@/components/ui/card"
import GeneralLayout from "@/layouts/general-layout"
import { Gift, Search, User } from "lucide-react"

export default function AboutUs() {
    return (
        <GeneralLayout>
            <div className="container mx-auto px-4 md:px-6">
                <section className="mt-10 py-20">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-[#2e1a57]/80 md:text-4xl">Hoe werkt het?</h2>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600">In drie eenvoudige stappen naar het passende kado.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    icon: <User className="h-10 w-10 text-[#2e1a57]/80" />,
                                    title: "Voor wie is het?",
                                    description: "Vertel nu ons meer over de persoon voor wie je een kado zoekt.",
                                },
                                {
                                    icon: <Search className="h-10 w-10 text-[#2e1a57]/80" />,
                                    title: "Ontdek de kado ideeën",
                                    description:
                                        "Krijg gepersonaliseerde kado-suggesties die naadloos aansluiten bij het profiel en de bijbehorende voorkeuren en interesses.",
                                },
                                {
                                    icon: <Gift className="h-10 w-10 text-[#2e1a57]/80" />,
                                    title: "Koop het kado",
                                    description: "Je wordt doorgestuurd naar een betrouwbare aanbieder om het kado te kopen.",
                                },
                            ].map((feature, index) => (
                                <Card key={index} className="border-none shadow-lg transition-shadow hover:shadow-xl">
                                    <CardContent className="pt-6">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 p-3">
                                            {feature.icon}
                                        </div>
                                        <h3 className="mb-3 text-center text-xl font-semibold text-[#2e1a57]/80">{feature.title}</h3>
                                        <p className="text-center text-gray-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </GeneralLayout>
    )
}
