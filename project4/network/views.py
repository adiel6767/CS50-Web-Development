from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError, transaction
from django.db.models import Count
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render,redirect,get_object_or_404
from django.urls import reverse
from django.core.paginator import Paginator
from .models import User,Post,Like,Follower
import json

def index(request):     
    if request.method == 'POST':
        if 'input-post' in request.POST:
            user = request.user
            content = request.POST.get('input-post')
            print('content here', content)
            
            if len(content.strip()) > 0:
                try:
                    with transaction.atomic():
                        post = Post(user=user, content=content)
                        post.save()
                    print('Post saved successfully')
                except Exception as e:
                    print('Error saving post:', str(e))
            else:
                print('Content is empty or contains only whitespace')
            # data = {
            #     'success': True,
            #     'username' : post.user.username,
            #     'post':post.content,
            #     'likes':post.likes,
            #     'date':post.date,
            #     'id':post.id,
            # }

            # return JsonResponse(data)

    posts = Post.objects.all().order_by('-date')
    # for post in posts:
        # print(post.content)
    #############################################
    # PAGINATOR
    paginator = Paginator(posts,10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    num_posts = len(page_obj)
    for post in page_obj:
        print('num_posts',post)
    #################################################
    likes = Like.objects.all()
    has_liked = False

    liked_posts = []

    if request.user.is_authenticated:
        for post in posts:
            like = Like.objects.filter(user=request.user, post=post).exists()
            if like:
                liked_posts.append(post.id)


    return render(request, "network/index.html",{
        'liked_posts':liked_posts,
        'page_obj':page_obj,
        'num_posts':num_posts,
        'posts':posts
    })

def update_post(request, post_id):
    if request.method == 'PUT':
        post = Post.objects.get(id=post_id)
        body = json.loads(request.body)
        content = body.get('input-post')
        post.content = content
        if len(content) > 0:
            if content.strip():
                post.save()

        data = {
                'success': True,
                'post':post.content,
            }

        return JsonResponse(data)

    return JsonResponse({'error': 'Update failed'})


def like(request):
    posts = Post.objects.all()
    if request.method == 'POST':
        post_id = request.POST.get('post-id')
        post = get_object_or_404(Post, id=post_id)

        # Check if the user has already liked this post
        user = request.user
        like, created = Like.objects.get_or_create(user=user, post=post)
        
        if not created:
            red_heart_class = "red-heart"
            # The user has already liked this post, so remove the like
            like.delete()
            post.likes -= 1
        else:
            red_heart_class = "like-form"
            # The user has not yet liked this post, so add a new like
            post.likes += 1
        post.save()
        return JsonResponse({'success': True, 'likes': post.likes,'user_liked':created})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})


def follow_unfollow_user(request):
    posts=Post.objects.all()
    if request.method == 'POST':
        follow_unfollow_request = request.method
        user_followed = request.POST.get('user_followed').lower()
        user_followed_model = User.objects.get(username__iexact=user_followed)
        follower = request.user
   

        # Check if follower and followed_user_model are the same
        existing_follower_views = Follower.objects.filter(follower=request.user,following=user_followed_model).exists()
        existing_follower = False
         
        if existing_follower_views:
            existing_follower = True
            

        request.session['existing_follower'] = existing_follower
        


        if follower == user_followed_model:
            pass
        elif existing_follower_views:
            # Unfollow user
            removeFollower = Follower.objects.filter(follower=follower, following=user_followed_model).delete()
            follower.following_count -= 1
            user_followed_model.follower_count -= 1
            follower.save()
            user_followed_model.save()
        
        else:
            # Follow the user
            addFollower = Follower.objects.create(follower=follower, following=user_followed_model)
            follower.following_count += 1
            user_followed_model.follower_count += 1
            follower.save()
            user_followed_model.save()
            

        follower_count_data = follower.following_count  
        following_count_data = user_followed_model.follower_count

        

        data = {
            'follower_count_data': follower_count_data,
            'following_count_data':following_count_data,
            'existing_follower':existing_follower
        }

       

        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Invalid request method'})
        return render(request,"network/index.html",{
                'follower_count_data': follower_count_data,
                'following_count_data':following_count_data,

            })

def get_following_count(request):
    follower_count = request.user.follower_count
    following_count = request.user.following_count

    data = {
        'followerCount': follower_count,
        'followingCount': following_count
    }
    
    return JsonResponse(data)

def profile(request):
    following_count = request.user.following_count
    follower_count = request.user.follower_count
    profile_posts = []  # Initialize an empty list

    posts_of_user = Post.objects.filter(user=request.user.id).order_by('-date')
    for post in posts_of_user:
        profile_posts.append(post)  # Add each post to the list


    liked_posts = []

    if request.user.is_authenticated:
        for post in posts_of_user:
            like = Like.objects.filter(user=request.user, post=post).exists()
            if like:
                liked_posts.append(post.id)
    #################################################
        paginator = Paginator(profile_posts,10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        num_posts = len(page_obj)
    ################################################

    return render(request, "network/profile.html", {
        'page_obj': page_obj,
        'liked_posts':liked_posts,
        'follower_count':follower_count,
        'following_count':following_count,
        'num_posts':num_posts
    })

def profile_of_users(request,username):
    user_following_json = ''  

    if request.user.is_authenticated:    
        followers = Follower.objects.filter(follower=request.user)
        user_following = []

        for follower in followers:
            user_following.append(follower.following.username)
            user_following_json = json.dumps(user_following)
            request.session['user_following_json'] = user_following_json

    user_profile = User.objects.get(username=username)
    following_count = user_profile.following_count
    follower_count = user_profile.follower_count
    profile_posts = []  

    posts_of_user = Post.objects.filter(user=user_profile.id).order_by('-date')
    for post in posts_of_user:
        profile_posts.append(post) 

    liked_posts = []

    if request.user.is_authenticated:
        for post in posts_of_user:
            like = Like.objects.filter(user=request.user, post=post).exists()
            if like:
                liked_posts.append(post.id)
    #################################################
        paginator = Paginator(profile_posts,10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        num_posts = len(page_obj)
    ################################################

    return render(request,"network/profile_of_users.html",{
        'page_obj': page_obj,
        'liked_posts':liked_posts,
        'follower_count':follower_count,
        'following_count':following_count,
        'user_profile':user_profile,
        'user_following_json':user_following_json,
        'user_following':user_following,
        'username':username,
        'num_posts':num_posts
        })

def all_posts(request):
    posts = Post.objects.all().order_by('-date')
    #############################################
    # PAGINATOR
    paginator = Paginator(posts,10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    num_posts = len(page_obj)
    #################################################
    liked_posts = []

    if request.user.is_authenticated:
        for post in posts:
            like = Like.objects.filter(user=request.user, post=post).exists()
            if like:
                liked_posts.append(post.id)
    return render(request, "network/all_posts.html", {
        'page_obj': page_obj,
        'liked_posts':liked_posts,
        'num_posts':num_posts
    })


def following(request):
    user_following_json = ''  # Initialize with an empty string

    if request.user.is_authenticated:    
        followers = Follower.objects.filter(follower=request.user)
        user_following = []
 
        for follower in followers:
            user_following.append(follower.following.username)
            user_following_json = json.dumps(user_following)
            request.session['user_following_json'] = user_following_json

    followed_users = Follower.objects.filter(follower=request.user.id)
    posts = Post.objects.all().order_by('-date')
    posts_followed = []  # Initialize an empty list

    for following in followed_users:
        posts_of_followed = Post.objects.filter(user=following.following.id).order_by('-date')
        for post in posts_of_followed:
    
            posts_followed.append(post)  # Add each post to the list

    liked_posts = []

    if request.user.is_authenticated:
        for post in posts:
            like = Like.objects.filter(user=request.user, post=post).exists()
            if like:
                liked_posts.append(post.id)

    user_counts = User.objects.all()
    user_list = {}

    for user in user_counts:
        user_data = {
            'username': user.username,
            'follower_count': user.follower_count,
            'following_count': user.following_count
        }
        user_list[user.username] = user_data
    user_json = json.dumps(user_list)

    #################################################
    paginator = Paginator(posts_followed,10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    num_posts = len(page_obj)
    ################################################



    return render(request, "network/following.html", {
        'page_obj': page_obj,
        'liked_posts':liked_posts,
        'user_json':user_json,
        'user_following_json':user_following_json,
        'num_posts':num_posts
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


