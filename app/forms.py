from django import forms
from .models import Beverage, Cleaner

class BeverageForm(forms.ModelForm):
    class Meta:
        model = Beverage
        fields = ["BeverageId", "BeverageName", "Category", "Price", "Stock"]
        
        
class CleanerForm(forms.ModelForm):
    class Meta:
        model = Beverage
        fields = ["CleanerId", "CleanerName", "Category", "Price", "Stock"]