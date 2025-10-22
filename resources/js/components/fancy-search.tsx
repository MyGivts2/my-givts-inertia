"use client"

import { Button } from "@/components/ui/button"
import { Gift, Loader2, Search } from "lucide-react"
import { useState } from "react"

export default function FancySearch(searchProps: { onSearch: (query: string) => void; searchLoading: boolean }) {
    const [searchValue, setSearchValue] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    const handleSearch = () => {
        if (searchValue.trim()) {
            searchProps.onSearch(searchValue)
            console.log("Searching for:", searchValue)
        }
    }
    console.log(searchValue)

    return (
        <div className="relative mx-auto max-w-2xl">
            <div className="flex flex-col">
                <label htmlFor="prompt" className="mb-2 block text-xl font-bold text-[#2e1a57] sm:text-3xl">
                    Waar ben je naar op zoek?
                </label>
                <div className="relative flex flex-col">
                    <div
                        className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2e1a57] via-purple-600 to-[#2e1a57] opacity-0 blur-sm transition-all ${
                            isFocused ? "animate-pulse opacity-30" : ""
                        }`}
                    />
                    {/* Main search container */}
                    <div className="relative flex items-start overflow-hidden rounded-2xl border border-[#2e1a57]/10 bg-white shadow-2xl">
                        {/* Sparkle decoration */}
                        <div className="absolute top-6 left-4 -translate-y-1/2">
                            <Gift className={`h-5 w-5 transition-all ${isFocused ? "animate-spin text-[#2e1a57]" : "text-gray-400"}`} />
                        </div>
                        <div className="flex w-full flex-col items-start sm:flex-row">
                            {/* Search input */}
                            <textarea
                                rows={3}
                                placeholder='Probeer: "Verjaardagscadeau voor een jongen van 10 die van Star Wars houdt onder de 50 euro" of "Romantisch cadeau voor mijn vrouw onder de 100 euro voor ons jubileum"'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="w-full flex-1 bg-transparent py-6 pr-4 pl-14 text-sm text-[#2e1a57] placeholder-gray-400 transition-all duration-300 outline-none focus:placeholder-gray-300 sm:text-base"
                            />

                            {/* Animated search button */}
                            <Button
                                onClick={handleSearch}
                                disabled={searchProps.searchLoading}
                                className={`group m-2 mx-auto h-9 w-[80%] rounded-xl bg-[#2e1a57] px-8 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#2e1a57]/90 hover:shadow-lg sm:h-12 sm:w-auto`}
                            >
                                {searchProps.searchLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <Search className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                                )}
                                Zoeken
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="mt-1 text-xs text-[#2e1a57]/50 sm:text-sm">
                    Voeg details toe zoals leeftijd, interesses, gelegenheid en budget voor betere resultaten.
                </p>
            </div>
            {/* Animated background glow */}

            {/* Floating particles effect */}
            {/* <div className="absolute -top-2 left-1/4 h-2 w-2 animate-ping rounded-full bg-[#2e1a57]/20" />
            <div className="absolute -top-1 right-1/3 h-1 w-1 animate-pulse rounded-full bg-purple-400/30" />
            <div className="absolute right-1/4 -bottom-2 h-2 w-2 animate-bounce rounded-full bg-[#2e1a57]/10" /> */}

            {/* Search suggestions hint */}
            {/* {isFocused && (
                <div className="animate-in slide-in-from-top-2 absolute top-full right-0 left-0 mt-2 rounded-xl border border-[#2e1a57]/10 bg-white/95 p-4 shadow-lg backdrop-blur-sm duration-200">
                    <div className="flex flex-wrap gap-2">
                        {["Voor hem", "Voor haar", "Verjaardag", "Kerst", "Valentijn"].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setSearchValue(suggestion)}
                                className="rounded-full bg-[#2e1a57]/10 px-3 py-1 text-sm text-[#2e1a57] transition-colors duration-200 hover:bg-[#2e1a57]/20"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    )
}
