const puppeteer = require("puppeteer-core");

(async () => {
  let browser;

  try {
    browser = await puppeteer.connect({
      browserURL: "http://127.0.0.1:9222",
    });

    const pages = await browser.pages();

    console.log("Open tabs:", pages.length);

    const page = pages.find((p) =>
      p.url().includes("neveu-papeterie.com/product/")
    );

    if (!page) {
      console.log("❌ Product page not found");
      await browser.disconnect();
      return;
    }

    console.log("\nCURRENT URL:", page.url());

    console.log(
      "TITLE:",
      await page.title()
    );

    // Wait for page
    await page.waitForNetworkIdle({
      idleTime: 1500,
      timeout: 15000,
    }).catch(() => { });

    await new Promise((resolve) =>
      setTimeout(resolve, 3000)
    );

    console.log(
      "\n🔍 Scanning page for product URLs..."
    );

    const data = await page.evaluate(() => {

      const results = [];

      // =========================================
      // A) ALL LINKS
      // =========================================

      document.querySelectorAll("a").forEach((a) => {

        const href = a.getAttribute("href");

        if (!href) return;

        results.push({
          type: "href",
          value: href,
          text: (a.innerText || "")
            .replace(/\s+/g, " ")
            .trim(),
        });
      });

      // =========================================
      // B) DATA ATTRIBUTES
      // =========================================

      document
        .querySelectorAll("*")
        .forEach((el) => {

          for (const attr of el.attributes) {

            const value = attr.value;

            if (
              value &&
              value.includes("/product/")
            ) {

              results.push({
                type: attr.name,
                value: value,
                text: (el.innerText || "")
                  .replace(/\s+/g, " ")
                  .trim(),
              });
            }
          }
        });

      // =========================================
      // C) ENTIRE HTML
      // =========================================

      const html =
        document.documentElement.innerHTML;

      const matches = html.match(
        /\/product\/\d+-[^"'\\\s<>?#]+\.html/gi
      ) || [];

      matches.forEach((url) => {

        results.push({
          type: "HTML",
          value: url,
          text: "",
        });

      });

      return results;
    });

    console.log(
      "🔎 Total possible references:",
      data.length
    );

    // =========================================
    // FIND REAL PRODUCT URLs
    // =========================================

    const products = [];

    for (const item of data) {

      let value = item.value;

      if (!value) continue;

      value = value
        .replace(/\\\//g, "/")
        .replace(/&amp;/g, "&");

      // Find product path anywhere inside value
      const match = value.match(
        /\/product\/\d+-[^"'\\\s<>?#]+\.html/i
      );

      if (!match) continue;

      let url = match[0];

      // Make absolute
      if (url.startsWith("/")) {
        url =
          "https://www.neveu-papeterie.com" +
          url;
      }

      // Validate
      const isProduct =
        /^https:\/\/www\.neveu-papeterie\.com\/product\/\d+-[^/?#]+\.html$/i
          .test(url);

      if (!isProduct) continue;

      products.push({
        name: item.text || "NO TITLE",
        url,
      });
    }

    // =========================================
    // REMOVE DUPLICATES
    // =========================================

    const uniqueProducts = Array.from(
      new Map(
        products.map((product) => [
          product.url.toLowerCase(),
          product,
        ])
      ).values()
    );

    console.log(
      "\n========================================"
    );

    console.log(
      `✅ REAL PRODUCT LINKS FOUND: ${uniqueProducts.length}`
    );

    console.log(
      "========================================\n"
    );

    // =========================================
    // PRINT PRODUCTS
    // =========================================

    uniqueProducts
      .slice(0, 100)
      .forEach((product, index) => {

        console.log(
          `${index + 1}. ${product.name || "NO TITLE"
          }`
        );

        console.log(
          `   ${product.url}`
        );

        console.log("");
      });

    // =========================================
    // SAVE JSON
    // =========================================

    const fs = require("fs");

    fs.writeFileSync(
      "product-links.json",
      JSON.stringify(
        uniqueProducts,
        null,
        2
      ),
      "utf8"
    );

    console.log(
      "💾 Saved: product-links.json"
    );

    // =========================================
    // DEBUG IF ZERO
    // =========================================

    if (uniqueProducts.length === 0) {

      const debug = await page.evaluate(() => {

        const html =
          document.documentElement.innerHTML;

        return {
          htmlLength: html.length,

          productCount: (
            html.match(/\/product\//gi) || []
          ).length,

          productHtmlExamples:
            (
              html.match(
                /.{0,150}\/product\/.{0,250}/gi
              ) || []
            ).slice(0, 10),
        };
      });

      console.log(
        "\n========== DEBUG =========="
      );

      console.log(
        "HTML length:",
        debug.htmlLength
      );

      console.log(
        "Occurrences of /product/:",
        debug.productCount
      );

      console.log(
        "\nExamples:"
      );

      console.log(
        debug.productHtmlExamples
      );

      console.log(
        "===========================\n"
      );
    }

    await browser.disconnect();

  } catch (error) {

    console.error(
      "\n❌ ERROR:"
    );

    console.error(
      error.message
    );

    if (browser) {
      await browser.disconnect();
    }
  }
})();