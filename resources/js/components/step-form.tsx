"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AnimatePresence, motion } from "framer-motion"
import {
    ArrowLeft,
    ArrowRight,
    Baby,
    BookOpen,
    ChefHat,
    CircleHelp,
    Dumbbell,
    Flame,
    Gamepad2,
    HeartHandshake,
    House,
    Laptop,
    Music,
    Palette,
    PawPrint,
    Plane,
    Shirt,
    ShoppingBag,
    Utensils,
} from "lucide-react"
import { useState } from "react"

const steps = [
    { id: 1, title: "Personal Info", description: "Tell us about yourself" },
    { id: 2, title: "Preferences", description: "Your interests and goals" },
    { id: 3, title: "Contact", description: "How to reach you" },
    { id: 4, title: "Review", description: "Confirm your details" },
]

const category_with_emojis = [
    { text: "wonen", emoji: "🏡" },
    { text: "sport", emoji: "🏅" },
    { text: "kunst", emoji: "🎨" },
    { text: "reizen", emoji: "✈️" },
    { text: "boeken", emoji: "📚" },
    { text: "fashion", emoji: "👗" },
    { text: "verzorging", emoji: "💆" },
    { text: "tech & gadgets", emoji: "💻" },
    { text: "muziek", emoji: "🎵" },
    { text: "koken", emoji: "👨‍🍳" },
    { text: "kids & familie", emoji: "👨‍👩‍👧‍👦" },
    { text: "fashion & accessoires", emoji: "👜" },
    { text: "pikant & verkleden", emoji: "😈" },
    { text: "eten & drinken", emoji: "🍽️" },
    { text: "dieren", emoji: "🐾" },
    { text: "games", emoji: "🎮" },
]

export function StepForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interests: "",
        goals: "",
        message: "",
    })

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const bounceVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 0.6,
                ease: "easeInOut",
            },
        },
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    }
    const iconsClassName = "h-5 w-5 flex-shrink-0 text-white"

    const RadioIcons = {
        wonen: <House className={iconsClassName} />,
        sport: <Dumbbell className={iconsClassName} />,
        kunst: <Palette className={iconsClassName} />,
        reizen: <Plane className={iconsClassName} />,
        boeken: <BookOpen className={iconsClassName} />,
        fashion: <Shirt className={iconsClassName} />,
        verzorging: <HeartHandshake className={iconsClassName} />,
        "tech & gadgets": <Laptop className={iconsClassName} />,
        muziek: <Music className={iconsClassName} />,
        koken: <ChefHat className={iconsClassName} />,
        "kids & familie": <Baby className={iconsClassName} />,
        "fashion & accessoires": <ShoppingBag className={iconsClassName} />,
        "pikant & verkleden": <Flame className={iconsClassName} />,
        "eten & drinken": <Utensils className={iconsClassName} />,
        dieren: <PawPrint className={iconsClassName} />,
        games: <Gamepad2 className={iconsClassName} />,
        default: <CircleHelp className={iconsClassName} />,
    }

    return (
        <Card className="mx-auto w-full max-w-3xl overflow-hidden border-indigo-600/30 bg-[#2e1a57] shadow-2xl backdrop-blur-sm">
            <CardContent className="p-0">
                <div className="absolute top-0 w-full">
                    <div className="flex h-1">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="relative flex-1"
                                initial={{ scaleX: 0 }}
                                animate={{
                                    scaleX: currentStep > step.id ? 1 : currentStep === step.id ? 0.7 : 0,
                                }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                    delay: currentStep === step.id ? 0.1 : 0,
                                }}
                                style={{ originX: 0 }}
                            >
                                <div
                                    className={`h-full transition-all duration-300 ${currentStep > step.id ? "bg-green-400" : currentStep === step.id ? "bg-white" : "bg-indigo-600/30"} `}
                                />
                                {currentStep === step.id && (
                                    <motion.div
                                        className="absolute inset-0 bg-white"
                                        animate={{
                                            scaleY: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: "easeInOut",
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatDelay: 2,
                                        }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    <div className="relative h-60 overflow-hidden">
                        <AnimatePresence mode="wait" custom={currentStep}>
                            <motion.div
                                key={currentStep}
                                custom={currentStep}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                className="absolute inset-0 flex flex-col justify-center"
                            >
                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        <h2 className="mb-6 text-2xl font-bold text-white">Categorien</h2>
                                        <div className="flex flex-wrap gap-4">
                                            {category_with_emojis.map((item) => (
                                                <div
                                                    className="flex aspect-square items-center gap-1 rounded border border-white p-2 text-white"
                                                    key={item.text}
                                                >
                                                    {/* @ts-ignore */}
                                                    {RadioIcons[item.text as any] || RadioIcons.default}
                                                    <span className="font-normal capitalize">{item.text}</span>
                                                </div>
                                            ))}
                                            {/* <div>
                                                <Label htmlFor="firstName" className="text-indigo-200">
                                                    First Name
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => updateFormData("firstName", e.target.value)}
                                                    className="border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                    placeholder="Enter your first name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName" className="text-indigo-200">
                                                    Last Name
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => updateFormData("lastName", e.target.value)}
                                                    className="border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                    placeholder="Enter your last name"
                                                />
                                            </div> */}
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <h2 className="mb-6 text-2xl font-bold text-white">Your Preferences</h2>
                                        <div>
                                            <Label htmlFor="interests" className="text-indigo-200">
                                                Interests
                                            </Label>
                                            <Input
                                                id="interests"
                                                value={formData.interests}
                                                onChange={(e) => updateFormData("interests", e.target.value)}
                                                className="border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                placeholder="What are you interested in?"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="goals" className="text-indigo-200">
                                                Goals
                                            </Label>
                                            <Textarea
                                                id="goals"
                                                value={formData.goals}
                                                onChange={(e) => updateFormData("goals", e.target.value)}
                                                className="min-h-24 border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                placeholder="Tell us about your goals..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-4">
                                        <h2 className="mb-6 text-2xl font-bold text-white">Contact Information</h2>
                                        <div>
                                            <Label htmlFor="email" className="text-indigo-200">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateFormData("email", e.target.value)}
                                                className="border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-indigo-200">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => updateFormData("phone", e.target.value)}
                                                className="border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                placeholder="Your phone number"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="message" className="text-indigo-200">
                                                Additional Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e) => updateFormData("message", e.target.value)}
                                                className="min-h-20 border-indigo-400/30 bg-white/10 text-white placeholder:text-indigo-300"
                                                placeholder="Anything else you'd like to share?"
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="space-y-4">
                                        <h2 className="mb-6 text-2xl font-bold text-white">Review Your Information</h2>
                                        <div className="space-y-3 rounded-lg bg-white/10 p-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-indigo-300">Name:</span>
                                                    <span className="ml-2 text-white">
                                                        {formData.firstName} {formData.lastName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-indigo-300">Email:</span>
                                                    <span className="ml-2 text-white">{formData.email}</span>
                                                </div>
                                                <div>
                                                    <span className="text-indigo-300">Phone:</span>
                                                    <span className="ml-2 text-white">{formData.phone}</span>
                                                </div>
                                                <div>
                                                    <span className="text-indigo-300">Interests:</span>
                                                    <span className="ml-2 text-white">{formData.interests}</span>
                                                </div>
                                            </div>
                                            {formData.goals && (
                                                <div className="text-sm">
                                                    <span className="text-indigo-300">Goals:</span>
                                                    <p className="mt-1 text-white">{formData.goals}</p>
                                                </div>
                                            )}
                                            {formData.message && (
                                                <div className="text-sm">
                                                    <span className="text-indigo-300">Message:</span>
                                                    <p className="mt-1 text-white">{formData.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                        <Button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            variant="outline"
                            className="border-indigo-400/30 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Previous
                        </Button>

                        {currentStep < steps.length ? (
                            <Button onClick={nextStep} className="bg-white text-indigo-800 hover:bg-indigo-50">
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button className="bg-green-500 text-white hover:bg-green-600">Submit Form</Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
