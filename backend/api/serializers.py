from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

class BensMoveisSerializer(serializers.HyperlinkedModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    # numeroPatrimonio = serializers.CharField(source="codigoPatrimonio")

    class Meta:
        model = BensMoveis
        fields = [ 
            "url",
            "id",
            "numeroPatrimonio",
            "descricao",       
            "responsavel", 
            "localizacao", 
            "estado",
        ] 
class BensImoveisSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BensImoveis
        fields = [ 
            "url",
            "id", 
            "numeroPatrimonio", 
            "descricao",       
            "responsavel", 
            "localizacao", 
            "estado",
        ] 

class BensSemoventesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BensSemoventes
        fields = [ 
            "url",
            "id", 
            "numeroPatrimonio", 
            "descricao",       
            "responsavel", 
            "dataNascimento", 
            "estado",
        ] 

class BensImateriaisSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BensImateriais
        fields = [ 
            "url", 
            "id",
            "numeroPatrimonio", 
            "descricao",       
            "responsavel", 
            "dataOrigem", 
            "autor",
        ]         