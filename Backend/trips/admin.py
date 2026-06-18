from django.contrib import admin
from .models import Location, Category, Trip, MediaItem, Addon, Review, Testimonial, Booking, BookingAddon


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display        = ["name", "slug", "country", "trip_count", "is_active", "order"]
    list_editable       = ["is_active", "order"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields       = ["name", "country"]
    fieldsets = [
        (None, {"fields": ["name", "slug", "country", "country_code", "is_active", "order"]}),
        ("Images", {
            "fields": ["cover_image_file", "cover_image", "hero_image_file", "hero_image"],
            "description": "Upload a local file OR paste an external URL. If both are set, the uploaded file wins.",
        }),
        ("Content",      {"fields": ["subtitle", "description", "long_description"]}),
        ("Highlights",   {"fields": ["highlights"]}),
        ("Travel Info",  {"fields": ["climate", "best_time", "language", "currency", "timezone"]}),
        ("Coordinates",  {"fields": ["latitude", "longitude", "city", "region"], "classes": ["collapse"]}),
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


class MediaItemInline(admin.TabularInline):
    model = MediaItem
    extra = 1


class AddonInline(admin.TabularInline):
    model = Addon
    extra = 0


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display   = ["title", "type", "location", "price", "rating", "review_count", "is_featured", "is_active"]
    list_filter    = ["type", "location", "is_featured", "is_active", "cancellation_policy"]
    list_editable  = ["is_featured", "is_active"]
    search_fields  = ["title", "description", "slug"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal   = ["categories"]
    inlines             = [MediaItemInline, AddonInline]
    readonly_fields     = ["created_at", "updated_at"]
    fieldsets = [
        (None, {"fields": ["title", "slug", "type", "location", "categories", "tagline", "description"]}),
        ("Cover image", {
            "fields": ["cover_image_file", "cover_image"],
            "description": "Upload a local file OR paste an external URL. If both are set, the uploaded file wins.",
        }),
        ("Pricing",       {"fields": ["price", "price_currency", "price_unit", "original_price"]}),
        ("Rating",        {"fields": ["rating", "review_count"]}),
        ("Duration",      {"fields": ["duration_hours", "duration_days", "duration_label"]}),
        ("Group & languages", {"fields": ["languages", "max_group_size", "min_age"]}),
        ("Policies",      {"fields": ["cancellation_policy", "cancellation_hours", "instant_confirmation", "pickup_included"]}),
        ("Visibility",    {"fields": ["is_featured", "is_active"]}),
        ("Content lists", {"fields": ["highlights", "includes", "excludes"]}),
        ("Timestamps",    {"fields": ["created_at", "updated_at"], "classes": ["collapse"]}),
    ]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display  = ["author_name", "trip", "rating", "date", "verified"]
    list_filter   = ["rating", "verified", "trip"]
    search_fields = ["author_name", "body"]


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ["name", "country", "trip_name", "rating", "is_active", "order"]
    list_editable = ["is_active", "order"]


class BookingAddonInline(admin.TabularInline):
    model = BookingAddon
    extra = 0
    readonly_fields = ["addon", "quantity", "subtotal"]


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display   = ["reference", "trip", "first_name", "last_name", "email", "date", "status", "total", "created_at"]
    list_filter    = ["status", "date", "trip__location"]
    search_fields  = ["reference", "email", "first_name", "last_name"]
    readonly_fields = ["reference", "created_at", "updated_at"]
    inlines        = [BookingAddonInline]
    fieldsets = [
        (None,          {"fields": ["reference", "status", "user", "trip"]}),
        ("Date & Time", {"fields": ["date", "time"]}),
        ("Contact",     {"fields": ["first_name", "last_name", "email", "phone", "nationality", "special_requests"]}),
        ("Pricing",     {"fields": ["trip_subtotal", "addons_subtotal", "taxes", "total", "currency"]}),
        ("Transfer",    {"fields": ["pickup_location", "dropoff_location", "flight_number", "hotel_name"], "classes": ["collapse"]}),
        ("Meta",        {"fields": ["participants_data", "confirmation_sent", "voucher_url", "notes", "created_at", "updated_at"]}),
    ]
