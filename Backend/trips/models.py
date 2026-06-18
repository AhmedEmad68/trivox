import random

from django.conf import settings
from django.db import models


class Location(models.Model):
    name         = models.CharField(max_length=100)
    slug         = models.SlugField(unique=True)
    country      = models.CharField(max_length=100, default="Egypt")
    country_code = models.CharField(max_length=3, default="EG")
    city         = models.CharField(max_length=100, blank=True)
    region       = models.CharField(max_length=100, blank=True)
    latitude     = models.FloatField(null=True, blank=True)
    longitude    = models.FloatField(null=True, blank=True)
    description      = models.TextField(blank=True)
    cover_image      = models.URLField(blank=True)
    cover_image_file = models.ImageField(upload_to="locations/", blank=True)
    hero_image       = models.URLField(blank=True)
    hero_image_file  = models.ImageField(upload_to="locations/", blank=True)
    subtitle         = models.CharField(max_length=200, blank=True)
    long_description = models.TextField(blank=True)
    highlights       = models.JSONField(default=list)   # [{icon, label, desc}]
    climate          = models.CharField(max_length=200, blank=True)
    best_time        = models.CharField(max_length=100, blank=True)
    language         = models.CharField(max_length=200, blank=True)
    currency         = models.CharField(max_length=100, blank=True)
    timezone         = models.CharField(max_length=100, blank=True)
    is_active        = models.BooleanField(default=True)
    order            = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    @property
    def trip_count(self):
        return self.trips.filter(is_active=True).count()


class Category(models.Model):
    name        = models.CharField(max_length=100)
    slug        = models.SlugField(unique=True)
    icon        = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Trip(models.Model):
    PRODUCT_TYPES = [
        ("tour",       "Tour"),
        ("transfer",   "Transfer"),
        ("experience", "Experience"),
        ("addon",      "Addon"),
    ]
    PRICE_UNITS = [
        ("per_person",  "Per Person"),
        ("per_group",   "Per Group"),
        ("per_vehicle", "Per Vehicle"),
        ("fixed",       "Fixed"),
    ]
    CANCELLATION_POLICIES = [
        ("free_cancellation", "Free Cancellation"),
        ("partial_refund",    "Partial Refund"),
        ("non_refundable",    "Non-Refundable"),
    ]

    slug        = models.SlugField(max_length=200, unique=True)
    type        = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    title       = models.CharField(max_length=255)
    tagline     = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    cover_image = models.URLField(blank=True)
    cover_image_file = models.ImageField(upload_to="trips/", blank=True)

    location   = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="trips")
    categories = models.ManyToManyField(Category, blank=True)

    price          = models.DecimalField(max_digits=10, decimal_places=2)
    price_currency = models.CharField(max_length=3, default="USD")
    price_unit     = models.CharField(max_length=20, choices=PRICE_UNITS, default="per_person")
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    rating       = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.PositiveIntegerField(default=0)

    duration_hours = models.FloatField(null=True, blank=True)
    duration_days  = models.PositiveIntegerField(null=True, blank=True)
    duration_label = models.CharField(max_length=50)

    languages      = models.JSONField(default=list)
    max_group_size = models.PositiveIntegerField(null=True, blank=True)
    min_age        = models.PositiveIntegerField(null=True, blank=True)

    cancellation_policy = models.CharField(max_length=30, choices=CANCELLATION_POLICIES, default="free_cancellation")
    cancellation_hours  = models.PositiveIntegerField(null=True, blank=True)

    instant_confirmation = models.BooleanField(default=True)
    pickup_included      = models.BooleanField(default=False)
    is_featured          = models.BooleanField(default=False, db_index=True)
    is_active            = models.BooleanField(default=True,  db_index=True)

    highlights = models.JSONField(default=list)
    includes   = models.JSONField(default=list)
    excludes   = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]

    def __str__(self):
        return self.title


class MediaItem(models.Model):
    TYPES = [("image", "Image"), ("video", "Video")]

    trip     = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="gallery")
    url      = models.URLField()
    alt_text = models.CharField(max_length=255)
    caption  = models.CharField(max_length=255, blank=True)
    type     = models.CharField(max_length=10, choices=TYPES, default="image")
    is_cover = models.BooleanField(default=False)
    order    = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.trip.title} — media {self.order}"


class Addon(models.Model):
    PRICE_UNITS = [
        ("per_person", "Per Person"),
        ("per_group",  "Per Group"),
        ("fixed",      "Fixed"),
    ]
    CATEGORIES = [
        ("transport",  "Transport"),
        ("food",       "Food"),
        ("equipment",  "Equipment"),
        ("guide",      "Guide"),
        ("insurance",  "Insurance"),
        ("photo",      "Photo/Video"),
        ("other",      "Other"),
    ]

    trip           = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="addons")
    slug           = models.SlugField()
    name           = models.CharField(max_length=255)
    description    = models.TextField()
    image          = models.URLField(blank=True)
    price          = models.DecimalField(max_digits=10, decimal_places=2)
    price_currency = models.CharField(max_length=3, default="USD")
    price_unit     = models.CharField(max_length=20, choices=PRICE_UNITS, default="per_person")
    is_required    = models.BooleanField(default=False)
    max_quantity   = models.PositiveIntegerField(null=True, blank=True)
    category       = models.CharField(max_length=20, choices=CATEGORIES, blank=True)

    def __str__(self):
        return f"{self.trip.title} — {self.name}"


class Review(models.Model):
    trip           = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="reviews")
    author_name    = models.CharField(max_length=100)
    author_avatar  = models.URLField(blank=True)
    author_country = models.CharField(max_length=100, blank=True)
    rating         = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    title          = models.CharField(max_length=255, blank=True)
    body           = models.TextField()
    date           = models.DateField()
    verified       = models.BooleanField(default=False)
    helpful_count  = models.PositiveIntegerField(default=0)
    images         = models.JSONField(default=list)

    response_body   = models.TextField(blank=True)
    response_date   = models.DateField(null=True, blank=True)
    response_author = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.author_name} on {self.trip.title}"


class Testimonial(models.Model):
    name      = models.CharField(max_length=100)
    country   = models.CharField(max_length=100)
    avatar    = models.URLField(blank=True)
    rating    = models.PositiveSmallIntegerField(default=5)
    trip_name = models.CharField(max_length=255)
    date      = models.CharField(max_length=50)
    body      = models.TextField()
    is_active = models.BooleanField(default=True)
    order     = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.name} — {self.trip_name}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending",     "Pending"),
        ("confirmed",   "Confirmed"),
        ("in_progress", "In Progress"),
        ("completed",   "Completed"),
        ("cancelled",   "Cancelled"),
        ("refunded",    "Refunded"),
    ]

    reference        = models.CharField(max_length=30, unique=True, db_index=True)
    status           = models.CharField(max_length=20, choices=STATUS_CHOICES, default="confirmed")
    user             = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name="bookings"
    )
    trip             = models.ForeignKey(Trip, on_delete=models.PROTECT, related_name="bookings")
    date             = models.DateField()
    time             = models.TimeField(null=True, blank=True)

    first_name       = models.CharField(max_length=100)
    last_name        = models.CharField(max_length=100)
    email            = models.EmailField()
    phone            = models.CharField(max_length=32)
    nationality      = models.CharField(max_length=64, blank=True)
    special_requests = models.TextField(blank=True)

    # [{type, count, price}]
    participants_data = models.JSONField(default=list)

    trip_subtotal    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    addons_subtotal  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taxes            = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total            = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency         = models.CharField(max_length=3, default="USD")

    pickup_location  = models.CharField(max_length=255, blank=True)
    dropoff_location = models.CharField(max_length=255, blank=True)
    flight_number    = models.CharField(max_length=50, blank=True)
    hotel_name       = models.CharField(max_length=255, blank=True)

    confirmation_sent = models.BooleanField(default=False)
    voucher_url       = models.URLField(blank=True)
    notes             = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.reference} — {self.trip.title}"

    @staticmethod
    def generate_reference():
        from datetime import date as date_mod
        year = date_mod.today().year
        for _ in range(10):
            ref = f"RH-{year}-{random.randint(100000, 999999)}"
            if not Booking.objects.filter(reference=ref).exists():
                return ref
        raise RuntimeError("Could not generate unique booking reference")


class BookingAddon(models.Model):
    booking  = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="booking_addons")
    addon    = models.ForeignKey(Addon, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.booking.reference} — {self.addon.name}"
