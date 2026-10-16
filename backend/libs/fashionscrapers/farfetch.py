import requests
import json
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
import logging
import os
import datetime
import pandas as pd
from time import sleep

logging.basicConfig(level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class FarfetchScraper:

    def __init__(self,
                 checkpoint_path: str = "checkpoints",
                 test: bool = False):
        self.test_mode = test
        self.checkpoint_path = checkpoint_path
        self.SHOP = "Farfetch"
        self.BASE_URL = "https://www.farfetch.com"
        self.RETRIEVE_DATA_URL = "https://www.farfetch.com/uk/experience-gateway"
        self.HEADERS = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Referer": f"{self.BASE_URL}/",
            "origin": f"{self.BASE_URL}/",
            "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        }
        self.CURRENCY_MAPPING = {
            '£': 'GBP',
            '$': 'USD',
            '€': 'EUR',
            '¥': 'JPY',
            '₹': 'INR',
            # Add more mappings as needed
        }
        self.CATEGORIES_IDS = {
            "men": {
                "id": "141259",
                "children": {
                    "clothing": {
                        "id": "136330",
                        "children": {
                            "all clothing": {
                                "id": "136330"
                            },
                            "activewear": {
                                "id": "137116"
                            },
                            "coats": {
                                "id": "136336"
                            },
                            "denim": {
                                "id": "136337"
                            },
                            "jackets": {
                                "id": "136335"
                            },
                            "polo shirts": {
                                "id": "136333"
                            },
                            "pre-owned": {
                                "id": "136343"
                            },
                            "shirts": {
                                "id": "136331"
                            },
                            "shorts": {
                                "id": "136339"
                            },
                            "suits": {
                                "id": "136340"
                            },
                            "sweaters & knitwear": {
                                "id": "136334"
                            },
                            "swimwear & beachwear": {
                                "id": "136342"
                            },
                            "trousers": {
                                "id": "136338"
                            },
                            "t-shirts & vests": {
                                "id": "136332"
                            },
                            "underwear & socks": {
                                "id": "136341"
                            }
                        }
                    },
                    "shoes": {
                        "id": "135968",
                        "children": {
                            "all shoes": {
                                "id": "135968"
                            },
                            "boots": {
                                "id": "136353"
                            },
                            "brogues": {
                                "id": "136354"
                            },
                            "derby shoes": {
                                "id": "136499"
                            },
                            "espadrilles": {
                                "id": "136356"
                            },
                            "slides & flip flops": {
                                "id": "136357"
                            },
                            "loafers": {
                                "id": "136359"
                            },
                            "monk shoes": {
                                "id": "136487"
                            },
                            "oxford shoes": {
                                "id": "136498"
                            },
                            "sandals ": {
                                "id": "136360 "
                            },
                            "trainers": {
                                "id": "137174"
                            }
                        }
                    },
                    "bags": {
                        "id": "135970",
                        "children": {
                            "all bags": {
                                "id": "135970"
                            },
                            "backpacks": {
                                "id": "136362"
                            },
                            "belt bags": {
                                "id": "137190"
                            },
                            "clutch bags": {
                                "id": "135998"
                            },
                            "laptop bags & briefcases": {
                                "id": "136014"
                            },
                            "luggage & holdalls": {
                                "id": "136363"
                            },
                            "messenger bags": {
                                "id": "136364"
                            },
                            "shoulder bags": {
                                "id": "136034"
                            },
                            "tote bags": {
                                "id": "136032"
                            }
                        }
                    },
                    "accessories": {
                        "id": "135972",
                        "children": {
                            "all accessories": {
                                "id": "135972"
                            },
                            "belts": {
                                "id": "136000"
                            },
                            "gloves": {
                                "id": "136372"
                            },
                            "hats": {
                                "id": "136006"
                            },
                            "phone cases": {
                                "id": "136377"
                            },
                            "scarves": {
                                "id": "136002"
                            },
                            "sunglasses": {
                                "id": "136373"
                            },
                            "ties & bow ties": {
                                "id": "136004"
                            },
                            "wallets & cardholders": {
                                "id": "136375"
                            },
                            "pre-owned accessories ": {
                                "id": "136344"
                            }
                        }
                    }
                }
            },
            "women": {
                "id": "141258",
                "children": {
                    "clothing": {
                        "id": "135967",
                        "children": {
                            "all clothing": {
                                "id": "135967"
                            },
                            "activewear": {
                                "id": "137117"
                            },
                            "beachwear": {
                                "id": "136293"
                            },
                            "coats": {
                                "id": "136227"
                            },
                            "denim": {
                                "id": "136043"
                            },
                            "dresses": {
                                "id": "135979"
                            },
                            "jackets": {
                                "id": "136226"
                            },
                            "knitwear": {
                                "id": "136245"
                            },
                            "lingerie": {
                                "id": "136071"
                            },
                            "skirts": {
                                "id": "135985"
                            },
                            "skiwear": {
                                "id": "137134"
                            },
                            "tops": {
                                "id": "135983"
                            },
                            "trousers": {
                                "id": "135981"
                            }
                        }
                    },
                    "shoes": {
                        "id": "136301",
                        "children": {
                            "all shoes": {
                                "id": "136301"
                            },
                            "ballet pumps": {
                                "id": "136484"
                            },
                            "boots": {
                                "id": "136302"
                            },
                            "espadrilles": {
                                "id": "136304"
                            },
                            "slides & flip flops": {
                                "id": "136305"
                            },
                            "loafers": {
                                "id": "136306"
                            },
                            "mules": {
                                "id": "136467"
                            },
                            "pumps": {
                                "id": "136307"
                            },
                            "sandals": {
                                "id": "136308"
                            },
                            "trainers": {
                                "id": "136310"
                            }
                        }
                    },
                    "bags": {
                        "id": "135971",
                        "children": {
                            "all bags": {
                                "id": "135971"
                            },
                            "backpacks": {
                                "id": "136311"
                            },
                            "beach bags": {
                                "id": "136297"
                            },
                            "bucket bags": {
                                "id": "137189"
                            },
                            "clutch bags": {
                                "id": "135999"
                            },
                            "mini bags": {
                                "id": "137170"
                            },
                            "cross-body bags": {
                                "id": "136315"
                            },
                            "shoulder bags": {
                                "id": "136035"
                            },
                            "tote bags": {
                                "id": "136033"
                            }
                        }
                    },
                    "accessories": {
                        "id": "135973",
                        "children": {
                            "all accessories": {
                                "id": "135973"
                            },
                            "belts": {
                                "id": "136001"
                            },
                            "glasses & frames": {
                                "id": "136321"
                            },
                            "gloves": {
                                "id": "136324"
                            },
                            "hair accessories": {
                                "id": "136069"
                            },
                            "hats": {
                                "id": "136323"
                            },
                            "scarves": {
                                "id": "136003"
                            },
                            "sunglasses": {
                                "id": "136322"
                            },
                            "purses & cardholders": {
                                "id": "136326"
                            }
                        }
                    }
                }
            }
        }
        self.categories_urls = {
            "men": {
                "clothing": {},
                "shoes": {},
                "bags": {},
                "accessories": {}
            },
            "women": {
                "clothing": {},
                "shoes": {},
                "bags": {},
                "accessories": {}
            }
        }
        self.categories_ids = {
            "men": {
                "id": "",
                "children": {

                }
            },
            "women": {
                "id": "",
                "children": {

                }
            }
        }
        self.gender_section_urls = {}
        self.CATEGORIES = ["clothing", "shoes", "bags", "accessories"]
        self.BATCH_SIZE = 96 * 2
        self.session = requests.Session()
        self.get_auth_token()
        self.current_section_id = None
        self.currently_scraping_section = None
        self.currently_scraping_subsection = None
        self.current_category_id = None
        self.currenlty_scraping_category = None
        self.current_cursor = None
        self.currently_scraping_products = []
        self.checkpoint_name = None

    def get_auth_token(self):
        try:
            response = self.session.get(self.BASE_URL, headers=self.HEADERS)
            response.raise_for_status()
        except Exception as e:
            logging.error(f"Error while fetching categories: {e}")
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

    def retrieve_category_children(self, category_id: str = ""):
        body = {
            "operationName": "NavigationBar",
            "variables": {"parentId": category_id},
            "query": "query NavigationBar($parentId: ID!) {\n  mainNavigation(parentId: $parentId) {\n    branches {\n      id\n      hasNextLevel\n      component {\n        elements {\n          __typename\n          ...NavigationElementFragment\n          ...NavigationGroupElementFragment\n          ...NavigationFavoriteBrandsElementFragment\n          ...NavigationBrandsAZElementFragment\n          ...NavigationSpotlightElementFragment\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment NavigationElementFragment on NavigationElement {\n  text\n  link {\n    path\n    rel\n    target\n    __typename\n  }\n  metadata {\n    referenceType\n    referenceId\n    trackingValue\n    __typename\n  }\n  displayOptions\n  __typename\n}\n\nfragment NavigationGroupElementFragment on NavigationGroupElement {\n  title\n  elements {\n    ...NavigationElementFragment\n    __typename\n  }\n  displayOptions\n  __typename\n}\n\nfragment NavigationFavoriteBrandsElementFragment on NavigationFavoriteBrandsElement {\n  title\n  elements {\n    ...NavigationElementFragment\n    __typename\n  }\n  displayOptions\n  __typename\n}\n\nfragment NavigationBrandsAZElementFragment on NavigationBrandsAZElement {\n  title\n  elements {\n    ...NavigationElementFragment\n    __typename\n  }\n  displayOptions\n  __typename\n}\n\nfragment NavigationSpotlightElementFragment on NavigationSpotlightElement {\n  title\n  body\n  element {\n    image {\n      alt\n      imageMd\n      __typename\n    }\n    link {\n      path\n      rel\n      target\n      __typename\n    }\n    text\n    displayOptions\n    __typename\n  }\n  __typename\n}\n"
        }
        response = self.session.post(
            self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=body)
        #response.raise_for_status()
        # if timeeout error repeat the request
        if response.status_code == 429:
            sleep(3)
            response = self.session.post(
                self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=body)
            #response.raise_for_status()
            if response.status_code == 429:
                sleep(6)
                response = self.session.post(
                    self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=body)
                response.raise_for_status()
        return response.json()

    def collect_categories_urls(self, table: bool = True):
        logging.info("Collecting categories URLs")
        gender_sections = ["men", "women"]
        gender_response = self.retrieve_category_children()
        for gender_section in gender_sections:
            gender_obj = [gender_item for gender_item in gender_response["data"]["mainNavigation"]["branches"]
                          if gender_item["component"]["elements"][0]["metadata"]["trackingValue"].lower() == gender_section][0]
            gender_id = gender_obj["id"]
            self.gender_section_urls[gender_section] = f"{self.BASE_URL}{gender_obj['component']['elements'][0]['link']['path']}"
            self.categories_ids[gender_section]["id"] = gender_id
            subsections_response = self.retrieve_category_children(gender_id)
            for subsection in self.CATEGORIES:
                subsection_id = [subsection_item["id"] for subsection_item in subsections_response["data"]["mainNavigation"]["branches"]
                                 if subsection_item["component"]["elements"][0]["metadata"]["trackingValue"].lower() == subsection][0]
                self.categories_ids[gender_section]["children"][subsection] = {
                    "id": subsection_id, "children": {}}
                categories_response = self.retrieve_category_children(
                    subsection_id)
                for category in categories_response["data"]["mainNavigation"]["branches"][0]["component"]["elements"][0]["elements"]:
                    # print(json.dumps(category, indent=2))
                    category_name = category["metadata"]["trackingValue"].lower(
                    )
                    if category_name == "gifts":
                        continue
                    category_url = f"{self.BASE_URL}{category['link']['path']}"
                    self.categories_urls[gender_section][subsection][category_name] = category_url
                    self.categories_ids[gender_section]["children"][subsection]["children"][category_name] = {
                        "id": category["metadata"]["trackingValue"]}
        logging.info("Categories URLs collected")
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
                   "url": self.gender_section_urls[section]}
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

    def retrieve_products(self, section_id: str, category_id: str, start_cursor: str = None, first: int = 96):
        product_catalog = {"operationName": "ProductCatalog",
                           "variables": {"input":
                                         {"contextFilter":
                                          {"categories": [section_id, category_id],
                                           "priceType": "FULL"},
                                             "filter": {},
                                             "negativeFilter": {},
                                             "sortFilter": {"option": "RANKING",
                                                            "order": "ASC"}},
                                         "first": first,
                                         "isDesktop": True,
                                         "isMobile": False,
                                         "facetTypes": ["SHIPPING_LOCATIONS", "CATEGORIES", "BRANDS", "SIZES", "ATTRIBUTES", "COLORS", "PRICE_RANGES", "DISCOUNT_RANGES", "PROMOTION_OFFERS", "DELIVERY_METHODS"],
                                         "includeRecommendedFacets": False,
                                         "includeEdges": True,
                                         "includeSortFacets": False,
                                         "includeFacets": False,
                                         "includeTotalCount": False,
                                         "includePageInfo": False},
                           "query": "query ProductCatalog($input: ProductCatalogSearchInput!, $first: Int, $after: String, $last: Int, $before: String, $facetTypes: [ProductCatalogFacetType!], $includeRecommendedFacets: Boolean!, $includeEdges: Boolean!, $includeSortFacets: Boolean!, $includeFacets: Boolean!, $includeTotalCount: Boolean!, $includePageInfo: Boolean!, $isDesktop: Boolean!, $isMobile: Boolean!) {\n  productCatalog(\n    input: $input\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n  ) {\n    ... on ProductCatalogConnection {\n      recommendedFacets(facetTypes: [CATEGORIES, BRANDS]) @include(if: $includeRecommendedFacets) {\n        ...ProductCatalogRecommendedFacetFragment\n        __typename\n      }\n      edges @include(if: $includeEdges) {\n        cursor\n        node {\n          ...ProductCatalogItemFragment\n          images {\n            order\n            size480 @include(if: $isDesktop) {\n              url\n              alt\n              __typename\n            }\n            size300 @include(if: $isMobile) {\n              url\n              alt\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      sortFacets @include(if: $includeSortFacets) {\n        option\n        order\n        description\n        __typename\n      }\n      facets(facetTypes: $facetTypes) @include(if: $includeFacets) {\n        ...ProductCatalogFacetFragment\n        __typename\n      }\n      totalCount @include(if: $includeTotalCount)\n      pageInfo @include(if: $includePageInfo) {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n        __typename\n      }\n      __typename\n    }\n    ... on InvalidPaginationError {\n      message\n      __typename\n    }\n    ... on UnsupportedInputFilterError {\n      message\n      filters\n      __typename\n    }\n    ... on InvalidRangeFilterError {\n      message\n      filter\n      __typename\n    }\n    ... on Error {\n      message\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ProductCatalogItemFragment on ProductCatalogItem {\n  id\n  resourceIdentifier {\n    path\n    __typename\n  }\n  brand {\n    id\n    name\n    __typename\n  }\n  shortDescription\n  label\n  merchantId\n  promotion {\n    label\n    __typename\n  }\n  stockQuantity\n  rankingAlgorithm\n  ...ProductCatalogItemPriceFragment\n  variationProperties {\n    ... on ProductCatalogItemScaledSizeVariationProperty {\n      __typename\n      order\n      totalItems\n      values {\n        id\n        order\n        description\n        __typename\n      }\n    }\n    ... on ProductCatalogItemColorVariationProperty {\n      __typename\n      order\n      totalItems\n      values {\n        id\n        swatchImage {\n          size54 {\n            url\n            alt\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n    }\n    ... on ProductCatalogItemSizeVariationProperty {\n      __typename\n      order\n      totalItems\n      values {\n        id\n        description\n        __typename\n      }\n    }\n    __typename\n  }\n  visualizationExperience {\n    isForMembers\n    __typename\n  }\n  tags {\n    id\n    __typename\n  }\n  externalTriggers {\n    type\n    uri\n    __typename\n  }\n  __typename\n}\n\nfragment ProductCatalogItemPriceFragment on ProductCatalogItem {\n  price {\n    __typename\n    value {\n      raw\n      formatted\n      __typename\n    }\n    currency {\n      isoCode\n      symbol\n      __typename\n    }\n    installments {\n      value {\n        formatted\n        __typename\n      }\n      __typename\n    }\n    ... on ProductCatalogItemFullPrice {\n      installments {\n        value {\n          formatted\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on ProductCatalogItemSalePrice {\n      fullPriceValue {\n        raw\n        formatted\n        __typename\n      }\n      discountPercentage {\n        raw\n        formatted\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n\nfragment ProductCatalogFacetFragment on ProductCatalogFacet {\n  __typename\n  ... on ProductCatalogStandardFacet {\n    facetType\n    description\n    values {\n      ...ProductCatalogFacetValuesFragment\n      __typename\n    }\n    __typename\n  }\n  ... on ProductCatalogDeliveryFacet {\n    facetType\n    deliveryMethod\n    description\n    values {\n      ...ProductCatalogFacetValuesFragment\n      __typename\n    }\n    __typename\n  }\n  ... on ProductCatalogDynamicFacet {\n    facetType\n    dynamicId\n    description\n    coupledFacet {\n      ... on ProductCatalogSizeScaleFacet {\n        currentScale\n        values {\n          id\n          code\n          description\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    values {\n      ...ProductCatalogFacetValuesFragment\n      __typename\n    }\n    dynamicDependencies {\n      facetValueId\n      facetDependencies {\n        facetType\n        ids\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ProductCatalogFacetValuesFragment on ProductCatalogFacetValueResult {\n  __typename\n  ...TreeFacetValueFragment\n  ...OptionFacetValueFragment\n  ...RangeFacetValueFragment\n  ...ColorFacetValueFragment\n}\n\nfragment OptionFacetValueFragment on ProductCatalogOptionFacetValue {\n  id\n  count\n  description\n  operator\n  parent {\n    id\n    description\n    depth\n    values {\n      ... on ProductCatalogTreeFacetValue {\n        id\n        description\n        __typename\n      }\n      ... on ProductCatalogOptionFacetValue {\n        id\n        description\n        __typename\n      }\n      __typename\n    }\n    parent {\n      id\n      description\n      depth\n      parent {\n        id\n        description\n        depth\n        parent {\n          id\n          description\n          depth\n          parent {\n            id\n            description\n            depth\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  resourceIdentifier {\n    path\n    __typename\n  }\n  __typename\n}\n\nfragment TreeFacetValueFragment on ProductCatalogTreeFacetValue {\n  ...BaseTreeFacetValueFieldsFragment\n  values {\n    ... on ProductCatalogTreeFacetValue {\n      ...BaseTreeFacetValueFieldsFragment\n      values {\n        ... on ProductCatalogTreeFacetValue {\n          ...BaseTreeFacetValueFieldsFragment\n          values {\n            ... on ProductCatalogTreeFacetValue {\n              ...BaseTreeFacetValueFieldsFragment\n              __typename\n            }\n            ...OptionFacetValueFragment\n            __typename\n          }\n          __typename\n        }\n        ...OptionFacetValueFragment\n        __typename\n      }\n      __typename\n    }\n    ...OptionFacetValueFragment\n    __typename\n  }\n  __typename\n}\n\nfragment BaseTreeFacetValueFieldsFragment on ProductCatalogTreeFacetValue {\n  id\n  description\n  count\n  depth\n  operator\n  resourceIdentifier {\n    path\n    __typename\n  }\n  parent {\n    id\n    description\n    depth\n    values {\n      ... on ProductCatalogTreeFacetValue {\n        id\n        description\n        __typename\n      }\n      ... on ProductCatalogOptionFacetValue {\n        id\n        description\n        __typename\n      }\n      __typename\n    }\n    parent {\n      id\n      description\n      depth\n      parent {\n        id\n        description\n        depth\n        parent {\n          id\n          description\n          depth\n          parent {\n            id\n            description\n            depth\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment RangeFacetValueFragment on ProductCatalogRangeFacetValue {\n  rangeDescription: description\n  min\n  max\n  count\n  __typename\n}\n\nfragment ColorFacetValueFragment on ProductCatalogColorFacetValue {\n  id\n  description\n  count\n  colorSwatchImage {\n    size54 {\n      url\n      alt\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ProductCatalogRecommendedFacetFragment on ProductCatalogStandardRecommendedFacet {\n  facetType\n  rankingAlgorithm\n  values {\n    ... on ProductCatalogRecommendedFacetValue {\n      id\n      rankingScore\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"}
        if start_cursor is not None:
            product_catalog["variables"]["after"] = start_cursor
        response = self.session.post(
            self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=product_catalog)
        #response.raise_for_status()
        # if timeeout error repeat the request
        if response.status_code == 429:
            sleep(3)
            response = self.session.post(
                self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=product_catalog)
            #response.raise_for_status()
            if response.status_code == 429:
                sleep(6)
                response = self.session.post(
                    self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=product_catalog)
                response.raise_for_status()
        return response.json()

    def retrieve_product_details(self, product_id: str):
        product_details_body = {
            "operationName": "getDetailsFashion",
            "query": "query getDetailsFashion($productId: ID!, $variationId: ID, $merchantId: ID, $sizeId: ID) {\n  user {\n    id\n    preference {\n      unitSystem\n      __typename\n    }\n    __typename\n  }\n  product(id: $productId) {\n    ... on Product {\n      id\n      brand {\n        id\n        name\n        resourceIdentifier {\n          path\n          __typename\n        }\n        __typename\n      }\n      categories {\n        id\n        children {\n          id\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  variation(\n    variationId: $variationId\n    productId: $productId\n    merchantId: $merchantId\n    sizeId: $sizeId\n  ) {\n    ... on Variation {\n      mainColor\n      quantity\n      images {\n        order\n        size1000 {\n          url\n          alt\n          __typename\n        }\n        modelVariationSize\n        modelMeasurement {\n          height {\n            type\n            name\n            imperial {\n              raw\n              formatted\n              __typename\n            }\n            metric {\n              raw\n              formatted\n              __typename\n            }\n            __typename\n          }\n          bodyMeasurements {\n            type\n            name\n            imperial {\n              raw\n              formatted\n              __typename\n            }\n            metric {\n              raw\n              formatted\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        imageTypes\n        __typename\n      }\n      care {\n        disclaimers\n        instructions {\n          type\n          procedures\n          __typename\n        }\n        __typename\n      }\n      composition {\n        disclaimers\n        parts {\n          name\n          materials {\n            name\n            percentage {\n              formatted\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      ...VariationFragment\n      __typename\n    }\n    ... on VariationUnavailable {\n      images {\n        order\n        size1000 {\n          url\n          alt\n          __typename\n        }\n        modelVariationSize\n        modelMeasurement {\n          height {\n            type\n            name\n            imperial {\n              raw\n              formatted\n              __typename\n            }\n            metric {\n              raw\n              formatted\n              __typename\n            }\n            __typename\n          }\n          bodyMeasurements {\n            type\n            name\n            imperial {\n              raw\n              formatted\n              __typename\n            }\n            metric {\n              raw\n              formatted\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      care {\n        disclaimers\n        instructions {\n          type\n          procedures\n          __typename\n        }\n        __typename\n      }\n      composition {\n        disclaimers\n        parts {\n          name\n          materials {\n            name\n            percentage {\n              formatted\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      ...VariationUnavailableFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment VariationFragment on Variation {\n  id\n  internalProductId\n  brandStyleId\n  madeIn {\n    origin\n    disclaimers\n    __typename\n  }\n  label\n  description {\n    __typename\n    short {\n      ... on TextDescription {\n        textContent\n        __typename\n      }\n      __typename\n    }\n    full {\n      ... on TextDescription {\n        textContent\n        __typename\n      }\n      ... on RichTextDescription {\n        richTextContent\n        __typename\n      }\n      __typename\n    }\n    highlight {\n      ... on RichTextDescription {\n        richTextContent\n        __typename\n      }\n      __typename\n    }\n  }\n  price {\n    ... on FullPrice {\n      paybackPointsQuantity\n      __typename\n    }\n    ... on SalePrice {\n      paybackPointsQuantity\n      __typename\n    }\n    __typename\n  }\n  shipping {\n    merchant {\n      id\n      name\n      __typename\n    }\n    country {\n      id\n      name\n      countryCode\n      __typename\n    }\n    city {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  deliveryMethods(types: [SAME_DAY, NINETY_MINUTES]) {\n    type\n    __typename\n  }\n  __typename\n}\n\nfragment VariationUnavailableFragment on VariationUnavailable {\n  product {\n    id\n    __typename\n  }\n  madeIn {\n    origin\n    disclaimers\n    __typename\n  }\n  label\n  description {\n    __typename\n    short {\n      ... on TextDescription {\n        textContent\n        __typename\n      }\n      __typename\n    }\n    full {\n      ... on TextDescription {\n        textContent\n        __typename\n      }\n      ... on RichTextDescription {\n        richTextContent\n        __typename\n      }\n      __typename\n    }\n    highlight {\n      ... on RichTextDescription {\n        richTextContent\n        __typename\n      }\n      __typename\n    }\n  }\n  __typename\n}\n",
            "variables": {
                "productId": product_id,
            }
        }
        response = self.session.post(
            self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=product_details_body)
        #response.raise_for_status()
        if response.status_code == 429:
            sleep(3)
            response = self.session.post(
                self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=product_details_body)
            #response.raise_for_status()
            if response.status_code == 429:
                sleep(6)
                response = self.session.post(
                    self.RETRIEVE_DATA_URL, headers=self.HEADERS, json=product_details_body)
                response.raise_for_status()
        product_data = response.json()
        product_details = {}
        product_details["color"] = product_data["data"]["variation"]["mainColor"].lower(
        )
        full_description = product_data["data"]["variation"]["description"]["short"]["textContent"]
        product_details["type"] = full_description.split(" ")[-1]
        media_objects = product_data["data"]["variation"]["images"]
        media_urls = [media_object["size1000"]["url"]
                      for media_object in media_objects]
        product_details["media"] = media_urls
        try:
            highlight_objects = product_data["data"]["variation"][
                "description"]["highlight"]["richTextContent"][0]["blocks"]
            details = []
            for highlight_object in highlight_objects:
                tmp_details = [item["value"]
                               for item in highlight_object["items"]]
                details.extend(tmp_details)
            product_details["details"] = details
        except:
            product_details["details"] = []
        try:
            composition_parts = product_data["data"]["variation"]["composition"]["parts"]
            composition = []
            for part in composition_parts:
                material = part["materials"][0]
                composition.append(
                    f"{material['name']} {material['percentage']['formatted']}")
            product_details["about"] = composition
        except:
            product_details["about"] = []
        return product_details

    def collect_category_products(self,
                                  category: str,
                                  subsection: str,
                                  section: str,
                                  start_cursor: str = None,):
        if subsection not in self.CATEGORIES or self.CATEGORIES_IDS[section]["children"][subsection]["children"].get(category, None) is None:
            raise Exception(
                f"Invalid category: {category} for section: {section} and subsection: {subsection}")
        logging.info(
            f"Collecting products for {section} - {subsection} - {category}")
        self.current_section_id = self.CATEGORIES_IDS[section]["id"]
        self.currently_scraping_section = section
        self.currently_scraping_subsection = subsection
        self.current_category_id = self.CATEGORIES_IDS[section][
            "children"][subsection]["children"][category]["id"]
        self.currenlty_scraping_category = category
        self.current_cursor = start_cursor
        still_fetching = True
        while still_fetching == True:
            try:
                products_data = self.retrieve_products(
                    self.current_section_id, self.current_category_id, self.current_cursor)
                products = products_data["data"]["productCatalog"]["edges"]
                if self.test_mode:
                    products = products[:10]
                for i in range(len(products)):
                    product = products[i]
                    try:
                        self.current_cursor = product["cursor"]
                        product_dict = {}
                        product_dict["id"] = product["node"]["id"]
                        product_dict["url"] = f"{self.BASE_URL}{product['node']['resourceIdentifier']['path']}"
                        product_dict["brand"] = product["node"]["brand"]["name"]
                        description = product["node"]["shortDescription"]
                        product_dict["description"] = f"{product_dict['brand']} {description}"
                        raw_price = product["node"]["price"]["value"]["raw"]
                        # add the two decimal points
                        product_dict["price"] = float(raw_price)
                        product_dict["currency"] = product["node"]["price"]["currency"]["isoCode"]
                        # get the product details
                        product_details = self.retrieve_product_details(
                            product_dict["id"])
                        # add it to the product dict
                        product_dict.update(product_details)
                        self.currently_scraping_products.append(product_dict)
                    except Exception as e:
                        raise Exception(
                            f"Error while processing product {i}: {e}")
                if len(products) < self.BATCH_SIZE:
                    still_fetching = False
                # else:
                #     self.current_cursor = products[-1]["cursor"]
                if self.test_mode:
                    break
            except Exception as e:
                logging.error(f"Error while fetching products: {e}")
                self.save_checkpoint()
                return None
        logging.info(
            f"Collected {len(self.currently_scraping_products)} products")
        return self.currently_scraping_products

    def save_checkpoint(self):
        # create folder if it does not exist
        if not os.path.exists(self.checkpoint_path):
            os.makedirs(self.checkpoint_path)
        checkpoint = {
            "section": self.currently_scraping_section,
            "subsection": self.currently_scraping_subsection,
            "category": self.currenlty_scraping_category,
            "cursor": self.current_cursor,
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
        self.current_cursor = checkpoint["cursor"]
        self.currently_scraping_products = checkpoint["products_list"]
        logging.info(
            f"Loaded checkpoint for {self.currently_scraping_section}_{self.currently_scraping_subsection}_{self.currenlty_scraping_category}")

    def restart_from_checkpoint(self, **kwargs):
        # it skips the failed products automatically
        return self.collect_category_products(self.currenlty_scraping_category, self.currently_scraping_subsection, self.currently_scraping_section, self.current_cursor)
