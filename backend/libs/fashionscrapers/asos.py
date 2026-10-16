import requests
import json
from bs4 import BeautifulSoup
import math
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import logging
import os
import datetime
import pandas as pd

logging.basicConfig(level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class AsosScraper:

    def __init__(self, 
                 checkpoint_path: str = "checkpoints",
                 test: bool = False):
        self.test_mode = test
        self.checkpoint_path = checkpoint_path
        self.SHOP = "Asos"
        self.ASOS_URL = 'https://www.asos.com'
        self.NAVBARS_ATTRIBUTES = {"class": "VylGWEt LZ9LVYB",
                                   "data-testid": "primarynav-large"
                                   }
        self.SUBSECTIONS_ATTRIBUTES = {"class": "EsGFLPm"}
        self.SUBSECTIONS_FIRST_CONTAINER_ATTRIBUTES = {"class": "ZAntzlZ"}
        self.CATEGORIES = ["clothing", "shoes", "accessories", "activewear"]
        self.CURRENCY_MAPPING = {
            '£': 'GBP',
            '$': 'USD',
            '€': 'EUR',
            '¥': 'JPY',
            '₹': 'INR',
            # Add more mappings as needed
        }
        self.categories_urls = {
            "women": {"clothing": {},
                      "shoes": {},
                      "accessories": {},
                      "activewear": {}
                      },
            "men": {"clothing": {},
                    "shoes": {},
                    "accessories": {},
                    "activewear": {}
                    }
        }
        self.homepage_soup = self.fetch_page_source()
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
            url = self.ASOS_URL
        # logging.info(f"Fetching page source from {url}")
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(url, headers=headers)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            soup = BeautifulSoup(response.text, "html.parser")
            # logging.info("Page source fetched successfully")
            return soup
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching the page: {e}; url - {url}")
            return None

    def collect_categories_urls(self, table: bool = True):
        logging.info("Collecting categories urls")
        navbars = self.homepage_soup.find_all("nav", self.NAVBARS_ATTRIBUTES)
        for navbar in navbars:
            subsections = navbar.find_all("div", self.SUBSECTIONS_ATTRIBUTES)
            for subsection in subsections:
                # it comes from the button element on navbar
                subsection_title = subsection.previous_element.text.lower()
                if subsection_title not in self.CATEGORIES:
                    continue
                first_container = subsection.find(
                    "div", self.SUBSECTIONS_FIRST_CONTAINER_ATTRIBUTES)
                categories_links = first_container.find_all("a")
                for link in categories_links:
                    link_title = link.text.lower()
                    link_href = link["href"]
                    # find gender section
                    gender_section = link_href.split("/")[3]
                    if gender_section == "men" or gender_section == "women":
                        self.categories_urls[gender_section][subsection_title][link_title] = link_href
        logging.info("Categories urls collected successfully")
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
                   "url": f"{self.ASOS_URL}/{section}/"}
            df_row = pd.DataFrame([row])
            df = pd.concat([df, df_row], ignore_index=True)
            for parent, categories in subsection.items():
                url = categories.get("view all", None)
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
        df = pd.DataFrame(columns=["shop", "category", "brand", "shop_product_id", "url", "type", "description", "details", "about", "price", "currency", "color", "availability"])
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
        df = df.drop_duplicates(subset=["shop", "category", "shop_product_id", "url"])
        logging.info(f"Dataframe shape after dropping duplicates: {df.shape}")
        # clean rows with no url, no brand and no shop_product_id, color
        df = df[~((df["url"].isnull()) | (df["brand"].isnull()) | (df["shop_product_id"].isnull()))]
        logging.info(f"Dataframe shape after cleaning: {df.shape}")
        return df

    def compose_page_url(self,
                         url: str,
                         page: int = 1,
                         ):
        parsed_url = urlparse(url)
        query = parse_qs(parsed_url.query)
        query["page"] = page
        new_query = urlencode(query, doseq=True)
        new_url = urlunparse(parsed_url._replace(query=new_query))
        # logging.info(f"Composed page url: {new_url}")
        return new_url

    def get_number_products_pages(self,
                                  category: str = None,
                                  subsection: str = None,
                                  section: str = None,
                                  url: str = None,
                                  ):
        if url:
            chosen_url = url
        elif category and subsection and section and category in self.categories_urls[section][subsection]:
            chosen_url = self.categories_urls[section][subsection][category]
        else:
            raise Exception(
                "Provide url or category, subsection and section. Category should be in the categories_urls")
        first_page = self.compose_page_url(chosen_url, page=1)
        soup = self.fetch_page_source(first_page)
        progress_bar = soup.find("progress", {"class": "progressBar_anIzC"})
        total_products = int(progress_bar["max"])
        products_per_page = int(progress_bar["value"])
        total_pages = math.ceil(total_products / products_per_page)
        logging.info(
            f"Total pages: {total_pages}, products per page: {products_per_page}, total products: {total_products}")
        return total_pages, products_per_page, total_products

    def collect_products_list(self,
                              url: str,
                              ):
        soup = self.fetch_page_source(url)
        products = soup.find_all("article", {"class": "productTile_U0clN"})
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
                product_dict["id"] = product["id"].split("-")[-1]
                product_dict["url"] = product.find(
                    "a", {"class": "productLink_KM4PI"})["href"]
                product_dict["description"] = product.find(
                    "h2", {"class": "productDescription_sryaw"}).text
                full_price = product.find(
                    "span", {"class": "price__B9LP"}).text
                price_value = float(full_price[1:])
                currency = self.CURRENCY_MAPPING[full_price[0]]
                product_dict["price"] = price_value
                product_dict["currency"] = currency
                # collect product details from product page
                try:
                    product_details = self.collect_product_details(
                        product_dict["url"])
                    # merge product details
                    product_dict.update(product_details)
                except Exception as e:
                    logging.error(
                        f"Error collecting product details: {e}; product - {product_dict['url']}")
                products_list.append(product_dict)
            except Exception as e:
                # break if there is an error with the product and save checkpoint
                self.currently_scraping_products.extend(products_list)
                self.currenlty_scraping_product_index = i
                raise Exception(
                    f"Error collecting product: {e}; product - {product}")
        # reset current product index
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

    def collect_product_details(self,
                                product_url: str):
        soup = self.fetch_page_source(product_url)
        product_details = {}
        product_gallery = soup.find("div", {"class": "product-gallery"})
        media_list = product_gallery.find("ul")
        media_elements = media_list.find_all("img")
        media_urls = [media["src"] for media in media_elements]
        product_details["media"] = media_urls
        layout_aside = soup.find("div", {"class": "layout-aside"})
        product_details_element = layout_aside.find(
            "div", {"id": "productDescriptionDetails"})
        if product_details_element is not None:
            try:
                product_details_links = product_details_element.find_all("a")
                # there might be more then two links, but only first two are relevant
                if len(product_details_links) >= 2:
                    product_details["type"] = product_details_links[0].text
                    product_details["brand"] = product_details_links[1].text
                elif len(product_details_links) == 1:
                    product_details_only_link = product_details_links[0]
                    # check if there is any sibilings before
                    if product_details_only_link.previous_sibling is not None:
                        previous_sibling = product_details_only_link.previous_sibling
                        product_details["type"] = previous_sibling.text.replace(
                            " by ", "")
                        product_details["brand"] = product_details_only_link.text
                    else:
                        break_element = product_details_element.find("br")
                        previous_sibling = break_element.previous_sibling
                        product_details["type"] = product_details_only_link.text
                        product_details["brand"] = previous_sibling.text.replace(
                            " by ", "")
                else:
                    break_element = product_details_element.find("br")
                    previous_sibling_text = break_element.previous_sibling.text
                    product_details["type"], product_details["brand"] = previous_sibling_text.split(
                        " by ")
            except Exception as e:
                logging.error(
                    f"Error collecting type and brand: {e}; product - {product_url}")
                product_details["type"] = None
                product_details["brand"] = None
            product_details_list_elements = product_details_element.find_all(
                "li")
            product_details_list = [
                detail.text for detail in product_details_list_elements]
            product_details["details"] = product_details_list
            try:
                product_aboutme_element = layout_aside.find(
                    "div", {"id": "productDescriptionAboutMe"})
                product_aboutme = product_aboutme_element.get_text(
                    separator="\n", strip=True)
                product_details["about"] = product_aboutme
            except Exception as e:
                logging.error(
                    f"Error collecting about: {e}; product - {product_url}")
                product_details["about"] = []
        else:
            product_details["type"] = None
            product_details["brand"] = None
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


def download_asos_image(url: str,
                        folder: str = "media",
                        filename: str = None,
                        resolution: int = 640):
    if not os.path.exists(folder):
        os.makedirs(folder)
    # adjust url to get desired resolution
    parsed_url = urlparse(url)
    query = parse_qs(parsed_url.query)
    query["wid"] = resolution
    new_query = urlencode(query, doseq=True)
    new_url = urlunparse(parsed_url._replace(query=new_query))
    response = requests.get(new_url)
    response.raise_for_status()
    with open(os.path.join(folder, filename), "wb") as f:
        f.write(response.content)
    logging.info(f"Downloaded {filename}")
    return filename


def compose_asos_image_resolution_url(url: str,
                                 resolution: int = 640):
    # adjust url to get desired resolution
    parsed_url = urlparse(url)
    query = parse_qs(parsed_url.query)
    query["wid"] = resolution
    new_query = urlencode(query, doseq=True)
    new_url = urlunparse(parsed_url._replace(query=new_query))
    return new_url
