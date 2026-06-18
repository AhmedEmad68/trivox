import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PasswordResetToken
from .serializers import (
    ChangePasswordSerializer,
    ContactMessageSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    tokens_for_user,
)

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"user": UserSerializer(user).data, "tokens": tokens_for_user(user)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(tokens_for_user(serializer.validated_data["user"]))


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"success": True})


class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]

    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    MAX_SIZE = 5 * 1024 * 1024  # 5 MB

    def post(self, request):
        file = request.FILES.get("avatar")
        if not file:
            return Response({"detail": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        if file.content_type not in self.ALLOWED_TYPES:
            return Response(
                {"detail": "Invalid file type. Use JPEG, PNG, WebP or GIF."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if file.size > self.MAX_SIZE:
            return Response(
                {"detail": "File too large. Maximum size is 5 MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ext = file.name.rsplit(".", 1)[-1].lower() if "." in file.name else "jpg"
        rel_path = f"avatars/{uuid.uuid4().hex}.{ext}"
        saved_path = default_storage.save(rel_path, file)

        # Delete previous local avatar if it was uploaded here
        user = request.user
        old_url = user.avatar or ""
        media_prefix = settings.MEDIA_URL + "avatars/"
        if media_prefix in old_url:
            old_rel = old_url.split(settings.MEDIA_URL, 1)[-1]
            if default_storage.exists(old_rel):
                default_storage.delete(old_rel)

        avatar_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)
        user.avatar = avatar_url
        user.save(update_fields=["avatar"])

        return Response({"avatar": avatar_url})


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get("password", "")
        if not password:
            return Response({"detail": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not request.user.check_password(password):
            return Response({"detail": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"success": True})

        PasswordResetToken.objects.filter(user=user, used=False).update(used=True)

        reset_token = PasswordResetToken.objects.create(user=user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token.token}"
        name = user.first_name or "there"

        send_mail(
            subject="Reset your TriVox password",
            message=(
                f"Hi {name},\n\n"
                f"Click the link below to reset your password. It expires in 30 minutes.\n\n"
                f"{reset_url}\n\n"
                "If you didn't request this, you can safely ignore this email.\n\n"
                "— The TriVox Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=(
                '<div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1A1208">'
                '<div style="background:#1A1208;padding:24px 28px;border-radius:12px 12px 0 0">'
                '<p style="color:#C8913A;font-size:1.25rem;font-weight:600;margin:0">TriVox</p>'
                '<p style="color:rgba(253,252,250,0.5);font-size:0.6875rem;letter-spacing:0.14em;text-transform:uppercase;margin:3px 0 0">Egypt & Beyond</p>'
                "</div>"
                '<div style="background:#fff;padding:28px;border:1px solid rgba(226,216,194,0.6);border-top:none;border-radius:0 0 12px 12px">'
                f"<h2 style=\"margin:0 0 8px;font-size:1.375rem\">Reset your password</h2>"
                f'<p style="color:#625849;line-height:1.6;margin:0 0 24px">Hi {name}, click the button below to choose a new password. This link expires in <strong>30 minutes</strong>.</p>'
                f'<a href="{reset_url}" style="display:inline-block;background:#C8913A;color:#1A1208;font-weight:600;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:0.9375rem">Reset my password</a>'
                f'<p style="color:#948A7D;font-size:0.8125rem;margin:24px 0 0;line-height:1.5">If the button doesn\'t work, copy this link:<br><a href="{reset_url}" style="color:#C8913A;word-break:break-all">{reset_url}</a></p>'
                '<hr style="border:none;border-top:1px solid rgba(226,216,194,0.6);margin:20px 0">'
                '<p style="color:#948A7D;font-size:0.75rem;margin:0">If you didn\'t request a password reset, you can safely ignore this email.</p>'
                "</div>"
                "</div>"
            ),
        )
        return Response({"success": True})


class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reset_token = serializer._reset_token
        user = reset_token.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        reset_token.used = True
        reset_token.save()
        return Response({"success": True})


class ContactMessageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True}, status=status.HTTP_201_CREATED)
