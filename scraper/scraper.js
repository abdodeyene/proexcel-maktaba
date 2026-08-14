const fs = require("fs");
const { chromium } = require("playwright");

const BASE_URL = "https://www.neveu-papeterie.com";

const ids = JSON.parse(
    fs.readFileSync("./product-ids.json", "utf8")
);

async function main() {
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    const products = [];

    for (const id of ids) {
        console.log(`🔎 Processing ${id}...`);

        try {
            // Search the product ID on the website
            await page.goto(
                `${BASE_URL}/product/PStores?s=${encodeURIComponent(id)}`,
                {
                    waitUntil: "domcontentloaded",
                    timeout: 30000
                }
            );

            await page.waitForTimeout(1500);

            const product = await page.evaluate((id) => {
                const links = [...document.querySelectorAll("a")];

                const link = links.find((a) =>
                    a.href.includes(id)
                );

                if (!link) return null;

                const card =
                    link.closest(
                        "[class*='product'], [class*='Product'], article, li"
                    ) || link.parentElement;

                const img = card?.querySelector("img");

                return {
                    id,
                    name:
                        card?.querySelector(
                            "[class*='name'], [class*='title'], h2, h3"
                        )?.textContent?.trim() || null,

                    price:
                        card?.querySelector(
                            "[class*='price'], [class*='Price']"
                        )?.textContent?.trim() || null,

                    image: img?.src || img?.getAttribute("data-src") || null,

                    url: link.href
                };
            }, id);

            if (product) {
                products.push(product);
                console.log("✅ Found:", product.name || id);
            } else {
                console.log("❌ Not found:", id);
            }

        } catch (error) {
            console.log(`⚠️ Error ${id}: ${error.message}`);
        }
    }

    fs.writeFileSync(
        "./products.json",
        JSON.stringify(products, null, 2),
        "utf8"
    );

    console.log("");
    console.log("================================");
    console.log(`✅ FINISHED: ${products.length}/${ids.length}`);
    console.log("💾 Saved: products.json");
    console.log("================================");

    await browser.close();
}

main();