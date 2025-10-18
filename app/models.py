from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('bartender', 'Bartender'),
        ('chef', 'Chef'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')

    def __str__(self):
        return f"{self.username} - ({self.role})"

class Beverage(models.Model):
    name = models.CharField(max_length=100, default='Unnamed Beverage')
    brand = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=50, default='unit')
    category = models.CharField(max_length=50, blank=True, null=True)
    min_stock = models.PositiveIntegerField(default=10)  # ✅ Agregado correctamente

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"




class Cleaner(models.Model):
    name = models.CharField(max_length=100, default='Unnamed Cleaner')         # <- default corregido y agregado
    quantity = models.PositiveIntegerField(default=0)                          # <- default agregado
    unit = models.CharField(max_length=50, default='unit')                    # <- **agregado default**
    location = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"
