"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
# from django.contrib.auth.models import User
# from rest_framework import routers, serializers, viewsets
# from api.models import *

# Serializers define the API representation.
# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ["url", "username", "email", "is_staff"]  

# ViewSets define the view behavior.
# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class BensMoveisSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = BensMoveis
#         fields = [ 
#             "url", 
#             "codigoPatrimonio", 
#             "descricao",       
#             "responsavel", 
#             "localizacao", 
#             "estado",
#         ] 

# class BensImoveisSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = BensImoveis
#         fields = [ 
#             "url", 
#             "codigoPatrimonio", 
#             "descricao",       
#             "responsavel", 
#             "localizacao", 
#             "estado",
#         ] 

# class BensSemoventesSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = BensSemoventes
#         fields = [ 
#             "url", 
#             "codigoPatrimonio", 
#             "descricao",       
#             "responsavel", 
#             "dataNascimento", 
#             "estado",
#         ] 

# class BensImateriaisSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = BensImateriais
#         fields = [ 
#             "url", 
#             "codigoPatrimonio", 
#             "descricao",       
#             "responsavel", 
#             "dataOrigem", 
#             "autor",
#         ]         

# class BensMoveisViewSet(viewsets.ModelViewSet):
#     queryset = BensMoveis.objects.all()
#     serializer_class = BensMoveisSerializer

# class BensImoveisViewSet(viewsets.ModelViewSet):
#     queryset = BensImoveis.objects.all()
#     serializer_class = BensImoveisSerializer

# class BensSemoventesViewSet(viewsets.ModelViewSet):
#     queryset = BensSemoventes.objects.all()
#     serializer_class = BensSemoventesSerializer

# class BensImateriaisViewSet(viewsets.ModelViewSet):
#     queryset = BensImateriais.objects.all()
#     serializer_class = BensImateriaisSerializer

# Routers provide an easy way of automatically determining the URL conf.
# router = routers.DefaultRouter()
# router.register(r"users", UserViewSet)
# router.register(r"bens_moveis", BensMoveisViewSet)
# router.register(r"bens_imoveis", BensImoveisViewSet)
# router.register(r"bens_semoventes", BensSemoventesViewSet)
# router.register(r"bens_imateriais", BensImateriaisViewSet)

urlpatterns = [
    path("", include("api.urls")),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),   
    path("_allauth/", include("allauth.headless.urls")),        
]