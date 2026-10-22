from django.db import models

# Create your models here.

class BensAbstract(models.Model):
    id = models.IntegerField(primary_key=True, auto_created=True)
    numeroPatrimonio = models.CharField(max_length=50)
    descricao = models.TextField()      
    responsavel = models.CharField(max_length=30)    

    class Meta: 
        db_table = "BensAbstract"
        abstract = True

class BensMoveis(BensAbstract):    
    localizacao = models.CharField(max_length=20)
    estado = models.CharField(max_length=10)

    class Meta: 
        db_table = "BensMoveis" 
        verbose_name = "BensMoveis"
        verbose_name_plural = "BensMoveis"

class BensImoveis(BensAbstract):    
    localizacao = models.CharField(max_length=20)
    estado = models.CharField(max_length=10)

    class Meta: 
        db_table = "BensImoveis"  
        verbose_name = "BensImoveis"
        verbose_name_plural = "BensImoveis"                

class BensSemoventes(BensAbstract):    
    dataNascimento = models.DateField()
    estado = models.CharField(max_length=10)

    class Meta: 
        db_table = "BensSemoventes"        
        verbose_name = "BensSemoventes"
        verbose_name_plural = "BensSemoventes"  

class BensImateriais(BensAbstract):    
    dataOrigem = models.DateField()
    autor = models.CharField(max_length=30)

    class Meta: 
        db_table = "BensImateriais"    
        verbose_name = "BensImateriais"
        verbose_name_plural = "BensImateriais"        