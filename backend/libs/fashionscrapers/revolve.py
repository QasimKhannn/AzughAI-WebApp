import requests
import json
from bs4 import BeautifulSoup
import math
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import logging
import os
import datetime
import pandas as pd
import time
from .utils import contains_about_material_terms

logging.basicConfig(level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class RevolveScraper:

    def __init__(self,
                 checkpoint_path: str = "checkpoints",
                 test: bool = False):
        self.test_mode = test
        self.checkpoint_path = checkpoint_path
        self.SHOP = "Revolve"
        self.BASE_URL = "https://www.revolve.com"
        self.PRODUCT_DATA_URL = "https://www.revolve.com/r/ajax/GetProductData.jsp?product%5B%5D="
        self.PRODUCT_DETAILS_URL = "https://www.revolve.com/content/product/getMarkup/productDetailsTab/"
        self.LAZYLOAD_URL = "https://www.revolve.com/content/products/lazyLoadProductsRevolve"
        self.MEN_URL = f"{self.BASE_URL}/mens/?navsrc=global"
        self.WOMEN_URL = F"{self.BASE_URL}/womens/?navsrc=global"
        self.CATEGORIES = ["clothing", "shoes", "accessories"]
        self.CURRENCY_MAPPING = {
            '£': 'GBP',
            '$': 'USD',
            '€': 'EUR',
            '¥': 'JPY',
            '₹': 'INR',
            # Add more mappings as needed
        }
        self.HEADERS = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/132.0.0.0 Safari/537.36",
            "Accept": ("text/html,application/xhtml+xml,application/xml;"
                       "q=0.9,image/avif,image/webp,image/apng,*/*;"
                       "q=0.8,application/signed-exchange;v=b3;q=0.7"),
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Referer": "{BASE_URL}",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"'
        }
        self.categories_urls = {
            "men": {
                "clothing": {},
                "shoes": {},
                "accessories": {}
            },
            "women": {
                "clothing": {},
                "shoes": {},
                "accessories": {}
            }
        }
        self.currenlty_scraping_product_index = None
        self.currently_scraping_section = None
        self.currently_scraping_subsection = None
        self.currenlty_scraping_category = None
        self.currently_scraping_url_base = None
        self.currenlty_scraping_page = None
        self.currenlty_scraping_product_index = None
        self.currently_scraping_products = []
        self.checkpoint_name = None

    def fetch_page_source(self, url: str = None):
        if url is None:
            url = self.BASE_URL
        try:
            session = requests.Session()
            session.cookies.set("currency", "USD")
            session.cookies.set("currencyOverride", "GBP")
            session.cookies.set("userLanguagePref", "en")
            response = session.get(url, headers=self.HEADERS, timeout=30)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            logging.info(f"Request to {url} successful")
            soup = BeautifulSoup(response.text, "html.parser")
            return soup

        except requests.exceptions.Timeout:
            print(f"Request to {url} timed out")
            return None
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def collect_categories_urls(self, table: bool = True):
        logging.info("Collecting categories URLs")
        gender_section_urls = {
            "men": self.MEN_URL,
            "women": self.WOMEN_URL
        }
        for gender_section, section_url in gender_section_urls.items():
            section_soup = self.fetch_page_source(section_url)
            navbar = section_soup.find("nav")
            subsections_container = navbar.find("ul", recursive=False)
            subsections = subsections_container.find_all("li", recursive=False)
            for subsection in subsections:
                subsection_title = subsection.find(
                    "a", recursive=False).text.strip().lower()
                if subsection_title in self.CATEGORIES:
                    categories_container = subsection.find("ul")
                    categories = categories_container.find_all(
                        "li", recursive=False)
                    for category in categories:
                        link = category.find("a")
                        link_title = link.text.strip().lower()
                        link_href = link["href"]
                        self.categories_urls[gender_section][subsection_title][
                            link_title] = f"{self.BASE_URL}{link_href}"
        logging.info("Categories URLs collected successfully")
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
                   "url": f"{self.BASE_URL}/{section}/"}
            df_row = pd.DataFrame([row])
            df = pd.concat([df, df_row], ignore_index=True)
            for parent, categories in subsection.items():
                url = categories.get(f"all {parent}", None)
                row = {"shop": self.SHOP, "parent": (
                    section,), "name": parent, "url": url}
                df_row = pd.DataFrame([row])
                df = pd.concat([df, df_row], ignore_index=True)
                for category, url in categories.items():
                    # if category != "view all":
                    row = {"shop": self.SHOP, "parent": (
                        section, parent), "name": category, "url": url}
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
        query["pageNum"] = page
        new_query = urlencode(query, doseq=True)
        new_url = urlunparse((parsed.scheme, parsed.netloc,
                             parsed.path, parsed.params, new_query, parsed.fragment))
        return new_url

    def compose_lazyload_url(self, page_url: str):
        # compose lazyload url
        lazyload_parsed = urlparse(self.LAZYLOAD_URL)
        lazyload_query = parse_qs(lazyload_parsed.query)
        lazyload_query["url"] = page_url
        lazyload_query["sortBy"] = "featured"
        lazyload_query["productsPerRow"] = "4"
        lazyload_query["preLoadCategory"] = ""
        lazyload_query["preLoadDesigner"] = ""
        lazyload_query["lazyLang"] = "en"
        lazyload_query["lazyCountryCode"] = "GB"
        lazyload_query["lazyCurrency"] = "GBP"
        # find current time in milliseconds
        current_time = int(time.time() * 1000)
        lazyload_query["_"] = str(current_time)
        composed_lazyload_query = urlencode(lazyload_query, doseq=True)
        composed_lazyload_url = urlunparse((lazyload_parsed.scheme, lazyload_parsed.netloc, lazyload_parsed.path,
                                           lazyload_parsed.params, composed_lazyload_query, lazyload_parsed.fragment))
        return composed_lazyload_url

    def get_number_products_pages(self,
                                  category: str = None,
                                  subsection: str = None,
                                  section: str = None,
                                  url: str = None):
        if url:
            chosen_url = url
        elif category and subsection and section and category in self.categories_urls[section][subsection]:
            chosen_url = self.categories_urls[section][subsection][category]
        else:
            raise Exception(
                "Provide url or category, subsection and section. Category should be in the categories_urls")
        first_page = self.compose_page_url(chosen_url, page=1)
        soup = self.fetch_page_source(first_page)
        items_count_span = soup.find("span", {"class": "filters__item-count"})
        items_str = items_count_span.text.split(" ")[0]
        # replace , with dot if needed
        items_str = items_str.replace(",", "")
        total_products = int(items_str)
        products_per_page_select = soup.find("select", {"id": "plp-view"})
        selceted_option = products_per_page_select.find(
            "option", selected=True)
        products_per_page = int(selceted_option["value"])
        total_pages = math.ceil(total_products / products_per_page)
        logging.info(
            f"Total pages: {total_pages}, products per page: {products_per_page}, total products: {total_products}")
        return total_pages, products_per_page, total_products

    def retrieve_product_data(self, product_id: str):
        url = f"{self.PRODUCT_DATA_URL}{product_id}"
        try:
            session = requests.Session()
            session.cookies.set("currency", "USD")
            session.cookies.set("currencyOverride", "GBP")
            session.cookies.set("userLanguagePref", "en")
            response = session.get(url, headers=self.HEADERS, timeout=30)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            logging.info(f"Request to {url} was successful")
            return response.json()
        except requests.exceptions.Timeout:
            logging.error(f"Request to {url} timed out")
            return {}
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed: {e}")
            return {}

    def retrieve_product_details(self, product_id: str):
        url = f"{self.PRODUCT_DETAILS_URL}{product_id}"
        try:
            session = requests.Session()
            session.cookies.set("currency", "USD")
            session.cookies.set("currencyOverride", "GBP")
            session.cookies.set("userLanguagePref", "en")
            response = session.get(url, headers=self.HEADERS, timeout=30)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            logging.info(f"Request to {url} was successful")
            details_soup = BeautifulSoup(response.text, "html.parser")
            return details_soup
        except requests.exceptions.Timeout:
            logging.error(f"Request to {url} timed out")
            return None
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed: {e}")
            return None

    def lazyload_page(self, page_url: str):
        # compose lazyload url
        page_lazyload_url = self.compose_lazyload_url(page_url)
        try:
            session = requests.Session()
            session.cookies.set("currency", "USD")
            session.cookies.set("currencyOverride", "GBP")
            session.cookies.set("userLanguagePref", "en")
            response = session.get(
                page_lazyload_url, headers=self.HEADERS, timeout=30)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            list_soup = BeautifulSoup(response.text, "html.parser")
            logging.info(f"Request to {page_lazyload_url} was successful")
            return list_soup
        except requests.exceptions.Timeout:
            logging.error(f"Request to {page_lazyload_url} timed out")
            return None
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed: {e}")
            return None

    def collect_products_list(self, url: str):
        soup = self.fetch_page_source(url)
        products_list = soup.find("ul", {"id": "plp-prod-list"})
        products = products_list.find_all("li", recursive=False)
        # lazyload remaning products
        products_list_lazyload = self.lazyload_page(url)
        lazyload_products = products_list_lazyload.find_all(
            "li", recursive=False)
        products.extend(lazyload_products)
        print(f"Found {len(products)} products")
        products_list = []
        if self.currenlty_scraping_product_index is not None:
            start_product = self.currenlty_scraping_product_index
        else:
            start_product = 0
        if self.test_mode:
            products = products[:10]
        # for testing purpose limit to 10 later
        for i in range(start_product, len(products)):
            product = products[i]
            try:
                product_dict = {}
                product_dict["id"] = product["id"]
                product_info_container = product.find(
                    "div", {"class": "js-product-info-block u-relative"})
                product_href = product_info_container.find(
                    "a", recursive=False)["href"]
                product_dict["url"] = f"{self.BASE_URL}{product_href}"
                product_dict["description"] = product_info_container.find(
                    "div", {"class": "product-name u-margin-t--lg js-plp-name"}).text.strip()
                try:
                    full_price = product_info_container.select_one(
                        "span.plp_price, span.plp-price").text.strip()
                    price_value = float(full_price[1:].replace(",", ""))
                    currency = self.CURRENCY_MAPPING[full_price[0]]
                    product_dict["price"] = price_value
                    product_dict["currency"] = currency
                except Exception as e:
                    logging.error(f"Error in price: {e}")
                    product_dict["price"] = None
                    product_dict["currency"] = None
                # now retrieve the details of the product
                product_details = self.collect_product_details(
                    product_dict["id"])
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

    def collect_category_products(self,
                                  category: str = None,
                                  subsection: str = None,
                                  section: str = None,
                                  url: str = None,
                                  start_page: int = 1,
                                  ):
        if url:
            self.currently_scraping_url_base = url
        elif category and subsection and section and category in self.categories_urls[section][subsection]:
            self.currently_scraping_url_base = self.categories_urls[section][subsection][category]
            self.currenlty_scraping_category = category
            self.currently_scraping_subsection = subsection
            self.currently_scraping_section = section
        else:
            raise Exception(
                "Provide url or category, subsection and section. Category should be in the categories_urls")
        total_pages, products_per_page, total_products = self.get_number_products_pages(
            category, subsection, section, url)
        if self.test_mode:
            total_pages = 1
        for page in range(start_page, total_pages+1):
            logging.info(
                f"Collecting products from page {page} out of {total_pages}")
            page_url = self.compose_page_url(
                self.currently_scraping_url_base, page)
            try:
                self.currently_scraping_products.extend(
                    self.collect_products_list(page_url))
            except Exception as e:
                logging.error(
                    f"Error collecting products from page {page}: {e}")
                self.currenlty_scraping_page = page
                self.save_checkpoint()
                return None
        logging.info(
            f"Collected {len(self.currently_scraping_products)} products from {total_pages} pages")
        return self.currently_scraping_products

    def collect_product_details(self, product_id: str):
        product_details = {}
        product_data_dict = self.retrieve_product_data(product_id)
        product_data = product_data_dict.get(product_id, {})
        media_urls = product_data.get("imgSuggestions", [])
        product_details["media"] = [
            compose_revolve_image_resolution_url(media) for media in media_urls]
        product_details["type"] = product_data.get(
            "category").lower() if product_data.get("category") else None
        product_details["brand"] = product_data.get("brand", None)
        product_details["color"] = product_data.get(
            "color").lower() if product_data.get("color") else None
        product_details_section = self.retrieve_product_details(product_id)
        try:
            product_details_container = product_details_section.find(
                "div", {"id": "product-details__description"})
            product_detials_lists = product_details_container.find_all(
                "ul", recursive=False)
            details = []
            for details_list in product_detials_lists:
                details.extend([detail.text.strip()
                               for detail in details_list.find_all("li")])
            materials = contains_about_material_terms(details)
            product_details["about"] = ", ".join(materials) if len(materials) > 0 else None
            product_details["details"] = details
        except Exception as e:
            logging.error(f"Error in product details: {e}")
            product_details["details"] = []
            product_details["about"] = None
        return product_details

    def save_checkpoint(self):
        # create folder if it does not exist
        if not os.path.exists(self.checkpoint_path):
            os.makedirs(self.checkpoint_path)
        checkpoint = {
            "section": self.currently_scraping_section,
            "subsection": self.currently_scraping_subsection,
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
            f"Checkpoint saved for {self.currently_scraping_section}_{self.currently_scraping_subsection}_{self.currenlty_scraping_category}")

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
        self.currently_scraping_subsection = checkpoint["subsection"]
        self.currenlty_scraping_category = checkpoint["category"]
        self.currently_scraping_url_base = checkpoint["url"]
        self.currenlty_scraping_page = checkpoint["page"]
        self.currenlty_scraping_product_index = checkpoint["product_index"]
        self.currently_scraping_products = checkpoint["products_list"]
        logging.info(
            f"Loaded checkpoint for {self.currently_scraping_section}_{self.currently_scraping_subsection}_{self.currenlty_scraping_category}")

    def restart_from_checkpoint(self, skip_product: bool = False):
        if skip_product:
            self.currenlty_scraping_product_index += 1
        return self.collect_category_products(self.currenlty_scraping_category, self.currently_scraping_subsection,
                                              self.currently_scraping_section, self.currently_scraping_url_base, self.currenlty_scraping_page)


def compose_revolve_image_resolution_url(url: str,
                                         resolution: str = "uv"):
    parsed = urlparse(url)
    path = parsed.path
    path_parts = path.split("/")
    resolution_index = path_parts.index("p4") + 2
    path_parts[resolution_index] = resolution
    new_path = "/".join(path_parts)
    new_url = urlunparse((parsed.scheme, parsed.netloc,
                         new_path, parsed.params, parsed.query, parsed.fragment))
    return new_url
