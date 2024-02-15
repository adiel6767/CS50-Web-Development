from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return f'{self.username} ({self.email})'

class ScrapedDataJson(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.CharField(max_length=255)
    json_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

	
    def __str__(self):
        return f'{self.user}-{self.id}-{self.title}-{self.created_at}'

