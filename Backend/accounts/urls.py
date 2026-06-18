from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AvatarUploadView,
    ChangePasswordView,
    ContactMessageView,
    DeleteAccountView,
    ForgotPasswordView,
    LoginView,
    MeView,
    RegisterView,
    ResetPasswordConfirmView,
)

urlpatterns = [
    path("token/",                   LoginView.as_view(),                name="token_obtain_pair"),
    path("token/refresh/",           TokenRefreshView.as_view(),         name="token_refresh"),
    path("register/",                RegisterView.as_view(),             name="register"),
    path("me/",                      MeView.as_view(),                   name="me"),
    path("avatar/",                  AvatarUploadView.as_view(),         name="avatar_upload"),
    path("delete-account/",          DeleteAccountView.as_view(),        name="delete_account"),
    path("change-password/",         ChangePasswordView.as_view(),       name="change_password"),
    path("password-reset/",          ForgotPasswordView.as_view(),       name="password_reset"),
    path("password-reset/confirm/",  ResetPasswordConfirmView.as_view(), name="password_reset_confirm"),
    path("contact/",                 ContactMessageView.as_view(),       name="contact"),
]
