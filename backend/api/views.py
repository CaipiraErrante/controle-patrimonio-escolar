from django.shortcuts import render

from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from .serializers import *

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]


class BensMoveisViewSet(viewsets.ModelViewSet):
    queryset = BensMoveis.objects.all()
    serializer_class = BensMoveisSerializer
    permission_classes = [permissions.DjangoModelPermissions]

class BensImoveisViewSet(viewsets.ModelViewSet):
    queryset = BensImoveis.objects.all()
    serializer_class = BensImoveisSerializer
    permission_classes = [permissions.DjangoModelPermissions]

class BensSemoventesViewSet(viewsets.ModelViewSet):
    queryset = BensSemoventes.objects.all()
    serializer_class = BensSemoventesSerializer
    permission_classes = [permissions.DjangoModelPermissions]

class BensImateriaisViewSet(viewsets.ModelViewSet):
    queryset = BensImateriais.objects.all()
    serializer_class = BensImateriaisSerializer
    permission_classes = [permissions.DjangoModelPermissions]
