from django.contrib.auth.models import AbstractUser
from django.db import models


# ─── Custom User ──────────────────────────────────────────────
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin',            'Admin'),
        ('beverage_manager', 'Beverage Manager'),
        ('bartender',        'Bartender'),
        ('chef',             'Chef'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='bartender')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# ─── Beverage ─────────────────────────────────────────────────
class Beverage(models.Model):
    name       = models.CharField(max_length=100, default='Unnamed Beverage')
    brand      = models.CharField(max_length=100, blank=True, null=True)
    quantity   = models.PositiveIntegerField(default=0)
    unit       = models.CharField(max_length=50, default='unit')
    category   = models.CharField(max_length=50, blank=True, null=True)
    min_stock  = models.PositiveIntegerField(default=10)
    image_url  = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Beverage'
        verbose_name_plural = 'Beverages'

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

    @property
    def is_low_stock(self):
        return self.quantity <= self.min_stock


# ─── Cleaner ──────────────────────────────────────────────────
class Cleaner(models.Model):
    name       = models.CharField(max_length=100, default='Unnamed Cleaner')
    brand      = models.CharField(max_length=100, blank=True, null=True)
    quantity   = models.PositiveIntegerField(default=0)
    unit       = models.CharField(max_length=50, default='unit')
    category   = models.CharField(max_length=50, blank=True, null=True)
    min_stock  = models.PositiveIntegerField(default=10)
    image_url  = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Cleaner'
        verbose_name_plural = 'Cleaners'

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

    @property
    def is_low_stock(self):
        return self.quantity <= self.min_stock


# ─── Party ────────────────────────────────────────────────────
class Party(models.Model):
    name       = models.CharField(max_length=150)
    date       = models.DateField()
    notes      = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Party'
        verbose_name_plural = 'Parties'

    def __str__(self):
        return f"{self.name} ({self.date})"

    @property
    def total_cost(self):
        return sum(b.price_per_unit for b in self.opened_bottles.all())

    @property
    def bottle_count(self):
        return self.opened_bottles.count()


# ─── OpenedBottle ─────────────────────────────────────────────
class OpenedBottle(models.Model):
    party          = models.ForeignKey(Party, on_delete=models.CASCADE, related_name='opened_bottles')
    beverage       = models.ForeignKey(Beverage, on_delete=models.SET_NULL, null=True, blank=True, related_name='openings')
    # Campos desnormalizados por si el beverage se elimina después
    name           = models.CharField(max_length=100)
    brand          = models.CharField(max_length=100, blank=True, null=True)
    image_url      = models.URLField(max_length=500, blank=True, null=True)
    price_per_unit = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    opened_by      = models.CharField(max_length=100, blank=True, null=True)
    opened_at      = models.DateTimeField(auto_now_add=True)
    notes          = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-opened_at']
        verbose_name = 'Opened Bottle'
        verbose_name_plural = 'Opened Bottles'

    def __str__(self):
        return f"{self.name} @ {self.party.name}"