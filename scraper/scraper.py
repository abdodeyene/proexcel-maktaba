import json
import os
import re
import time
import sys
import argparse
import requests
from bs4 import BeautifulSoup

# Standard Browser Headers to mimic real browser requests
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
}

# The main parent categories on libraire.ma that cover the entire catalog
CATEGORIES = [
    "https://libraire.ma/rayon/livres/",
    "https://libraire.ma/rayon/livres-enfants/",
    "https://libraire.ma/rayon/livres-scolaires/",
    "https://libraire.ma/rayon/parascolaire/",
    "https://libraire.ma/rayon/fournitures-scolaires/",
    "https://libraire.ma/rayon/cartables-trousses/",
    "https://libraire.ma/rayon/packs-scolaires/",
    "https://libraire.ma/rayon/religion/",
]

def clean_price(price_raw):
    """
    Extracts the numerical price from Moroccan currency strings like 'د.م. 34,90' or '1 299,00 DH'
    and converts it to a standard float (e.g., 34.9 or 1299.0).
    """
    if not price_raw:
        return 0.0
    try:
        # Standardize string format
        price_clean = price_raw.lower()
        price_clean = price_clean.replace("dh", "").replace("د.م.", "").replace("\xa0", "").strip()
        
        # Remove space thousands separators
        price_clean = price_clean.replace(" ", "")
        
        # Resolve decimal and thousands comma separators
        if "," in price_clean and "." in price_clean:
            # English style: e.g. "1,299.00" -> remove comma
            price_clean = price_clean.replace(",", "")
        elif "," in price_clean:
            # French style: e.g. "34,90" or "1299,00" -> replace comma with dot
            parts = price_clean.split(",")
            if len(parts) == 2 and len(parts[1]) == 3:
                # E.g. "1,299" -> "1299"
                price_clean = price_clean.replace(",", "")
            else:
                # E.g. "34,90" -> "34.90"
                price_clean = price_clean.replace(",", ".")
                
        # Clean non-digit characters except dots/minus
        price_digits = "".join(c for c in price_clean if c.isdigit() or c in ".-")
        if price_digits:
            return float(price_digits)
    except Exception:
        pass
    return 0.0

def fetch_with_retries(url, max_retries=3, backoff=2):
    """
    Fetches a URL with realistic headers, timeouts, and automatic retries.
    """
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            if response.status_code == 200:
                return response
            elif response.status_code == 404:
                # Page doesn't exist
                return None
            time.sleep(backoff * (attempt + 1))
        except Exception:
            time.sleep(backoff * (attempt + 1))
    return None

def parse_product_card_template(template_soup):
    """
    Extracts basic info (URL, fallback fields) from a category page product card template.
    """
    # Find product link
    link_tag = template_soup.find('a', class_='woocommerce-LoopProduct-link')
    if not link_tag:
        link_tag = template_soup.find('a')
        
    product_url = link_tag.get('href') if link_tag else None
    if not product_url or not product_url.startswith('http'):
        return None
        
    # Fallback/base information
    title_tag = template_soup.find(class_='woocommerce-loop-product__title')
    title = title_tag.get_text().strip() if title_tag else ""
    
    price_tag = template_soup.find(class_='price')
    price = clean_price(price_tag.get_text()) if price_tag else 0.0
    
    img_tag = template_soup.find('img')
    image_url = ""
    if img_tag:
        image_url = img_tag.get('data-lazy') or img_tag.get('data-src') or img_tag.get('src') or ""
        
    atc_btn = template_soup.select_one('[data-product_id]')
    if atc_btn:
        product_id = atc_btn.get('data-product_id')
    else:
        qv_btn = template_soup.select_one('[data-product]')
        if qv_btn:
            product_id = qv_btn.get('data-product')
            
    return {
        "id": product_id,
        "name": title,
        "price": price,
        "image_url": image_url,
        "product_url": product_url
    }

def scrape_product_details(product_url):
    """
    Visits a single product page and parses all detailed specifications.
    """
    r = fetch_with_retries(product_url)
    if not r:
        return None
        
    soup = BeautifulSoup(r.text, 'html.parser')
    
    # Initialize defaults
    product_id = ""
    name = ""
    price_val = 0.0
    description = ""
    categories = []
    image_url = ""
    
    # Pre-parse meta tags for fallback details
    page_title = soup.find('title')
    if page_title:
        name = page_title.get_text().split(' - ')[0].strip()
        
    og_image = soup.find('meta', property='og:image')
    if og_image and og_image.get('content'):
        image_url = og_image.get('content').strip()
        
    # Unpack all JSON-encoded HTML script templates inside the page DOM
    templates = []
    for script in soup.find_all('script', type='text/template'):
        # Skip templates that belong to related products or other widgets
        parent_is_related = False
        p = script.parent
        while p and p.name != '[document]':
            p_class = p.get('class', []) or []
            if any(c in p_class for c in ['related', 'products', 'product-wrap', 'owl-carousel', 'widget']):
                parent_is_related = True
                break
            p = p.parent
        if parent_is_related:
            continue
            
        script_text = script.string
        if not script_text:
            continue
        script_text = script_text.strip()
        if script_text.startswith('"') and script_text.endswith('"'):
            try:
                script_text = json.loads(script_text)
            except Exception:
                script_text = script_text[1:-1].replace('\\"', '"').replace('\\/', '/')
        templates.append(BeautifulSoup(script_text, 'html.parser'))
        
    # Extract details from the template structures
    for t_soup in templates:
        # Title
        title_tag = t_soup.find(class_='product_title')
        if title_tag:
            name = title_tag.get_text().strip()
            
        # Price
        price_tag = t_soup.find(class_='price')
        if price_tag:
            price_val = clean_price(price_tag.get_text())
            
        # Categories
        cat_links = t_soup.select('.posted_in a')
        for link in cat_links:
            cat_name = link.get_text().strip()
            if cat_name not in categories:
                categories.append(cat_name)
                
        # ID / SKU
        atc_btn = t_soup.find('button', attrs={'name': 'add-to-cart'})
        if atc_btn and atc_btn.get('value'):
            product_id = atc_btn.get('value').strip()
            
        # Description Accordion / Tab
        desc_container = t_soup.find(id='tab-description') or t_soup.find(class_='woocommerce-Tabs-panel--description') or t_soup.find(class_='product-description')
        if desc_container:
            # Extract plain text or clean description content
            description = desc_container.get_text().strip()
            
        # Image Gallery
        img_links = t_soup.select('.woocommerce-product-gallery__image a, .woocommerce-product-gallery__image img')
        for img in img_links:
            img_href = img.get('href')
            if img_href and img_href.startswith('http'):
                image_url = img_href
                break
            img_src = img.get('data-large_image') or img.get('data-src') or img.get('data-lazy') or img.get('src')
            if img_src and img_src.startswith('http') and 'lazy.png' not in img_src:
                image_url = img_src
                break
                
    # Fallback to standard DOM elements if templates are missing or empty
    if not name:
        name_tag = soup.find(class_='product_title')
        if name_tag:
            name = name_tag.get_text().strip()
            
    if price_val == 0.0:
        price_tag = soup.find(class_='price')
        if price_tag:
            price_val = clean_price(price_tag.get_text())
            
    if not categories:
        cat_links = soup.select('.posted_in a')
        for link in cat_links:
            cat_name = link.get_text().strip()
            if cat_name not in categories:
                categories.append(cat_name)
                
    if not description:
        desc_container = soup.find(id='tab-description') or soup.find(class_='woocommerce-Tabs-panel--description') or soup.find(class_='product-description') or soup.find(class_='woocommerce-product-details__short-description')
        if desc_container:
            description = desc_container.get_text().strip()
            
    if not image_url:
        img_tag = soup.select_one('.woocommerce-product-gallery__image img, .product-media img, img')
        if img_tag:
            image_url = img_tag.get('data-large_image') or img_tag.get('data-src') or img_tag.get('data-lazy') or img_tag.get('src') or ""
            
    if not product_id:
        body_tag = soup.find('body')
        if body_tag:
            for c in body_tag.get('class', []):
                if c.startswith('postid-'):
                    product_id = c.replace('postid-', '').strip()
                    break
                elif c.startswith('post-') and c.replace('post-', '').isdigit():
                    product_id = c.replace('post-', '').strip()
                    break

    # Final cleanup of template tags in description text
    if description:
        description = re.sub(r'\{\{\{.*?\}\}\}', '', description)
        # Normalize double spacing / linebreaks
        description = re.sub(r'\n\s*\n', '\n', description).strip()

    return {
        "id": product_id,
        "name": name,
        "price": price_val,
        "description": description,
        "categories": categories,
        "image_url": image_url,
        "product_url": product_url
    }

def load_json(file_path):
    """
    Loads JSON file if it exists and returns the data, otherwise returns empty list.
    """
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception as e:
            print(f"Warning: Could not load {file_path}: {e}")
    return []

def save_json(file_path, data):
    """
    Saves python dictionary/list to a file using indentations.
    Uses atomic write via temporary file to prevent corruption on abrupt termination.
    """
    temp_file = f"{file_path}.tmp"
    with open(temp_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(temp_file, file_path)

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

    parser = argparse.ArgumentParser(description="Libraire.ma Premium Scraper")
    parser.add_argument("--test", type=str, help="Scrapes a single product URL for verification and exits.")
    args = parser.parse_args()

    if args.test:
        print(f"================================\nTESTING SINGLE PRODUCT\nURL: {args.test}\n================================")
        product = scrape_product_details(args.test)
        if product:
            print(json.dumps(product, ensure_ascii=False, indent=2))
            print("================================\nTEST SUCCESSFUL\n================================")
        else:
            print("================================\nTEST FAILED: Product detail page could not be parsed\n================================")
        sys.exit(0)

    # File paths for resume system
    PRODUCTS_FILE = "products.json"
    FAILED_FILE = "failed-products.json"

    # Requirement 1 & 4: Load existing products and failed products if they exist
    scraped_products = load_json(PRODUCTS_FILE)
    failed_products = load_json(FAILED_FILE)

    # Requirement 2: Build a set of already scraped product URLs from products.json
    scraped_urls = {p.get("product_url") for p in scraped_products if isinstance(p, dict) and p.get("product_url")}

    # Requirement 11: Startup information print
    print("================================")
    print("STARTING LIBRAIRE.MA FULL SCRAPER")
    print("================================")
    print(f"Existing products loaded: {len(scraped_products)}")
    print(f"Existing URLs skipped: {len(scraped_urls)}")
    print("Starting/resuming scraping...")

    try:
        for category_url in CATEGORIES:
            current_page_url = category_url
            page_num = 1
            
            print(f"\nCategory: {category_url}")
            
            while current_page_url:
                print(f"Fetching page {page_num}: {current_page_url}")
                r = fetch_with_retries(current_page_url)
                if not r:
                    print(f"Failed to load category page: {current_page_url}")
                    break
                    
                soup = BeautifulSoup(r.text, 'html.parser')
                
                # Find and unpack product templates on the category page
                card_templates = []
                for script in soup.find_all('script', type='text/template'):
                    script_text = script.string
                    if not script_text:
                        continue
                    script_text = script_text.strip()
                    if script_text.startswith('"') and script_text.endswith('"'):
                        try:
                            script_text = json.loads(script_text)
                        except Exception:
                            script_text = script_text[1:-1].replace('\\"', '"').replace('\\/', '/')
                    
                    # Check if it has a product loop card indicator
                    if 'product-loop' in script_text or 'product-media' in script_text or 'woocommerce-LoopProduct-link' in script_text:
                        card_templates.append(BeautifulSoup(script_text, 'html.parser'))
                        
                print(f"[PAGE {page_num}] Found {len(card_templates)} products")
                
                # Parse product URLs and detail information
                for index, t_soup in enumerate(card_templates, 1):
                    base_info = parse_product_card_template(t_soup)
                    if not base_info:
                        continue
                        
                    product_url = base_info["product_url"]

                    # Requirement 3: Skip product URLs present in products.json
                    if product_url in scraped_urls:
                        print(f"[{index}/{len(card_templates)}] Skipping already scraped product: {base_info['name']}")
                        continue
                    
                    print(f"[{index}/{len(card_templates)}] Scrape details: {base_info['name']}")
                    
                    # Scrape detail page info
                    try:
                        product_details = scrape_product_details(product_url)
                        if product_details and product_details["name"]:
                            # Merge fallback id/image if missing from detail page
                            if not product_details["id"] and base_info["id"]:
                                product_details["id"] = base_info["id"]
                            if not product_details["image_url"] and base_info["image_url"]:
                                product_details["image_url"] = base_info["image_url"]
                                
                            scraped_products.append(product_details)
                            scraped_urls.add(product_url)

                            # If previously failed, remove from failed products list
                            if any(fp.get("product_url") == product_url for fp in failed_products):
                                failed_products = [fp for fp in failed_products if fp.get("product_url") != product_url]
                                save_json(FAILED_FILE, failed_products)

                            # Requirement 5: Save products.json immediately after EVERY successfully scraped product
                            save_json(PRODUCTS_FILE, scraped_products)
                        else:
                            print(f"  --> Failed: Empty detail structure")
                            if not any(fp.get("product_url") == product_url for fp in failed_products):
                                failed_products.append({"product_url": product_url, "reason": "Empty details"})
                            # Requirement 6: Save failed-products.json immediately after a failed product
                            save_json(FAILED_FILE, failed_products)
                    except Exception as ex:
                        print(f"  --> Error scraping details: {ex}")
                        if not any(fp.get("product_url") == product_url for fp in failed_products):
                            failed_products.append({"product_url": product_url, "reason": str(ex)})
                        # Requirement 6: Save failed-products.json immediately after a failed product
                        save_json(FAILED_FILE, failed_products)
                        
                    # Small polite throttle
                    time.sleep(0.5)
                    
                # Navigate to the next page
                next_link_tag = soup.find('a', class_='next')
                if not next_link_tag:
                    next_link_tag = soup.select_one('.page-numbers.next, a.next.page-numbers')
                    
                if next_link_tag and next_link_tag.get('href'):
                    next_href = next_link_tag.get('href')
                    if next_href.startswith('http'):
                        current_page_url = next_href
                    else:
                        current_page_url = "https://libraire.ma" + next_href if next_href.startswith('/') else "https://libraire.ma/" + next_href
                    page_num += 1
                else:
                    current_page_url = None

    except KeyboardInterrupt:
        # Requirement 7: Ctrl+C safety
        print("\nScraping interrupted by user (Ctrl+C). All progress remains saved.")

    # Requirement 12: Final Output Summaries
    print("\n================================")
    print("SCRAPING FINISHED")
    print(f"Total products: {len(scraped_products)}")
    print(f"Total failed products: {len(failed_products)}")
    print("Output: products.json")
    print("================================")

if __name__ == "__main__":
    main()
