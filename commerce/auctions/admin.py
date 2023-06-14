from django.contrib import admin
from .models import auction_listing,Categorie,watchlist,bid,User,ListingCreator,Auction_winner,Comment

# Register your models here.
admin.site.register(auction_listing)
admin.site.register(Categorie)
admin.site.register(watchlist)
admin.site.register(bid)
admin.site.register(User)
admin.site.register(ListingCreator)
admin.site.register(Auction_winner)
admin.site.register(Comment)