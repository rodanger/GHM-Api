from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken import views as drf_views



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')), 
    path('api-token-auth/', drf_views.obtain_auth_token),

]
# Ruta para servir React en producción
urlpatterns += [re_path(r"^.*$", TemplateView.as_view(template_name="frontend/index.html"), name="frontend")]

# Servir archivos estáticos en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])