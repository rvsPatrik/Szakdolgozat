from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status, generics, serializers
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer, CharField, EmailField

User = get_user_model()


class RegisterSerializer(ModelSerializer):
    password = CharField(write_only=True, required=True)
    email = EmailField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'username': {'required': True},
        }

    def validate(self, attrs):
        username = (attrs.get('username') or '').strip()
        email = (attrs.get('email') or '').strip()
        first_name = (attrs.get('first_name') or '').strip()
        last_name = (attrs.get('last_name') or '').strip()
        password = attrs.get('password') or ''

        if not first_name:
            raise serializers.ValidationError({'first_name': 'First name is required.'})
        if not last_name:
            raise serializers.ValidationError({'last_name': 'Last name is required.'})
        if not username:
            raise serializers.ValidationError({'username': 'Username is required.'})
        if not email:
            raise serializers.ValidationError({'email': 'Email is required.'})
        if len(password) < 6:
            raise serializers.ValidationError({'password': 'Password must be at least 6 characters.'})

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({'username': 'Username already taken.'})

        if email and User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'Email already in use.'})

        return attrs

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class UserSerializer(ModelSerializer):
    password = CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'is_active', 'is_staff', 'password')
        read_only_fields = ('id',)

    def validate(self, attrs):
        user_id = getattr(self.instance, 'id', None)
        username = attrs.get('username')
        email = attrs.get('email')

        if username and User.objects.exclude(pk=user_id).filter(username__iexact=username).exists():
            raise serializers.ValidationError({'username': 'Username already taken.'})

        if email and User.objects.exclude(pk=user_id).filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'Email already in use.'})

        return attrs

    def update(self, instance, validated_data):
        pwd = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if pwd:
            instance.set_password(pwd)
            instance.save(update_fields=['password'])
        return instance


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class UserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user management.
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def partial_update(self, request, *args, **kwargs):
        data = request.data.copy()
        role = data.get('role')
        if role is not None:
            data['is_staff'] = False if str(role) == 'viewer' else True
        request._full_data = data
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def set_password(self, request, pk=None):
        user = self.get_object()
        password = request.data.get('password')
        if not password or len(password) < 6:
            return Response({'password': 'Password must be at least 6 characters.'},
                            status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save(update_fields=['password'])
        return Response({'status': 'ok'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': getattr(user, 'first_name', ''),
        'last_name': getattr(user, 'last_name', ''),
        'email': getattr(user, 'email', ''),
        'role': getattr(user, 'role', None),
        'is_staff': user.is_staff,
        'is_active': user.is_active,
    })