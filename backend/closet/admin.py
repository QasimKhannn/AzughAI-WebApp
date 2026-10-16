from django.contrib import admin
from .models import ClosetItem, ClosetItemImage


@admin.register(ClosetItem)
class ClosetItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'custom_name', 'brand', 'color', 'size', 'season', 'created_at')
    list_filter = ('season', 'created_at', 'updated_at')
    search_fields = ('user__email', 'custom_name', 'brand', 'color', 'product__description')
    readonly_fields = ('id', 'created_at', 'updated_at')
    autocomplete_fields = ('user', 'product')
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Product Link', {
            'fields': ('product',),
            'description': 'Link to a product from the catalog (optional)'
        }),
        ('Item Details', {
            'fields': ('custom_name', 'custom_description', 'brand', 'color', 'size', 'season')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ClosetItemImage)
class ClosetItemImageAdmin(admin.ModelAdmin):
    list_display = ('closet_item', 'image', 'is_primary', 'created_at')
    list_filter = ('is_primary', 'created_at')
    search_fields = ('closet_item__custom_name', 'closet_item__user__email')
    readonly_fields = ('id', 'created_at', 'updated_at')
    autocomplete_fields = ('closet_item',)
