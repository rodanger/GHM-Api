from rest_framework import serializers
from .models import Beverage, Cleaner, User
from django.contrib.auth import get_user_model

User = get_user_model()


# Serializer para Beverage
class BeverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beverage
        fields = ['id', 'name', 'brand', 'quantity', 'unit', 'category', 'min_stock']

        


# Serializer para Cleaner
class CleanerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cleaner
        fields = ['id', 'name', 'quantity', 'unit', 'location']
       

# Serializer para User
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
