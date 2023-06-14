from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.db.models import Max
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render,redirect, get_object_or_404
from django.urls import reverse
from .models import User,auction_listing,Categorie,auction_listing_form,watchlist,bid,ListingCreator,Auction_winner,Comment


def index(request):
    winners = Auction_winner.objects.all()
    winner_auction = ""
    winner_listing_user = None



    for winner in winners:
        winner_auction = winner.auction_listing.listing_title
        winner_listing_user= winner.winner

    all_listing = auction_listing.objects.all()
    
    # for item in all_listing:
    #     item.is_closed = False
    #     item.save()
 
    
    listing_creators = ListingCreator.objects.select_related('auction_listing').filter(auction_listing__in=all_listing)
    return render(request, "auctions/index.html",{
        'winner_auction': winner_auction,
        'winner_listing_user':winner_listing_user,
        'all_listing':all_listing,
        'watchlist': watchlist,
        

    })


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def create_listing(request):
    categories=Categorie.objects.all()
    categories = sorted(categories, key=lambda category: category.name)
    form = auction_listing_form(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            listing = form.save(commit=False)
            if form.cleaned_data['is_closed']:
                listing.status = 'closed'
            listing.save()
            ListingCreator.objects.create(user=request.user, auction_listing=listing)
        return redirect("index")
    else:
        print('Form Not Valid')
        return render(request, 'auctions/create_listing.html',{
            'categories':categories
            })

def close_auction(request, item_id):
    listing = get_object_or_404(ListingCreator, auction_listing__id=item_id)
    if request.user == listing.user:
        highest_bid = bid.objects.filter(listing=listing.auction_listing).order_by('-bid').first()
        if highest_bid:
            winner = highest_bid.user
            auction_winner = Auction_winner(auction_listing=listing.auction_listing, winner=winner)
            auction_winner.save()            
            if request.user == winner:
                messages.success(request, 'Congratulations, you won the auction!')
            else:
                messages.success(request, f'{winner.username} won the auction')
        else:
            messages.info(request, 'The auction ended with no winner')
        listing.auction_listing.is_closed = True
        listing.auction_listing.save()
        messages.success(request, 'Congratulations you have closed the auction')
    return redirect('listing_detail', item_id=item_id)
        

def categories(request):
    categories = Categorie.objects.all()
    categories = sorted(categories, key=lambda category: category.name)
    return render(request, 'auctions/categories.html',{
        'categories': categories
        })
   

def categories_listing(request, title):
    category_listing = auction_listing.objects.filter(item_category=title)
    return render(request, 'auctions/categories_category.html', {
        'all_listing': category_listing
    })


def add_watchlist(request):
    user = request.user
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        item = auction_listing.objects.get(pk=item_id)
        if watchlist.objects.filter(user=user,item=item).exists():
            return redirect('add_watchlist')
        else:
            watchlist.objects.create(user=user, item=item)
            return redirect('add_watchlist')

    watchlist_items = user.watchlist.all()
    all_listing = auction_listing.objects.filter(watchlist_items__user=user)
    return render(request, 'auctions/watchlist.html', {
        'watchlist_items': watchlist_items,
        'all_listing': all_listing
    })

def remove_watchlist(request):
    user = request.user
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        item = auction_listing.objects.get(pk=item_id)
        watchlist.objects.get(user=user, item=item).delete()
        return redirect('add_watchlist')
    watchlist_items = user.watchlist.all()
    all_listing = auction_listing.objects.filter(watchlist_items__user=user)
    return render(request, 'auctions/watchlist.html', {
        'watchlist_items': watchlist_items,
        'all_listing': all_listing
    })

def user_bid(request):
    if request.user.is_authenticated:
        user = request.user
        if request.method == 'POST':
            item_id = request.POST.get('item_id')
            item = auction_listing.objects.get(pk=item_id)
            listing = int(item.listing_bid)
            listing_title = item.listing_title
            my_bid = bid.objects.filter(user=user,listing=item)
            bid_max = bid.objects.filter(listing=item).aggregate(Max('bid'))['bid__max']
            place_bid = int(request.POST.get('place_bid'))
            bids = bid.objects.all()
            if place_bid >= listing:
                if not my_bid.exists():
                    if bid_max is not None:
                        if place_bid > bid_max:
                            bid.objects.create(user=user, listing=item, bid=place_bid)
                            messages.success(request, f'Congratulations you have placed a bid for {listing_title}')
                            return redirect('listing_detail', item_id=item_id)
                        else:
                            messages.warning(request, f'Your bid must be higher than the current highest bid of ${bid_max}')
                    else:
                        bid.objects.create(user=user, listing=item, bid=place_bid)
                        messages.success(request, f'Congratulations you have placed a bid for {listing_title}')
                        return redirect('listing_detail', item_id=item_id)
                else:
                    messages.warning(request, f'You have already placed a bid for item {listing_title}')
                    return redirect('listing_detail', item_id=item_id)
            else:
                messages.warning(request, f'Error: Bid must be equal or greater to the current starting bid ${listing}')
            return redirect('listing_detail', item_id=item_id)

def listing_detail(request, item_id):
    all_listing = auction_listing.objects.all()
    item = auction_listing.objects.get(pk=item_id)
    comments = Comment.objects.filter(listing=item)
    listing_creators = ListingCreator.objects.select_related('auction_listing').filter(auction_listing__in=all_listing)
    
    # for item in all_listing:
    #     item.is_closed = False
    #     item.save()
    
    winners = Auction_winner.objects.all()
    winner_auction = ""
    winner_listing_user = None

    for winner in winners:
        winner_auction = winner.auction_listing.listing_title
        winner_listing_user= winner.winner


    if request.method == 'POST':
        comment_form = request.POST.get('comment')
        if comment_form:
            user = request.user
            Comment.objects.create(user=user, listing=item, text=comment_form)
            return redirect('listing_detail', item_id=item_id)

    return render(request, 'auctions/auction_listing.html',{
        'item_id': item_id,
        'all_listing': all_listing,
        'comments': comments,
        'listing_creators': listing_creators,
        'winner_listing_user':winner_listing_user,
        'winner_auction':winner_auction
    })





