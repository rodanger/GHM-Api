import os
import django
from pyfiglet import Figlet

# --- Banner ---
f = Figlet(font='slant')
print(f.renderText('Get Token'))

# --- Configura Django ANTES de usar modelos ---
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ApiG.settings")  # ajusta si el nombre cambia
django.setup()

# --- Imports de Django ---
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

def create_user():
    username = input("Username: ")
    email = input("Email: ")
    role = input("Role: ")
    password = input("Password: ")
    
    if User.objects.filter(username=username).exists():
        print("El usuario ya existe")
        user = User.objects.get(username=username)
    else:
        user = User.objects.create_user(
            username=username,
            email=email,
            role=role,
            password=password,
           
        )
        print(f"Usuario '{username}' creado correctamente.")

    token, created = Token.objects.get_or_create(user=user)
    print(f"Token: {token.key}")

if __name__ == "__main__":
    create_user()
