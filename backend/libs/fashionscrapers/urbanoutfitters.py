import requests
import json
from bs4 import BeautifulSoup
import math
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse, unquote
import logging
import os
import datetime
import pandas as pd
import brotli
from .utils import contains_about_material_terms

logging.basicConfig(level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class UrbanOutfittersScraper:

    def __init__(self,
                 checkpoint_path: str = "checkpoints",
                 test: bool = False,):
        self.test_mode = test
        self.checkpoint_path = checkpoint_path
        self.SHOP = "Urban Outfitters"
        self.BASE_URL = "https://www.urbanoutfitters.com"
        self.PRODUCT_DETAILS_URL = "https://api.urbanoutfitters.com/api/catalog/v0/uo-us/pools/INTL_DIRECT/products"
        self.HEADERS = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Referer": "https://www.urbanoutfitters.com/en-gb/?ref=logo",
            "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
            "X-Urbn-Language": "en-US",
            "X-Urbn-Channel": "web",
            "X-Urbn-Currency": "USD",
        }
        self.CURRENCY_MAPPING = {
            '£': 'GBP',
            '$': 'USD',
            '€': 'EUR',
            '¥': 'JPY',
            '₹': 'INR',
            # Add more mappings as needed
        }
        self.ITEMS_PER_PAGE = 72
        self.session = requests.Session()
        self.auth_token = None
        self.get_auth_token()
        self.categories_urls = {
            "men": {},
            "women": {}
        }
        self.currenlty_scraping_product_index = None
        self.currently_scraping_url_base = None
        self.currently_scraping_products = []
        self.currenlty_scraping_category = None
        self.currently_scraping_section = None
        self.currenlty_scraping_page = None
        self.checkpoint_name = None
        
    def get_auth_token(self,):
        try:
            response = self.session.get(self.BASE_URL, headers=self.HEADERS)
            response.raise_for_status()
            cookies = response.cookies.get_dict()
            if "urbn_auth_payload" in cookies:
                encoded_payload = cookies['urbn_auth_payload']
                decoded_payload = unquote(encoded_payload)
                payload = json.loads(decoded_payload)
                auth_token = payload.get("authToken")
                if auth_token:
                    self.auth_token = auth_token
                    self.HEADERS["Authorization"] = f"Bearer {auth_token}"
                    logging.info(f"Auth token fetched successfully: {auth_token}")
                    return auth_token
                else:
                    logging.error("Auth token not found in the payload")
                    return None
            else:
                logging.error("urbn_auth_payload cookie not found")
                return None
        except Exception as e:
            logging.error(f"Error fetching the auth token: {e}")
            return None
        

    def fetch_page_source(self, url: str = None):
        if url is None:
            url = self.BASE_URL
            # logging.info(f"Fetching page source from {url}")
        try:
            response = self.session.get(url, headers=self.HEADERS)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            
            soup = BeautifulSoup(response.text, "html.parser")
            # logging.info("Page source fetched successfully")
            return soup
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching the page: {e}; url - {url}")
            return None
        
    def collect_categories_urls(self, table: bool = True):
        logging.info("Collecting categories urls")
        gender_section_urls = {
            "men": "https://api.urbanoutfitters.com/api/catalog/v0/uo-us/navigation?slug=mens-clothing&projection-slug=left-nav-l1",
            "women": "https://api.urbanoutfitters.com/api/catalog/v0/uo-us/navigation?slug=womens-clothing&projection-slug=left-nav-l1"
        }
        for gender_section, section_url in gender_section_urls.items():
            try:
                response = self.session.get(section_url, headers=self.HEADERS)
                response.raise_for_status()
                data = response.json()
                categories_obj_list = data.get("navigationItems")[0].get("navigationItems")
                for category_obj in categories_obj_list:
                    category_name = category_obj.get("displayName")
                    if category_obj.get("targetUrl"):
                        category_url = f"{self.BASE_URL}{category_obj.get('targetUrl')}"
                    else:
                        category_url = f"{self.BASE_URL}/{category_obj.get('slug')}"
                    self.categories_urls[gender_section][category_name] = category_url
            except Exception as e:
                logging.error(f"Error collecting categories urls: {e}")
        if table:
            return self.table_categories()
        else:
            return self.categories_urls
    
        
    def table_categories(self, categories_urls: dict = None):
        if categories_urls is None:
            categories_urls = self.categories_urls
        # table with pandas
        # shop name, parent category, category name, url
        df = pd.DataFrame(columns=["shop", "parent", "name", "url"])
        # start from first layer men women then go to the next layer an so on
        for section, subsection in categories_urls.items():
            row = {"shop": self.SHOP, "parent": (), "name": section,
                   "url": f"{self.BASE_URL}/{section}s-clothing/"}
            df_row = pd.DataFrame([row])
            df = pd.concat([df, df_row], ignore_index=True)
            for category, url in subsection.items():
                row = {"shop": self.SHOP, "parent": (section,), "name": category, "url": url}
                df_row = pd.DataFrame([row])
                df = pd.concat([df, df_row], ignore_index=True)
        logging.info(f"Dataframe shape: {df.shape}")
        # clean from doubles
        logging.info("Cleaning the dataframe")
        # drop duplicates
        logging.info("Dropping duplicates")
        df = df.drop_duplicates()
        # clean rows with len(parents == 2) and no url
        logging.info("Cleaning rows with no url and parent length == 2")
        df = df[~((df["url"].isnull()) & (df["parent"].apply(len) == 2))]
        logging.info(f"Dataframe shape: {df.shape}")
        return df
    
    def table_products(self, products_data: list, category_path: tuple):
        # shop, category, brand, shop_product_id, url, description, details, about, price, currency, color, availability
        df = pd.DataFrame(columns=["shop", "category", "brand", "shop_product_id", "url", "type",
                          "description", "details", "about", "price", "currency", "color", "availability"])
        category = category_path
        for product in products_data:
            details = product.get("details", [])
            media = product.get("media", [])
            row = {"shop": self.SHOP,
                   "category": category,
                   "brand": product.get("brand", None),
                   "shop_product_id": product.get("id", None),
                   "url": product.get("url", None),
                   "type": product.get("type", None),
                   "description": product.get("description", None),
                   "details": details,
                   "about": product.get("about", None),
                   "price": product.get("price", None),
                   "currency": product.get("currency", None),
                   "color": product.get("color", None),
                   "availability": product.get("availability", {}),
                   "media": media
                   }
            df_row = pd.DataFrame([row])
            df = pd.concat([df, df_row], ignore_index=True)
        # clean from doubles
        logging.info(f"Dataframe shape: {df.shape}")
        df = df.drop_duplicates(
            subset=["shop", "category", "shop_product_id", "url"])
        logging.info(f"Dataframe shape after dropping duplicates: {df.shape}")
        # clean rows with no url, no brand and no shop_product_id, color
        df = df[~((df["url"].isnull()) | (df["brand"].isnull())
                  | (df["shop_product_id"].isnull()))]
        logging.info(f"Dataframe shape after cleaning: {df.shape}")
        return df
    
    def compose_page_url(self, url: str, page: int = 1):
        parsed = urlparse(url)
        query = parse_qs(parsed.query)
        query["page"] = page
        new_query = urlencode(query, doseq=True)
        new_url = urlunparse((parsed.scheme, parsed.netloc,
                             parsed.path, parsed.params, new_query, parsed.fragment))
        return new_url
    
    def get_number_products_pages(self,
                                  category: str = None,
                                  section: str = None,
                                  url: str = None):
        if url:
            chosen_url = url
        elif category and section and category in self.categories_urls[section]:
            chosen_url = self.categories_urls[section][category]
        else:
            raise Exception("Provide url, or category and section")
        first_page = self.compose_page_url(chosen_url, 1)
        soup = self.fetch_page_source(first_page)
        #print(soup.prettify())
        items_count_span = soup.find("span", {"class": "c-pwa-tile-result-count"})
        items_str = items_count_span.text.strip().split(" ")[0]
        total_products = int(items_str)
        products_per_page = self.ITEMS_PER_PAGE
        total_pages = math.ceil(total_products / products_per_page)
        return total_pages, products_per_page, total_products
        
    def collect_products_list(self, url: str):
        soup = self.fetch_page_source(url)
        products = soup.find_all("div", {"class": "c-pwa-tile-grid-inner"})
        products_list = []
        if self.currenlty_scraping_product_index is not None:
            start_product = self.currenlty_scraping_product_index
        else:
            start_product = 0
        if self.test_mode:
            products = products[:10]
        for i in range(start_product, len(products)):
            product = products[i]
            try:
                product_dict = {}
                product_dict["url"] = self.BASE_URL + product.find("a")["href"]
                product_dict["description"] = product.find("p", {"class": "o-pwa-product-tile__heading"}).text
                full_price = product.select_one("span.c-pwa-product-price__current").text
                # check if is of mutliple prices eg. $34.95 – $69.99
                if "–" in full_price:
                    full_price = full_price.split("–")[1].strip()
                price_value = float(full_price[1:])
                currency = self.CURRENCY_MAPPING[full_price[0]]
                product_dict["price"] = price_value
                product_dict["currency"] = currency
                product_details = self.collect_product_details(product_dict["url"])
                product_dict.update(product_details)
                products_list.append(product_dict)
            except Exception as e:
                self.currently_scraping_products.extend(products_list)
                self.currenlty_scraping_product_index = i
                raise Exception(f"Error collecting product {i}: {e}")
        # reset the index
        self.currenlty_scraping_product_index = None
        logging.info(f"Collected {len(products_list)} products")
        return products_list
    
    def collect_product_details(self, product_url: str):
        product_details = self.retrieve_product_details(product_url)
        # find media urls
        soup = self.fetch_page_source(product_url)
        media_grid = soup.find("div", {"class": "c-pwa-product-image-grid__slider"})
        media_elements = media_grid.find_all("picture")
        media_urls = [media["url"] for media in media_elements]
        product_details["media"] = media_urls
        return product_details
        
    def retrieve_product_details(self, product_url: str):
        product_url_parsed = urlparse(product_url)
        prodcut_slug = product_url_parsed.path.split("/")[-1]
        product_details_url = self.compose_product_details_url(prodcut_slug)
        response_product_details = self.session.get(product_details_url, headers=self.HEADERS)
        response_product_details.raise_for_status()
        product_data = response_product_details.json()[0]
        product_details = {}
        product_color_id = parse_qs(product_url_parsed.query)["color"][0]
        product_details["id"]= f"{product_data['product']['styleNumber']}_{product_color_id}"
        types_list = product_data["product"]["facets"].get("attributionProductType", [])
        if len(types_list) > 0:
            product_details["type"] = " ".join(types_list).lower()
        else:
            product_details["type"] = None
        product_details["brand"] = product_data["product"].get("brand", self.SHOP)
        long_description = product_data["product"].get("longDescription", None)
        #print(long_description)
        if long_description is None:
            product_details["details"] = []
            product_details["about"] = None
        else:
            details_components = long_description.split("\n")
            # remove the strings into ** **
            details = [detail.strip() for detail in details_components if not detail.startswith("**") and not detail.endswith("**") and detail != ""]
            # remove the \\- strings if any
            details = [detail.replace("\\- ", "") for detail in details]
            # now split long details composed of multiple sentances into separate sentances
            details = [detail for detail in details for detail in detail.split(". ")]
            about = contains_about_material_terms(details)
            product_details["details"] = details
            product_details["about"] = ". ".join(about) if len(about) > 0 else None
        # find the color 
        different_product_colors = product_data["skuInfo"]["primarySlice"]["sliceItems"]
        # find the one with the right id
        product_color = [product_color.get("displayName", None) for product_color in different_product_colors if product_color["id"] == product_details["id"]][0] if len(different_product_colors) > 0 else None
        product_details["color"] = product_color.lower() if product_color else None
        return product_details
        
        
    def compose_product_details_url(self, product_slug: str):
        url_parsed = urlparse(self.PRODUCT_DETAILS_URL)
        query = parse_qs(url_parsed.query)
        query["slug"] = product_slug
        query["projection-slug"] = "pdp"
        query["countryCode"] = "GB"
        new_query = urlencode(query, doseq=True)
        new_url = urlunparse((url_parsed.scheme, url_parsed.netloc,
                              url_parsed.path, url_parsed.params, new_query, url_parsed.fragment))
        return new_url
    
    def collect_category_products(self,
                                  category: str = None,
                                  section: str = None,
                                  url: str = None,
                                  start_page: int = 1):
        if url:
            self.currently_scraping_url_base = url
        elif category and section and category in self.categories_urls[section]:
            self.currently_scraping_url_base = self.categories_urls[section][category]
            self.currenlty_scraping_category = category
            self.currently_scraping_section = section
        else:
            raise Exception("Provide url, or category and section")
        total_pages, products_per_page, total_products = self.get_number_products_pages(category, section, url)
        logging.info(f"Total pages: {total_pages}")
        if self.test_mode:
            total_pages = 1
        for page in range(start_page, total_pages+1):
            logging.info(f"Scraping page {page}")
            page_url = self.compose_page_url(self.currently_scraping_url_base
                                             , page)
            try:
                self.currently_scraping_products.extend(self.collect_products_list(page_url))
            except Exception as e:
                logging.error(f"Error scraping page {page}: {e}")
                self.currenlty_scraping_page = page
                self.save_checkpoint()
                return None
        logging.info(f"Scraped {len(self.currently_scraping_products)} products from {total_pages} pages")
        return self.currently_scraping_products
    
    def save_checkpoint(self):
        # create folder if it does not exist
        if not os.path.exists(self.checkpoint_path):
            os.makedirs(self.checkpoint_path)
        checkpoint = {
            "section": self.currently_scraping_section,
            "category": self.currenlty_scraping_category,
            "url": self.currently_scraping_url_base,
            "page": self.currenlty_scraping_page,
            "product_index": self.currenlty_scraping_product_index,
            "products_list": self.currently_scraping_products
        }
        # compose checkpoint name using current date and time
        now = datetime.datetime.now()
        self.checkpoint_name = f"checkpoint_{now.strftime('%Y-%m-%d_%H-%M-%S')}.json"
        with open(os.path.join(self.checkpoint_path, self.checkpoint_name), "w") as f:
            json.dump(checkpoint, f)
        logging.info(
            f"Checkpoint saved for {self.currently_scraping_section}_{self.currenlty_scraping_category}")

    def load_checkpoint(self,):
        # find the latest checkpoint
        if self.checkpoint_name is not None:
            latest_checkpoint = self.checkpoint_name
        else:
            checkpoints = os.listdir(self.checkpoint_path)
            latest_checkpoint = sorted(checkpoints)[-1]
        with open(os.path.join(self.checkpoint_path, self.checkpoint_name), "r") as f:
            checkpoint = json.load(f)
        # delete the checkpoint
        os.remove(os.path.join(self.checkpoint_path, latest_checkpoint))
        self.currently_scraping_section = checkpoint["section"]
        self.currenlty_scraping_category = checkpoint["category"]
        self.currently_scraping_url_base = checkpoint["url"]
        self.currenlty_scraping_page = checkpoint["page"]
        self.currenlty_scraping_product_index = checkpoint["product_index"]
        self.currently_scraping_products = checkpoint["products_list"]
        logging.info(
            f"Loaded checkpoint for {self.currently_scraping_section}_{self.currenlty_scraping_category}")

    def restart_from_checkpoint(self, skip_product: bool = False):
        if skip_product:
            self.currenlty_scraping_product_index += 1
        return self.collect_category_products(self.currenlty_scraping_category,
                                              self.currently_scraping_section, self.currently_scraping_url_base, self.currenlty_scraping_page)
            