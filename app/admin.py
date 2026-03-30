from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.http import JsonResponse
from .models import User, Beverage, Cleaner, Party, OpenedBottle

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
    list_display = ['username', 'email', 'role', 'is_active', 'is_staff']
    list_filter  = ['role', 'is_active']

@admin.register(Beverage)
class BeverageAdmin(admin.ModelAdmin):
    list_display  = ['name', 'brand', 'quantity', 'unit', 'category', 'min_stock']
    list_filter   = ['category']
    search_fields = ['name', 'brand']

@admin.register(Cleaner)
class CleanerAdmin(admin.ModelAdmin):
    list_display  = ['name', 'brand', 'quantity', 'unit', 'category', 'min_stock']
    list_filter   = ['category']
    search_fields = ['name', 'brand']

@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display  = ['name', 'date', 'bottle_count', 'total_cost']
    search_fields = ['name']

@admin.register(OpenedBottle)
class OpenedBottleAdmin(admin.ModelAdmin):
    list_display  = ['name', 'brand', 'party', 'opened_by', 'price_per_unit', 'opened_at']
    list_filter   = ['party']
    search_fields = ['name', 'brand', 'opened_by']

admin.site.health_check = lambda request: JsonResponse({"status": "ok"})