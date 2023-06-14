from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # pass
    follower_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)

class Post(models.Model):
    user = models.ForeignKey("User", on_delete =models.CASCADE, related_name='author')
    content = models.CharField(blank=True,max_length=250,default='')
    date = models.DateTimeField(auto_now_add = True)
    likes = models.IntegerField(default=0)
    # like_by = models.ManyToManyField('User',related_name='liked_post',blank=True)     

    def __str__(self):
        return f"{self.user} : {self.content} On {self.date}"

class Like(models.Model):
    user = models.ForeignKey('User',on_delete=models.CASCADE)
    post = models.ForeignKey('Post',on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','post')

class Follower(models.Model):
    follower = models.ForeignKey('User',related_name='follower',on_delete=models.CASCADE)
    following = models.ForeignKey('User',related_name='following',on_delete=models.CASCADE)

    # class Meta:
        # unique_together = ('follower','following')

