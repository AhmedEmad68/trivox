from django.urls import path
from .views import (
    LocationListView, PopularLocationsView, LocationDetailView,
    TripListView, FeaturedTripsView, TripDetailView,
    RelatedTripsView, TripReviewsView, TripAddonsView,
    SearchSuggestionsView, TestimonialListView,
    BookingListCreateView, BookingDetailView, BookingCancelView,
)

urlpatterns = [
    # Locations
    path("locations/",             LocationListView.as_view(),     name="location_list"),
    path("locations/popular/",     PopularLocationsView.as_view(), name="popular_locations"),
    path("locations/<slug:slug>/", LocationDetailView.as_view(),   name="location_detail"),

    # Trips — fixed paths before slug patterns
    path("trips/",                    TripListView.as_view(),          name="trip_list"),
    path("trips/featured/",           FeaturedTripsView.as_view(),     name="featured_trips"),
    path("trips/search/suggestions/", SearchSuggestionsView.as_view(), name="search_suggestions"),
    path("trips/<slug:slug>/",        TripDetailView.as_view(),        name="trip_detail"),
    path("trips/<slug:slug>/related/",RelatedTripsView.as_view(),      name="related_trips"),
    path("trips/<slug:slug>/reviews/",TripReviewsView.as_view(),       name="trip_reviews"),
    path("trips/<slug:slug>/addons/", TripAddonsView.as_view(),        name="trip_addons"),

    # Homepage
    path("testimonials/", TestimonialListView.as_view(), name="testimonials"),

    # Bookings
    path("bookings/",                          BookingListCreateView.as_view(), name="booking_list_create"),
    path("bookings/<str:reference>/",          BookingDetailView.as_view(),     name="booking_detail"),
    path("bookings/<str:reference>/cancel/",   BookingCancelView.as_view(),     name="booking_cancel"),
]
