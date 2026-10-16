from django.core.management.base import BaseCommand
from vector_db.service import VectorService
from products.models import Product

class Command(BaseCommand):
    help = "Diagnose vector db sync"

    def handle(self, *args, **options):
        vector_service = VectorService("products", "product_embeddings")
        # retrieve all products marked as embedded
        embedded_product_ids = Product.objects.filter(is_embedded=True).values_list('id', flat=True)
        number_embedded_products = len(embedded_product_ids)
        # retrieve all products in the vector db
        vector_ids = vector_service.get_all_vectorids()
        number_vector_products = len(vector_ids)

        # find the difference
        missing_ids = set(embedded_product_ids) - set(vector_ids)
        extra_ids = set(vector_ids) - set(embedded_product_ids)
        
        summary = {
            "number_embedded_products": number_embedded_products,
            "number_vector_products": number_vector_products,
            "missing_ids": list(missing_ids),
            "extra_ids": list(extra_ids),
        }
        
        summary_str = "\n".join([f"{k}: {v}" for k, v in summary.items()])
        self.stdout.write(self.style.SUCCESS(summary_str))
        # now we can take action based on the summary
        if len(missing_ids) > 0:
            # set the missing products to be embedded
            missing_products_number = Product.objects.filter(id__in=missing_ids).update(is_embedded=False)
            self.stdout.write(self.style.SUCCESS(f"Fixed {missing_products_number} missing products"))
            if missing_products_number < len(missing_ids):
                self.stdout.write(self.style.WARNING(f"Failed to fix {len(missing_ids) - missing_products_number} missing products"))
        if len(extra_ids) > 0:
            # delete the extra products from the vector db
            extra_vectors = vector_service.delete(ids=list(extra_ids))
            self.stdout.write(self.style.SUCCESS(f"Deleted {len(extra_vectors)} extra products"))
            if len(extra_vectors) < len(extra_ids):
                self.stdout.write(self.style.WARNING(f"Failed to delete {len(extra_ids) - len(extra_vectors)} extra products"))
        return
        