from django.urls import path
from . import views
from .views import create_listing

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("categories", views.categories, name="categories"),
    path("add_watchlist", views.add_watchlist, name="add_watchlist"),
    path("remove_watchlist", views.remove_watchlist, name="remove_watchlist"),
    path("create_listing", views.create_listing, name="create_listing"),
    path("categories_listing/<str:title>", views.categories_listing, name="categories_listing"),
    path("user_bid",views.user_bid,name="user_bid"),
    path("close_auction/<int:item_id>", views.close_auction, name="close_auction"),
    path("listing_detail/<int:item_id>", views.listing_detail, name="listing_detail"),

]
