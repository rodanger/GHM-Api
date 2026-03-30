from rest_framework import serializers
from .models import Beverage, Cleaner, Party, OpenedBottle
from django.contrib.auth import get_user_model

User = get_user_model()


# ─── User ─────────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            role=validated_data.get('role', 'staff')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# ─── Beverage ─────────────────────────────────────────────────
class BeverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beverage
        fields = ['id', 'name', 'brand', 'quantity', 'unit', 'category', 'min_stock', 'image_url']


# ─── Cleaner ──────────────────────────────────────────────────
class CleanerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cleaner
        fields = ['id', 'name', 'brand', 'quantity', 'unit', 'category', 'min_stock', 'image_url']


# ─── OpenedBottle ─────────────────────────────────────────────
class OpenedBottleSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenedBottle
        fields = [
            'id', 'party', 'beverage',
            'name', 'brand', 'image_url',
            'price_per_unit', 'opened_by',
            'opened_at', 'notes',
        ]
        read_only_fields = ['id', 'opened_at', 'party']


# ─── Party ────────────────────────────────────────────────────
class PartySerializer(serializers.ModelSerializer):
    opened_bottles = OpenedBottleSerializer(many=True, read_only=True)
    total_cost     = serializers.SerializerMethodField()
    bottle_count   = serializers.SerializerMethodField()

    class Meta:
        model = Party
        fields = [
            'id', 'name', 'date', 'notes', 'created_at',
            'opened_bottles', 'total_cost', 'bottle_count',
        ]
        read_only_fields = ['id', 'created_at']

    def get_total_cost(self, obj):
        return float(sum(b.price_per_unit for b in obj.opened_bottles.all()))

    def get_bottle_count(self, obj):
        return obj.opened_bottles.count()