from django.urls import include, path
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"groups", GroupViewSet)
router.register(r"bens_moveis", BensMoveisViewSet)
router.register(r"bens_imoveis", BensImoveisViewSet)
router.register(r"bens_semoventes", BensSemoventesViewSet)
router.register(r"bens_imateriais", BensImateriaisViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]