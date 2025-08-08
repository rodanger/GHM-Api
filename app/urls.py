from django.urls import path
from .views import BeverageApi, BeverageDetailApi, CleanerApi, CleanerDetailApi, UserCreateView




urlpatterns = [
    # User Registration
    path('register/', UserCreateView.as_view(), name='user-register'),
    # Beverages API
    path('beverages/', BeverageApi.as_view(), name='beverage_api'),
    path('beverages/<int:id>/', BeverageDetailApi.as_view(), name='beverage_api_detail'),
    # Cleaners API
    path('cleaners/', CleanerApi.as_view(), name='cleaner_api'),
    path('cleaners/<int:id>/', CleanerDetailApi.as_view(), name='cleaner_api_detail'),
]
