from django import forms
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return self.username

class auction_listing(models.Model):
    id = models.AutoField(primary_key=True)
    item_category = models.CharField(max_length=64)
    listing_title = models.CharField(max_length=64)
    listing_description = models.TextField()
    listing_bid = models.IntegerField()
    listing_image_url = models.URLField()
    watchlist = models.ManyToManyField(User, blank=True, related_name='watchlist_listings')
    user_bid = models.ManyToManyField(User, blank=True, related_name='user_bid')
    ListingCreator = models.ManyToManyField(User, blank=True, related_name="ListingCreator")
    winner = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="won_auctions")
    is_closed = models.BooleanField(default=False)



    def __str__(self):
        return self.item_category + ':' + ' ' + self.listing_title 
        
class auction_listing_form(forms.ModelForm):
    class Meta:
        model = auction_listing
        fields= ['item_category','listing_title','listing_description', 'listing_bid', 'listing_image_url','is_closed']
         

class Categorie(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    item = models.ForeignKey(auction_listing, on_delete=models.CASCADE, related_name='watchlist_items')
    # notes = models.TextField(blank=True, null=True)
    def __str__(self):
        return f"{self.user.username}'s watchlist: {self.item.listing_title}"

class bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_bidding')
    listing = models.ForeignKey(auction_listing, on_delete=models.CASCADE,related_name='bid_item')
    bid = models.IntegerField()

    def __str__(self):
        return f"{self.user.username}'s bid amount: ${self.bid} on {self.listing.listing_title}"

class ListingCreator(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auction_listing = models.ForeignKey(auction_listing, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} created {self.auction_listing.listing_title}"

class Auction_winner(models.Model):
    auction_listing = models.ForeignKey(auction_listing, on_delete=models.SET_NULL, null=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return f"{self.winner} winner of {self.auction_listing.listing_title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(auction_listing, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.listing.listing_title}"

    def get_absolute_url(self):
        return reverse('listing_detail', args=[str(self.listing.id)])