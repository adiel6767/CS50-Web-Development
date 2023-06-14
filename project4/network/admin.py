from django.contrib import admin 
from .models import Post,Like,Follower,User

# Register your models here.
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Follower)
admin.site.register(User)