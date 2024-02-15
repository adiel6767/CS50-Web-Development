from django.contrib import admin
from .models import ScrapedDataJson,User

admin.site.register(User)
admin.site.register(ScrapedDataJson)
