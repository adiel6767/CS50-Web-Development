
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("like", views.like, name="like"),
    path("follow_unfollow_user",views.follow_unfollow_user,name='follow_unfollow_user'),
    path('posts/<int:post_id>/', views.update_post, name='update_post'),
    path('get_following_count/', views.get_following_count, name='get_following_count'),
    path('profile', views.profile, name='profile'),
    path('all_posts', views.all_posts, name='all_posts'),
    path('following', views.following, name='following'),
    path('profile/<str:username>', views.profile_of_users, name='profile_of_users'),

]
