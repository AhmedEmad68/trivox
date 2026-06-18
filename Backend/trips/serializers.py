from django.conf import settings
from rest_framework import serializers
from .models import Location, Category, MediaItem, Addon, Review, Testimonial, Trip, Booking, BookingAddon


def _resolve_image(file_field, url_field, request):
    """Prefer an uploaded ImageField file; fall back to the URLField value."""
    if file_field:
        url = file_field.url
        # A fixed public base (set in Docker) keeps media URLs browser-reachable
        # no matter which host called the API; otherwise mirror the request host.
        if settings.MEDIA_PUBLIC_BASE:
            return settings.MEDIA_PUBLIC_BASE.rstrip("/") + url
        return request.build_absolute_uri(url) if request else url
    return url_field or ""


class LocationSerializer(serializers.ModelSerializer):
    """Lean serializer — used when embedded inside trip cards."""
    trip_count  = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model  = Location
        fields = [
            "id", "name", "slug", "country", "country_code",
            "city", "region", "latitude", "longitude",
            "description", "cover_image", "trip_count",
        ]

    def get_trip_count(self, obj):
        return obj.trip_count

    def get_cover_image(self, obj):
        return _resolve_image(obj.cover_image_file, obj.cover_image, self.context.get("request"))


class LocationDetailSerializer(serializers.ModelSerializer):
    """Full serializer — used for the /destinations/ listing and detail pages."""
    trip_count  = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    hero_image  = serializers.SerializerMethodField()

    class Meta:
        model  = Location
        fields = [
            "id", "name", "slug", "country", "country_code",
            "latitude", "longitude",
            "cover_image", "hero_image",
            "subtitle", "description", "long_description",
            "highlights", "climate", "best_time",
            "language", "currency", "timezone",
            "trip_count",
        ]

    def get_trip_count(self, obj):
        return obj.trip_count

    def get_cover_image(self, obj):
        return _resolve_image(obj.cover_image_file, obj.cover_image, self.context.get("request"))

    def get_hero_image(self, obj):
        return _resolve_image(obj.hero_image_file, obj.hero_image, self.context.get("request"))


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ["id", "name", "slug", "icon", "description"]


class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MediaItem
        fields = ["id", "url", "alt_text", "caption", "type", "is_cover", "order"]


class AddonSerializer(serializers.ModelSerializer):
    price = serializers.FloatField()

    class Meta:
        model  = Addon
        fields = [
            "id", "slug", "name", "description", "image",
            "price", "price_currency", "price_unit",
            "is_required", "max_quantity", "category",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    response = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = [
            "id", "author_name", "author_avatar", "author_country",
            "rating", "title", "body", "date", "verified",
            "helpful_count", "images", "response",
        ]

    def get_response(self, obj):
        if not obj.response_body:
            return None
        return {
            "body":   obj.response_body,
            "date":   str(obj.response_date) if obj.response_date else None,
            "author": obj.response_author,
        }


class TripBaseSerializer(serializers.ModelSerializer):
    location   = LocationSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    gallery    = MediaItemSerializer(many=True, read_only=True)
    rating     = serializers.FloatField()   # DecimalField → float so JS .toFixed() works
    price      = serializers.FloatField()
    original_price = serializers.FloatField(allow_null=True)
    cover_image    = serializers.SerializerMethodField()

    def get_cover_image(self, obj):
        return _resolve_image(obj.cover_image_file, obj.cover_image, self.context.get("request"))

    class Meta:
        model  = Trip
        fields = [
            "id", "slug", "type", "title", "tagline", "description", "cover_image",
            "gallery", "location", "categories",
            "price", "price_currency", "price_unit", "original_price",
            "rating", "review_count",
            "duration_hours", "duration_days", "duration_label",
            "languages", "max_group_size", "min_age",
            "cancellation_policy", "cancellation_hours",
            "instant_confirmation", "pickup_included",
            "is_featured", "is_active",
            "highlights", "includes", "excludes",
            "created_at", "updated_at",
        ]


class TripDetailSerializer(TripBaseSerializer):
    addons = AddonSerializer(many=True, read_only=True)

    class Meta(TripBaseSerializer.Meta):
        fields = TripBaseSerializer.Meta.fields + ["addons"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Testimonial
        fields = ["id", "name", "country", "avatar", "rating", "trip_name", "date", "body"]


# ─── Booking serializers ──────────────────────────────────────────────

class BookingAddonOutputSerializer(serializers.ModelSerializer):
    addon    = AddonSerializer()
    subtotal = serializers.FloatField()

    class Meta:
        model  = BookingAddon
        fields = ["addon", "quantity", "subtotal"]


class BookingSerializer(serializers.ModelSerializer):
    trip         = TripBaseSerializer()
    participants = serializers.JSONField(source="participants_data")
    addons       = BookingAddonOutputSerializer(source="booking_addons", many=True)
    summary      = serializers.SerializerMethodField()

    trip_subtotal   = serializers.FloatField()
    addons_subtotal = serializers.FloatField()
    taxes           = serializers.FloatField()
    total           = serializers.FloatField()

    class Meta:
        model  = Booking
        fields = [
            "id", "reference", "status", "trip", "date", "time",
            "participants", "addons", "summary",
            "created_at", "updated_at", "confirmation_sent", "voucher_url", "notes",
            "first_name", "last_name", "email", "phone",
            # included in summary but also kept for field access
            "trip_subtotal", "addons_subtotal", "taxes", "total",
        ]

    def get_summary(self, obj):
        return {
            "trip_subtotal":   float(obj.trip_subtotal),
            "addons_subtotal": float(obj.addons_subtotal),
            "taxes":           float(obj.taxes),
            "total":           float(obj.total),
            "currency":        obj.currency,
        }


class BookingParticipantInputSerializer(serializers.Serializer):
    type  = serializers.ChoiceField(choices=["adult", "child", "infant"])
    count = serializers.IntegerField(min_value=0)
    price = serializers.FloatField(required=False, default=0)


class BookingAddonInputSerializer(serializers.Serializer):
    addon_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class BookingCreateSerializer(serializers.Serializer):
    trip_id          = serializers.IntegerField()
    date             = serializers.DateField()
    time             = serializers.TimeField(required=False, allow_null=True)
    participants     = BookingParticipantInputSerializer(many=True)
    addons           = BookingAddonInputSerializer(many=True, required=False, default=list)
    special_requests = serializers.CharField(required=False, default="", allow_blank=True)
    first_name       = serializers.CharField(max_length=100)
    last_name        = serializers.CharField(max_length=100)
    email            = serializers.EmailField()
    phone            = serializers.CharField(max_length=32)
    nationality      = serializers.CharField(max_length=64, required=False, default="", allow_blank=True)
    pickup_location  = serializers.CharField(required=False, default="", allow_blank=True)
    dropoff_location = serializers.CharField(required=False, default="", allow_blank=True)
    flight_number    = serializers.CharField(required=False, default="", allow_blank=True)
    hotel_name       = serializers.CharField(required=False, default="", allow_blank=True)
