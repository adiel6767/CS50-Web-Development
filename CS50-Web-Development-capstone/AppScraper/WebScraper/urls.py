from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .import views
router = DefaultRouter()
router.register(r'scraped-data',views.ScrapedDataJsonViewSet,basename='scraped-data' )

urlpatterns = [
    
    path('sign-up/', views.UserRegister.as_view(), name='register'),
	path('login/', views.UserLogin.as_view(), name='login'),
	path('logout/', views.UserLogout.as_view(), name='logout'),
	path('user/', views.UserView.as_view(), name='user'),
    path('api/endpoint/', views.RunScraper.as_view(), name='runscraper'),
	path('user-data/',include(router.urls)),
	path('savedata/',views.SaveData.as_view(),name='savedata'),
	path('delete-data/', views.DeleteDataView.as_view(), name='delete_data')
]

