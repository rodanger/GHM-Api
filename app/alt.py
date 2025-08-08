from django.contrib.auth.models import AbstractUser
from django.db import models

# Usuario con roles
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('bartender', 'Bartender'),
        ('chef', 'Chef'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} - {self.role}"

# Modelo base para productos
class Product(models.Model):
    CATEGORY_CHOICES = [
        ('beverage', 'Beverage'),
        ('cleaner', 'Cleaner'),
        ('kitchen', 'Kitchen'),
        ('equipment', 'Equipment'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return f"{self.name} ({self.category})"

# Si necesitas separar detalles específicos más adelante:
class BeverageDetail(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    alcohol_content = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Ej: 4.5%

    def __str__(self):
        return f"{self.product.name} details"

class CleanerDetail(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    is_toxic = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.name} cleaner info"

###############


from django.views.decorators.csrf import csrf_exempt  # To accept request without CSRF    
from rest_framework.parsers import JSONParser # To process JSON data
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http.response import JsonResponse  # To return JSON responses
from django.utils.decorators import method_decorator
from django.views import View
from app.models import Beverage, Cleaner
from app.serializers import BeverageSerializer, CleanerSerializer  # Importing both serializers
import json
from .serializers import UserSerializer



class UserCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Crea el usuario
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#//#//#

# // Beverages API //
@csrf_exempt
def BeverageApi(request, id=0):
    if request.method == 'GET':   # GET REQUEST To get all beverages
        beverages = Beverage.objects.all()
        beverages_serializers = BeverageSerializer(beverages, many=True)
        return JsonResponse(beverages_serializers.data, safe=False)

    elif request.method == 'POST': # POST REQUEST To add a new beverage
        beverages_data = JSONParser().parse(request)
        beverages_serializers = BeverageSerializer(data=beverages_data)
        if beverages_serializers.is_valid():
            beverage = beverages_serializers.save()
            low_stock_alert = None
            if beverage.Stock < 10:
                low_stock_alert = f"⚠️ Warning: Low stock for {beverage.BeverageName} (Stock: {beverage.Stock})"
            response = {"message": "Added Successfully"}
            if low_stock_alert:
                response["alert"] = low_stock_alert
            return JsonResponse(response, status=201)
        return JsonResponse({"message": "Failed to Add"}, status=400)

    elif request.method == 'PUT': # PUT REQUEST To update a beverage
        try:
            beverages_data = JSONParser().parse(request) # Parse the incoming JSON data
            beverage = Beverage.objects.get(BeverageId=beverages_data['BeverageId'])
            beverage_serializer = BeverageSerializer(beverage, data=beverages_data, partial=True)
            if beverage_serializer.is_valid():
                beverage = beverage_serializer.save()
                low_stock_alert = None
                if beverage.Stock < 10:
                    low_stock_alert = f"⚠️ Warning: Low stock for {beverage.BeverageName} (Stock: {beverage.Stock})"
                response = {"message": "Beverage updated successfully"} 
                if low_stock_alert:
                    response["alert"] = low_stock_alert
                return JsonResponse(response, status=200)
            return JsonResponse({"message": "Invalid data"}, status=400)
        except Beverage.DoesNotExist:
            return JsonResponse({"message": "Beverage Not Found"}, status=404)
        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)


    elif request.method == 'DELETE': # DELETE REQUEST To delete a beverage
        try:
            beverage = Beverage.objects.get(BeverageId=id)
            beverage.delete()
            return JsonResponse({"message": "Deleted Successfully"}, status=204)
        except Beverage.DoesNotExist:   
            return JsonResponse({"message": "Beverage Not Found"}, status=404)
        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"message": "Invalid Request"}, status=400)

######################################

 # App/Views.py
 
# // Cleaners API //
@method_decorator(csrf_exempt, name='dispatch')
class CleanerApi(View):

    def get(self, request, *args, **kwargs):
        cleaners = Cleaner.objects.all()
        cleaner_serializer = CleanerSerializer(cleaners, many=True)
        return JsonResponse(cleaner_serializer.data, safe=False)

    def post(self, request, *args, **kwargs):
        try:
            data = JSONParser().parse(request)
            cleaner_serializer = CleanerSerializer(data=data)
            if cleaner_serializer.is_valid():
                cleaner = cleaner_serializer.save()
                low_stock_alert = None
                if cleaner.Stock < 10:
                    low_stock_alert = f"⚠️ Warning: Low stock for {cleaner.CleanerName} (Stock: {cleaner.Stock})"
                response = {"message": "Cleaner created successfully"}
                if low_stock_alert:
                    response["alert"] = low_stock_alert
                return JsonResponse(response, status=201)
            return JsonResponse({"error": "Invalid data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    def put(self, request, *args, **kwargs):
        try:
            data = JSONParser().parse(request)
            cleaner = Cleaner.objects.get(CleanerId=data['CleanerId'])
            cleaner_serializer = CleanerSerializer(cleaner, data=data, partial=True)
            if cleaner_serializer.is_valid():
                cleaner = cleaner_serializer.save()
                low_stock_alert = None
                if cleaner.Stock < 10:
                    low_stock_alert = f"⚠️ Warning: Low stock for {cleaner.CleanerName} (Stock: {cleaner.Stock})"
                response = {"message": "Cleaner updated successfully"}
                if low_stock_alert:
                    response["alert"] = low_stock_alert
                return JsonResponse(response)
            return JsonResponse({"error": "Invalid data"}, status=400)
        except Cleaner.DoesNotExist:
            return JsonResponse({"error": "Cleaner not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
    def delete(self, request, *args, **kwargs):
        try:
            # Get the ID from URL parameters
            cleaner_id = kwargs.get('id')
            if not cleaner_id:
                return JsonResponse({"error": "Cleaner ID is required"}, status=400)
                
            cleaner = Cleaner.objects.get(CleanerId=cleaner_id)
            cleaner.delete()
            return JsonResponse({"message": "Cleaner deleted successfully"}, status=204)
        except Cleaner.DoesNotExist:
            return JsonResponse({"error": "Cleaner not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)


#############



# app/urls.py
from django.urls import path
from .views import BeverageApi, CleanerApi, UserCreateView

urlpatterns = [
    
    # User Registration
    path('register/', UserCreateView.as_view(), name='user-register'),
    
    #Beverages API
    path('beverages/', BeverageApi, name='beverage_api'),  # Route to manage all methods (GET, POST)
    path('beverages/<int:id>/', BeverageApi, name='beverage_api_detail'),  # Route to manage PUT y DELETE

    # Cleaner
     path('cleaners/', CleanerApi.as_view(), name='cleaner_api'),  # GET, POST
     path('cleaners/<int:id>/', CleanerApi.as_view(), name='cleaner_api_detail'),  # PUT, DELETE

]
