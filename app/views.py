from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication, BasicAuthentication
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Beverage, Cleaner
from .serializers import UserSerializer, BeverageSerializer, CleanerSerializer

User = get_user_model()

# --- Usuarios ---
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# --- Bebidas ---
class BeverageApi(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        beverages = Beverage.objects.all()
        serializer = BeverageSerializer(beverages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BeverageSerializer(data=request.data)
        if serializer.is_valid():
            beverage = serializer.save()
            alert = None
            if beverage.quantity < 10:
                alert = f"⚠️ Warning: Low stock for {beverage.name} (Quantity: {beverage.quantity})"
            response = {
                "message": "Beverage created successfully",
                "beverage": BeverageSerializer(beverage).data
            }
            if alert:
                response["alert"] = alert
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BeverageDetailApi(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(Beverage, id=id)

    def get(self, request, id):
        beverage = self.get_object(id)
        serializer = BeverageSerializer(beverage)
        return Response(serializer.data)

    def put(self, request, id):
        beverage = self.get_object(id)
        serializer = BeverageSerializer(beverage, data=request.data, partial=True)
        if serializer.is_valid():
            beverage = serializer.save()
            alert = None
            if beverage.quantity < 10:
                alert = f"⚠️ Warning: Low stock for {beverage.name} (Quantity: {beverage.quantity})"
            response = {
                "message": "Beverage updated successfully",
                "beverage": BeverageSerializer(beverage).data
            }
            if alert:
                response["alert"] = alert
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        beverage = self.get_object(id)
        beverage.delete()
        return Response({"message": "Beverage deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# --- Limpiadores ---
class CleanerApi(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cleaners = Cleaner.objects.all()
        serializer = CleanerSerializer(cleaners, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CleanerSerializer(data=request.data)
        if serializer.is_valid():
            cleaner = serializer.save()
            alert = None
            if cleaner.quantity < 10:
                alert = f"⚠️ Warning: Low stock for {cleaner.name} (Quantity: {cleaner.quantity})"
            response = {
                "message": "Cleaner created successfully",
                "cleaner": CleanerSerializer(cleaner).data
            }
            if alert:
                response["alert"] = alert
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CleanerDetailApi(APIView):
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return get_object_or_404(Cleaner, id=id)

    def get(self, request, id):
        cleaner = self.get_object(id)
        serializer = CleanerSerializer(cleaner)
        return Response(serializer.data)

    def put(self, request, id):
        cleaner = self.get_object(id)
        serializer = CleanerSerializer(cleaner, data=request.data, partial=True)
        if serializer.is_valid():
            cleaner = serializer.save()
            alert = None
            if cleaner.quantity < 10:
                alert = f"⚠️ Warning: Low stock for {cleaner.name} (Quantity: {cleaner.quantity})"
            response = {
                "message": "Cleaner updated successfully",
                "cleaner": CleanerSerializer(cleaner).data
            }
            if alert:
                response["alert"] = alert
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        cleaner = self.get_object(id)
        cleaner.delete()
        return Response({"message": "Cleaner deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
