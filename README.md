# MyGivts Laravel Inertia

- Prijs is nog niet helemaal werkend, omdat het niet correct geformateerd
- Gender klopt ook niet helemaal
- Maar al deze dingen zijn heel makkelijk te filteren en eruit te halen met code, maar omdat de dataset nog relative klein is daarvoor heb ik het voor nu overslagen
- Als de dataset groter is kunnen we alleen de categorien eruit filteren momenteel zijn het er maar 25 per categorie

## Ideeen

- Geautomatiseerde kaart voor gebruiker

- Soortgelijke categorien filteren
- Elke categorie doet het goed behalve de fashion
- Categorien worden nu al gefiltered
- In de toekomst is er meer in de dataset dus moet de aanpak worden omgegooit

# 🎁 AI-Powered Gift Recommendation Platform — High-Level Overview

## 🚀 Concept

A platform that recommends personalized gifts based on user input (e.g., age, interests, budget), dynamically fetching products via the Amazon Product Advertising API and refining recommendations using the ChatGPT API.

---

## 🧭 User Flow

1. **User Inputs Gift Criteria**

    - Recipient type (e.g., brother, girlfriend)
    - Age group
    - Interests/hobbies
    - Budget range
    - Occasion (optional)

2. **Fetch Product Data from Amazon API**

    - Use input to construct a search query (keywords, categories, price filters)
    - Retrieve up to 100 matching products
    - Include relevant data: title, price, image, description, ASIN

3. **Send Product List to ChatGPT API**

    - Prompt GPT to evaluate and rank products based on user input
    - Apply filtering logic: relevance, uniqueness, suitability
    - Return top 10 recommended products

4. **Display Results to User**

    - Show curated gift cards with:
        - Product title, image, price
        - Short “Why we picked this” explanation (from GPT)
        - **Affiliate link** with tracking ID

5. **User Clicks → Redirect to Amazon**
    - Monetization happens via affiliate commission on purchases

---

## ⚙️ Tech Stack Overview

- **Frontend:** React / Vue / Next.js (or similar)
- **Backend/API Layer:** Node.js / Python (Flask, FastAPI)
- **Amazon Product API:** For dynamic product sourcing
- **OpenAI API (ChatGPT):** For intelligent filtering & recommendations
- **Analytics:** Track clicks, impressions, and conversions
- **Affiliate Program:** Amazon Associates

---

## 🧠 Key Benefits

- ✅ Personalized and context-aware recommendations
- ✅ Fresh, real-time product data via Amazon API
- ✅ Scalable filtering without manual curation
- ✅ Monetization via affiliate links
- ✅ Differentiated UX through AI-powered product ranking

---

## ⚠️ Challenges to Address

- LLM hallucination — prompt design must be strict
- API limits — caching and fallback strategies required
- Latency and cost — balance GPT usage with efficiency
- No built-in feedback loop — consider tracking conversions to refine

---

## 🌱 Future Enhancements

- Add support for other affiliate networks (e.g., Bol.com, Etsy)
- Allow users to “like” or “save” gift ideas
- Train a lightweight ranking model based on click/conversion data
- Seasonal / trending gift collections
