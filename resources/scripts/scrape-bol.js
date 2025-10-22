import puppeteer from "puppeteer"

const args = process.argv.slice(2)
const url = args[0]

;(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({
        headless: false,
    })
    // Open a new page
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 800 })

    // Go to the target URL
    await page.goto("https://www.bol.com/nl/nl/", {
        waitUntil: "domcontentloaded", // Wait for the network to be idle
    })
    await page.waitForSelector('[id^="radix-"][id$="-trigger-categories"]', { visible: true })

    // Hover over the button
    await page.click('[id^="radix-"][id$="-trigger-categories"]')

    // console.log("Hovered over the button!")
    // await page.w(3000)

    // const test = await page.evaluate(() => {
    //     return document.querySelector(".wsp-category-nav-ab__item.js_cat_item").innerText
    //     // return Array.from(document.querySelectorAll(".wsp-category-nav-ab__item.js_cat_item"))
    //     // console.log("Hello from the browser")
    // })
    // // Extract the full page content
    // const items = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll(".wsp-category-nav-ab__item.js_cat_item")).map((category) => {
    //         const title = category.querySelector(".wsp-sub-nav-parent__title")?.innerText.trim() || "No title" // Get h2 text

    //         // Find subcategories inside the category (assuming subcategories are inside <ul><li>...</li></ul>)
    //         // const subCategories = Array.from(category.querySelectorAll('ul li'))
    //         //     .map(subCat => subCat.innerText.trim())
    //         //     .filter(text => text.length > 0); // Ensure no empty strings

    //         return category
    //     })
    // })

    // // console.log(items) // Extracted text
    // console.log(test)
    // Close the browser
    // await browser.close()
})()
