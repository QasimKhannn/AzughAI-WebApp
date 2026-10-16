from django.db import models
from django.conf import settings
from common.models import BaseModel
from products.models import Product
from django.core.files.storage import default_storage
import logging

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class ClosetItem(BaseModel):
    """
    Model representing an item in a user's closet.
    Can be linked to a Product or be a custom item.
    """
    class Season(models.TextChoices):
        SPRING = 'spring', 'Spring'
        SUMMER = 'summer', 'Summer'
        FALL = 'fall', 'Fall'
        WINTER = 'winter', 'Winter'
        ALL_SEASON = 'all-season', 'All Season'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='closet_items',
        help_text='User who owns this closet item'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='closet_items',
        help_text='Product this item is linked to (if any)'
    )
    custom_name = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text='Custom name for the item if not linked to a product'
    )
    custom_description = models.TextField(
        null=True,
        blank=True,
        help_text='Custom description for the item'
    )
    brand = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text='Brand name (if custom item or overriding product brand)'
    )
    color = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text='Color of the item'
    )
    size = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        help_text='Size of the item'
    )
    season = models.CharField(
        max_length=20,
        choices=Season.choices,
        null=True,
        blank=True,
        help_text='Season(s) this item is suitable for'
    )

    class Meta:
        verbose_name = "Closet Item"
        verbose_name_plural = "Closet Items"
        ordering = ['-created_at']

    def __str__(self):
        if self.product:
            return f"{self.user.email} - {self.product.brand.name} {self.product.description}"
        elif self.custom_name:
            return f"{self.user.email} - {self.custom_name}"
        else:
            return f"{self.user.email} - Closet Item {self.id}"


class ClosetItemImage(BaseModel):
    """
    Model representing images for closet items.
    """
    closet_item = models.ForeignKey(
        ClosetItem,
        on_delete=models.CASCADE,
        related_name='images',
        help_text='Closet item this image belongs to'
    )
    image = models.ImageField(
        upload_to='closet/images/',
        help_text='Image file for the closet item'
    )
    is_primary = models.BooleanField(
        default=False,
        help_text='Whether this is the primary image for the closet item'
    )

    class Meta:
        verbose_name = "Closet Item Image"
        verbose_name_plural = "Closet Item Images"
        ordering = ['-created_at']

    def __str__(self):
        return f"Image for {self.closet_item}"

    def delete_image(self):
        """Delete the image file from storage."""
        if self.image:
            if default_storage.exists(self.image.path):
                default_storage.delete(self.image.path)
                logging.info(f"Image {self.image.path} deleted")
            else:
                logging.info(f"Image {self.image.path} not found")

    def delete(self, *args, **kwargs):
        """Override delete to remove image file and handle primary image reassignment."""
        # Delete image from file system
        self.delete_image()
        
        # Update primary image if necessary
        if self.is_primary:
            first_image = ClosetItemImage.objects.filter(
                closet_item=self.closet_item,
                is_primary=False
            ).exclude(pk=self.pk).first()
            if first_image:
                first_image.is_primary = True
                first_image.save()
            else:
                logging.info("No primary image found to replace the deleted one")
        
        return super(ClosetItemImage, self).delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """Override save to handle primary image logic."""
        if self.pk:
            old_instance = ClosetItemImage.objects.get(pk=self.pk)
            
            # Handle image file changes
            if self.image:
                if old_instance and old_instance.image:
                    old_image_name = old_instance.image.name.split("/")[-1]
                    new_image_name = self.image.name.split("/")[-1]
                    if old_image_name != new_image_name:
                        # Delete the old image
                        old_instance.delete_image()
                        logging.info(f"Image {old_instance.image} updated with {self.image}")
                    else:
                        self.image = old_instance.image
                        logging.info("Image is the same as the original")
                else:
                    logging.info("No old image found")
            
            # Handle primary image changes
            if self.is_primary == True and old_instance and old_instance.is_primary != self.is_primary:
                ClosetItemImage.objects.filter(
                    closet_item=self.closet_item,
                    is_primary=True
                ).exclude(pk=self.pk).update(is_primary=False)
            elif self.is_primary == False and old_instance and old_instance.is_primary != self.is_primary:
                # Set the first image as primary if unsetting primary
                first_image = ClosetItemImage.objects.filter(
                    closet_item=self.closet_item
                ).exclude(pk=self.pk).first()
                if first_image is not None:
                    first_image.is_primary = True
                    first_image.save()
                    logging.info(f"Primary image set to {first_image.image}")
                else:
                    logging.info("Must have at least one primary image")
                    self.is_primary = True
        else:
            # New image - ensure at least one primary if this is the first image
            existing_images = ClosetItemImage.objects.filter(closet_item=self.closet_item)
            if not existing_images.exists() and not self.is_primary:
                self.is_primary = True
                logging.info("Setting first image as primary")
            elif self.is_primary:
                # Unset other primary images
                ClosetItemImage.objects.filter(
                    closet_item=self.closet_item,
                    is_primary=True
                ).update(is_primary=False)
        
        return super(ClosetItemImage, self).save(*args, **kwargs)
