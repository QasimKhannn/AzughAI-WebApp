import pytest
from unittest.mock import patch
from .fixtures import setup_shops, setup_categories

from products.tasks import scrape_shop_categories, scrape_products
from products.models import Shop, Category


@pytest.mark.django_db
@pytest.mark.usefixtures("setup_shops")
@pytest.mark.parametrize("shop_name", ["asos", "revolve", "urban outfitters", "farfetch"])
def test_categories_scraping_job_successful(shop_name):
    with patch('products.tasks.CategoriesScrapingJob') as MockJob:
        mock_job_instance = MockJob.objects.create.return_value
        scrape_shop_categories.apply(args=[shop_name])
        # Check that the job was created
        MockJob.objects.create.assert_called_once_with(
            shop=Shop.objects.get(name=shop_name))
        # Check that the job was marked as completed
        mock_job_instance.mark_completed.assert_called_once()

# python -m pytest products/tests/test_tasks.py -v
# python -m pytest products/tests/test_tasks.py -v --cov=products --cov-report=term-missing --cov-report=html
# python -m pytest products/tests/test_tasks.py::test_categories_scraping_job_successful\[farfetch\]


@pytest.mark.django_db
@pytest.mark.usefixtures("setup_shops", "setup_categories")
@pytest.mark.parametrize("shop_name, category_name, parent_path", [
    ("asos", "jeans", ("men", "clothing")),
    ("revolve", "denim", ("men", "clothing")),
    ("urban outfitters", "jeans", ("men",)),
    ("farfetch", "denim", ("men", "clothing")),
])
def test_products_scraping_job_successful(shop_name, category_name, parent_path):
    with patch('products.tasks.ProductsScrapingJob') as MockJob:
        mock_job_instance = MockJob.objects.create.return_value
        scrape_products.apply(args=[shop_name, category_name, parent_path])
        # Check that the job was created
        MockJob.objects.create.assert_called_once_with(shop=Shop.objects.get(
            name=shop_name), category=Category.objects.get(name=category_name, shop=Shop.objects.get(name=shop_name)))
        # Check that the job was marked as completed
        mock_job_instance.mark_completed.assert_called_once()

# @pytest.mark.django_db
# @pytest.mark.usefixtures("setup_shops", "setup_categories")
# @pytest.mark.parametrize("shop_name, category_name, parent_path", [
#     ("asos", "jeans", ("men", "clothing")),
#     ("revolve", "denim", ("men", "clothing")),
#     ("urban outfitters", "jeans", ("men",)),
#     ("farfetch", "denim", ("men", "clothing")),
# ])
