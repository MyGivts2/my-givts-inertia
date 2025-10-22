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

    // Go to the target URL
    await page.goto(url, {
        waitUntil: "networkidle2", // Wait for the network to be idle
    })

    // Extract the full page content
    const pageContent = await page.evaluate(() => {
        return {
            html: document.documentElement.outerHTML,
            text: document.body.innerText,
        }
    })

    console.log(pageContent.text) // Extracted text

    // Close the browser
    // await browser.close()
})()
