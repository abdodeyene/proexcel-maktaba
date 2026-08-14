import json
import re
import time
import requests
from bs4 import BeautifulSoup

# Standard Browser User-Agent header to avoid 403 Forbidden blocking
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
}


def clean_price(price_raw):
    """
    Extracts the numerical price from strings like 'د.م. 34,90' or '34,90 DH' 
    and converts it into a float (e.g., 34.9).
    """
    if not price_raw:
        return None
    try:
        # Remove non-breaking spaces and standard whitespace
        price_clean = price_raw.replace('\xa0', '').replace(' ', '')
        # Match digits with optional decimal separator (comma or dot)
        match = re.search(r'\d+(?:[.,]\d+)?', price_clean)
        if match:
            # Convert French decimal comma (,) to standard Python dot (.)
            number_str = match.group(0).replace(',', '.')
            return float(number_str)
    except Exception:
        pass
    return None


def extract_image_url(card):
    """
    Extracts the main image URL while handling WordPress/WooCommerce lazy loading 
    attributes (data-lazy, data-src, or src).
    """
    img_tag = card.select_one('.product-media img, .woocommerce-LoopProduct-link img, img')
    if not img_tag:
        return None
    
    # WooCommerce themes (such as Riode) store the real image URL in data-lazy or data-src
    img_url = (
        img_tag.get('data-lazy') or 
        img_tag.get('data-src') or 
        img_tag.get('src')
    )
    
    # Fallback if src points to a placeholder image like lazy.png
    if img_url and 'lazy.png' in img_url:
        lazyset = img_tag.get('data-lazyset') or img_tag.get('srcset')
        if lazyset:
            first_candidate = lazyset.split(',')[0].strip().split(' ')[0]
            if first_candidate:
                img_url = first_candidate

    return img_url


def fetch_full_description(session, product_url):
    """
    (Optional Advanced Step) Briefly visits the Product Page Link to extract 
    the 'Full Description' text from the product page.
    """
    if not product_url:
        return ""
    try:
        response = session.get(product_url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            return ""
        
        soup = BeautifulSoup(response.content, "html.parser")
        
        # WooCommerce standard description tab container
        desc_element = (
            soup.select_one('#tab-description') or 
            soup.select_one('.woocommerce-product-details__short-description') or 
            soup.select_one('.entry-content')
        )
        
        if desc_element:
            # Remove <h2>Description</h2> header tag inside tab if present
            h2 = desc_element.find('h2')
            if h2:
                h2.decompose()
            return desc_element.get_text(separator="\n", strip=True)
            
    except Exception as e:
        print(f"   ⚠️ Could not fetch description for {product_url}: {e}")
    
    return ""


def scrape_category_page(url, fetch_details=False, max_pages=1):
    """
    Scrapes product details from a category/listing page on https://libraire.ma/
    
    :param url: The starting category or shop page URL.
    :param fetch_details: If True, visits each product page for full description.
    :param max_pages: Maximum number of pages to iterate over using pagination.
    :return: List of product dictionaries ready for JSON export.
    """
    products = []
    session = requests.Session()
    current_url = url
    page_num = 1

    while current_url and page_num <= max_pages:
        print(f"📖 Scraping Page {page_num}: {current_url}")
        
        try:
            response = session.get(current_url, headers=HEADERS, timeout=15)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"❌ Network error loading {current_url}: {e}")
            break

        soup = BeautifulSoup(response.content, "html.parser")

        # Select product card containers on WooCommerce / Riode template
        product_cards = soup.select(
            ".product-loop, .product-default, ul.products li.product, div.product"
        )
        
        if not product_cards:
            print("⚠️ No product cards found on this page.")
            break

        print(f"   Found {len(product_cards)} product cards.")

        for idx, card in enumerate(product_cards, start=1):
            # Robust error handling inside the loop: if one card fails, continue with the rest
            try:
                # 1. Product Name
                title_tag = (
                    card.select_one('.woocommerce-loop-product__title a') or 
                    card.select_one('.woocommerce-loop-product__title') or 
                    card.select_one('h3 a') or 
                    card.select_one('h2 a')
                )
                name = title_tag.get_text(strip=True) if title_tag else "Unknown Product"

                # 2. Product Page Link (href)
                link_tag = (
                    card.select_one('.woocommerce-loop-product__title a') or 
                    card.select_one('a.woocommerce-LoopProduct-link') or 
                    card.select_one('figure.product-media a')
                )
                product_link = link_tag['href'] if link_tag and link_tag.has_attr('href') else None

                # 3. Price (Extract number & clean as float)
                # Check <ins> tag first (discounted price), fallback to standard .woocommerce-Price-amount
                price_tag = (
                    card.select_one('ins .woocommerce-Price-amount') or 
                    card.select_one('.woocommerce-Price-amount') or 
                    card.select_one('.price')
                )
                price_raw = price_tag.get_text(strip=True) if price_tag else ""
                price = clean_price(price_raw)

                # 4. Main Image URL
                image_url = extract_image_url(card)

                # 5. (Optional Advanced Step): Fetch Full Description
                description = ""
                if fetch_details and product_link:
                    print(f"   [{idx}/{len(product_cards)}] Fetching full description for: {name[:30]}...")
                    description = fetch_full_description(session, product_link)
                    time.sleep(0.5)  # Respectful delay between requests

                # Build clean item dictionary for React frontend
                product_item = {
                    "name": name,
                    "price": price,          # Float in MAD (e.g. 34.9)
                    "image_url": image_url,  # Full image URL
                    "product_link": product_link,
                    "description": description
                }

                products.append(product_item)

            except Exception as card_error:
                # Catch any unexpected extraction error without stopping the loop
                print(f"   ⚠️ Error parsing product card #{idx}: {card_error}")
                continue

        # -------------------------------------------------------------
        # PAGINATION LOGIC:
        # Locate the 'Next' page link in WooCommerce pagination (e.g. page/2/)
        # -------------------------------------------------------------
        next_page = (
            soup.select_one('a.next.page-numbers') or 
            soup.select_one('.woocommerce-pagination a.next') or 
            soup.select_one('a[class*="next"]')
        )

        if next_page and next_page.has_attr('href'):
            current_url = next_page['href']
            page_num += 1
            time.sleep(1)  # Respectful pause between page requests
        else:
            print("🏁 Reached the last page or no pagination link found.")
            break

    return products


if __name__ == "__main__":
    # Example listing/category page URL on https://libraire.ma/
    CATEGORY_URL = "https://libraire.ma/rayon/parascolaire/"

    # Scrape category (Set fetch_details=True to fetch individual product descriptions)
    scraped_data = scrape_category_page(
        url=CATEGORY_URL, 
        fetch_details=False,  # Set to True for full description visiting
        max_pages=2           # Set max number of listing pages to scrape
    )

    # Convert Python list to formatted JSON string
    json_data = json.dumps(scraped_data, ensure_ascii=False, indent=2)

    # Save output to JSON file
    output_filename = "products.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(json_data)

    print(f"\n✨ Done! {len(scraped_data)} products exported to '{output_filename}'.")
