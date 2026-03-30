from django.urls import path
from .views import (
    health, me,
    UserCreateView,
    BeverageApi, BeverageDetailApi,
    CleanerApi, CleanerDetailApi,
    PartyApi, PartyDetailApi,
    BottleApi, BottleDetailApi,
)

urlpatterns = [
    path('health/', health, name='health'),
    path('me/', me, name='me'),

    # User
    path('register/', UserCreateView.as_view(), name='user-register'),

    # Beverages
    path('beverages/', BeverageApi.as_view(), name='beverage_api'),
    path('beverages/<int:id>/', BeverageDetailApi.as_view(), name='beverage_api_detail'),

    # Cleaners
    path('cleaners/', CleanerApi.as_view(), name='cleaner_api'),
    path('cleaners/<int:id>/', CleanerDetailApi.as_view(), name='cleaner_api_detail'),

    # Parties
    path('parties/', PartyApi.as_view(), name='party_api'),
    path('parties/<int:id>/', PartyDetailApi.as_view(), name='party_api_detail'),

    # Opened Bottles (nested bajo party)
    path('parties/<int:party_id>/bottles/', BottleApi.as_view(), name='bottle_api'),
    path('parties/<int:party_id>/bottles/<int:bottle_id>/', BottleDetailApi.as_view(), name='bottle_api_detail'),
]