from decimal import Decimal

from django.db.models import Q
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Addon, Booking, BookingAddon, Location, Trip, Testimonial, Review
from .serializers import (
    LocationSerializer,
    LocationDetailSerializer,
    TripBaseSerializer,
    TripDetailSerializer,
    ReviewSerializer,
    AddonSerializer,
    TestimonialSerializer,
    BookingSerializer,
    BookingCreateSerializer,
)


# ─── Pagination ───────────────────────────────────────────────────────
class TrivoxPagination(PageNumberPagination):
    page_size              = 12
    page_size_query_param  = "page_size"
    max_page_size          = 100

    def get_paginated_response(self, data):
        return Response({
            "results":      data,
            "count":        self.page.paginator.count,
            "next":         self.get_next_link(),
            "previous":     self.get_previous_link(),
            "total_pages":  self.page.paginator.num_pages,
            "current_page": self.page.number,
        })


# ─── Locations ────────────────────────────────────────────────────────
class LocationListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = LocationDetailSerializer

    def get_queryset(self):
        return Location.objects.filter(is_active=True)


class PopularLocationsView(generics.ListAPIView):
    """Lean list for home-page widgets — keeps the lighter LocationSerializer."""
    permission_classes = [AllowAny]
    serializer_class   = LocationSerializer

    def get_queryset(self):
        limit = int(self.request.query_params.get("limit", 8))
        return Location.objects.filter(is_active=True).order_by("order", "name")[:limit]


class LocationDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class   = LocationDetailSerializer
    lookup_field       = "slug"
    queryset           = Location.objects.filter(is_active=True)


# ─── Trips ────────────────────────────────────────────────────────────
class TripListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = TripBaseSerializer
    pagination_class   = TrivoxPagination

    def get_queryset(self):
        qs = (
            Trip.objects.filter(is_active=True)
            .select_related("location")
            .prefetch_related("categories", "gallery")
        )

        type_ = self.request.query_params.get("type")
        if type_:
            qs = qs.filter(type=type_)

        location = self.request.query_params.get("location")
        if location:
            qs = qs.filter(location__slug=location)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(location__name__icontains=search)
            )

        if self.request.query_params.get("featured") == "true":
            qs = qs.filter(is_featured=True)

        price_min = self.request.query_params.get("price_min")
        if price_min:
            qs = qs.filter(price__gte=price_min)

        price_max = self.request.query_params.get("price_max")
        if price_max:
            qs = qs.filter(price__lte=price_max)

        rating_min = self.request.query_params.get("rating_min")
        if rating_min:
            qs = qs.filter(rating__gte=rating_min)

        duration_max = self.request.query_params.get("duration_max")
        if duration_max:
            qs = qs.filter(duration_hours__lte=duration_max)

        if self.request.query_params.get("free_cancellation") == "true":
            qs = qs.filter(cancellation_policy="free_cancellation")

        if self.request.query_params.get("instant_confirmation") == "true":
            qs = qs.filter(instant_confirmation=True)

        ordering_map = {
            "price_asc":  "price",
            "price_desc": "-price",
            "rating":     "-rating",
            "newest":     "-created_at",
            "popularity": "-review_count",
        }
        ordering = self.request.query_params.get("ordering", "")
        if ordering in ordering_map:
            qs = qs.order_by(ordering_map[ordering])

        return qs


class FeaturedTripsView(generics.ListAPIView):
    """Returns a plain list (no pagination) for the home page hero strip."""
    permission_classes = [AllowAny]
    serializer_class   = TripBaseSerializer

    def get_queryset(self):
        limit = int(self.request.query_params.get("limit", 6))
        return (
            Trip.objects.filter(is_active=True, is_featured=True)
            .select_related("location")
            .prefetch_related("categories", "gallery")[:limit]
        )


class TripDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class   = TripDetailSerializer
    lookup_field       = "slug"

    def get_queryset(self):
        return (
            Trip.objects.filter(is_active=True)
            .select_related("location")
            .prefetch_related("categories", "gallery", "addons")
        )


class RelatedTripsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = TripBaseSerializer

    def get_queryset(self):
        slug  = self.kwargs["slug"]
        limit = int(self.request.query_params.get("limit", 4))
        try:
            trip = Trip.objects.get(slug=slug, is_active=True)
        except Trip.DoesNotExist:
            return Trip.objects.none()
        return (
            Trip.objects.filter(is_active=True, type=trip.type, location=trip.location)
            .exclude(slug=slug)
            .select_related("location")
            .prefetch_related("categories", "gallery")[:limit]
        )


class TripReviewsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = ReviewSerializer
    pagination_class   = TrivoxPagination

    def get_queryset(self):
        return Review.objects.filter(trip__slug=self.kwargs["slug"], trip__is_active=True)


class TripAddonsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = AddonSerializer

    def get_queryset(self):
        return Trip.objects.get(slug=self.kwargs["slug"], is_active=True).addons.all()


class SearchSuggestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.query_params.get("q", "").strip()
        if len(q) < 2:
            return Response({"trips": [], "locations": []})
        trips = (
            Trip.objects.filter(is_active=True, title__icontains=q)
            .select_related("location")
            .prefetch_related("categories", "gallery")[:5]
        )
        locations = Location.objects.filter(is_active=True, name__icontains=q)[:4]
        return Response({
            "trips":     TripBaseSerializer(trips, many=True).data,
            "locations": LocationSerializer(locations, many=True).data,
        })


# ─── Testimonials ─────────────────────────────────────────────────────
class TestimonialListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class   = TestimonialSerializer
    queryset           = Testimonial.objects.filter(is_active=True)


# ─── Bookings ─────────────────────────────────────────────────────────
class BookingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Booking.objects
            .filter(user=request.user)
            .select_related("trip__location")
            .prefetch_related("booking_addons__addon", "trip__gallery", "trip__categories")
        )
        status_filter = request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        paginator = TrivoxPagination()
        page      = paginator.paginate_queryset(qs, request)
        return paginator.get_paginated_response(BookingSerializer(page, many=True).data)

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            trip = Trip.objects.get(id=data["trip_id"], is_active=True)
        except Trip.DoesNotExist:
            return Response({"detail": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

        # Build participants snapshot using server-side trip price
        participants_snapshot = []
        trip_subtotal = Decimal("0")
        for p in data["participants"]:
            if p["count"] == 0:
                continue
            unit_price = trip.price  # ignore client-submitted price
            participants_snapshot.append({
                "type":  p["type"],
                "count": p["count"],
                "price": float(unit_price),
            })
            trip_subtotal += unit_price * p["count"]
            print(10 * "==")
            print(trip_subtotal)
            print(10 * "==")

            print(unit_price)
            print(10* "=========")

        booking = Booking.objects.create(
            reference         = Booking.generate_reference(),
            status            = "confirmed",
            user              = request.user,
            trip              = trip,
            date              = data["date"],
            time              = data.get("time"),
            first_name        = data["first_name"],
            last_name         = data["last_name"],
            email             = data["email"],
            phone             = data["phone"],
            nationality       = data.get("nationality", ""),
            special_requests  = data.get("special_requests", ""),
            participants_data = participants_snapshot,
            trip_subtotal     = trip_subtotal,
            currency          = trip.price_currency,
            pickup_location   = data.get("pickup_location", ""),
            dropoff_location  = data.get("dropoff_location", ""),
            flight_number     = data.get("flight_number", ""),
            hotel_name        = data.get("hotel_name", ""),
        )

        # Create add-on line items
        addons_total = Decimal("0")
        for item in data.get("addons", []):
            try:
                addon = Addon.objects.get(id=item["addon_id"], trip=trip)
            except Addon.DoesNotExist:
                continue
            qty      = item["quantity"]
            subtotal = addon.price * qty if addon.price_unit == "per_person" else addon.price
            BookingAddon.objects.create(booking=booking, addon=addon, quantity=qty, subtotal=subtotal)
            addons_total += subtotal

        taxes = ((trip_subtotal + addons_total) * Decimal("0.05")).quantize(Decimal("0.01"))
        booking.addons_subtotal = addons_total
        booking.taxes           = taxes
        booking.total           = trip_subtotal + addons_total + taxes
        booking.save(update_fields=["addons_subtotal", "taxes", "total"])

        booking.refresh_from_db()
        qs = Booking.objects.select_related("trip__location").prefetch_related(
            "booking_addons__addon", "trip__gallery", "trip__categories"
        ).get(pk=booking.pk)
        return Response(BookingSerializer(qs).data, status=status.HTTP_201_CREATED)


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, reference):
        try:
            booking = (
                Booking.objects
                .select_related("trip__location")
                .prefetch_related("booking_addons__addon", "trip__gallery", "trip__categories")
                .get(reference=reference, user=request.user)
            )
        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(BookingSerializer(booking).data)


class BookingCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, reference):
        try:
            booking = Booking.objects.get(reference=reference, user=request.user)
        except Booking.DoesNotExist:
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)
        if booking.status in ("cancelled", "refunded", "completed"):
            return Response({"detail": "Cannot cancel this booking."}, status=status.HTTP_400_BAD_REQUEST)
        booking.status = "cancelled"
        booking.save(update_fields=["status", "updated_at"])
        return Response({"success": True})
