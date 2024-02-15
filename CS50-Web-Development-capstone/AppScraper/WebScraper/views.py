from django.contrib.auth import login,logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserSerializer,UserLoginSerializer,ScrapedDataSerializer,DeleteDataSerializer
from rest_framework import permissions, status, viewsets
from .validations import custom_validation,validate_username,validate_password
from .models import ScrapedDataJson
import json
import subprocess
import os


project_directory = 'WebScraper/scrapy_spider/scrapy_spider/spiders'
os.chdir(project_directory)


class RunScraper(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        if request.method == 'POST':
            Json_Response = request.data
            print('jsonresponse',Json_Response)

            url = Json_Response["Url"]
            css = Json_Response['CssSelector']
            textselect = '::text,'.join([item['TextSelector'] for item in Json_Response['TextSelectorFields'] if 'TextSelector' in item])
            discriptivenames = ','.join([item['DescriptiveName'] for item in Json_Response['DescriptiveFields'] if 'DescriptiveName' in item])
            follow_next = Json_Response["follow_next"]

            if follow_next:
                print('follownext',follow_next)
                command = f'python -m scrapy crawl biki -a url="{url}" -a css_selector="{css}" -a params="{textselect}"::text -a generic_names="{discriptivenames}" -a follow_next="{follow_next}" -O biki.json'
            else:
                command = f'python -m scrapy crawl biki2 -a url={url} -a css_selector={css} -a params={textselect}::text -a generic_names={discriptivenames} -O biki.json'

            subprocess.run(command, shell=True)
            
            with open('biki.json', 'r', encoding='utf-8') as f:
                scraped_data = json.load(f)
                return Response(scraped_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)




class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_username(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)

class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class ScrapedDataJsonViewSet(viewsets.ModelViewSet):
	serializer_class = ScrapedDataSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		user = self.request.user
		return ScrapedDataJson.objects.filter(user=user)
	
	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

class SaveData(APIView):
	def post(self, request):
		if request.method == 'POST':
			user_instance = request.user
			url = request.data.get('url','')
			title = request.data.get('title','')
			print('title',title)
			print("URL: ",url)
			scraped_data = request.data.get('scraped_data',{})

			try:
				existing_record = ScrapedDataJson.objects.get(user=user_instance,title=title)
				existing_record.json_data = scraped_data
				existing_record.save()

				return Response('success data overwriten', status=status.HTTP_200_OK)
			except ScrapedDataJson.DoesNotExist:

				data = ScrapedDataJson.objects.create(user=user_instance, url=url, json_data=scraped_data, title=title)
				data.save()
				response_data = {'message':"Data saved successfully"}

			return Response(response_data, status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class DeleteDataView(APIView):
	def post(self, request, *args, **kwargs):
		serializer = DeleteDataSerializer(data=request.data)

		if serializer.is_valid():
			obj_id = serializer.validated_data['id']

			try:
				data_to_delete = ScrapedDataJson.objects.get(id=obj_id)
				data_to_delete.delete()

				return Response({'success delete':True}, status=status.HTTP_200_OK)		
			except ScrapedDataJson.DoesNotExist:
				return Response({'success':False,'message':'Record not found'}, status=status.HTTP_404_NOT_FOUND)
		else:
			return Response({'success':False, 'errors':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
