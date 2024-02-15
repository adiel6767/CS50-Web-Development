from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import User
from .models import ScrapedDataJson

UserModel = get_user_model()
 
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, validated_data):
        # Extract username, email, and password from the validated data
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')

        # Create a user with the provided data
        user_obj = UserModel.objects.create_user(username=username, email=email, password=password)

        return user_obj


class UserLoginSerializer(serializers.Serializer):
    # email = serializers.EmailField()
    password = serializers.CharField()
    username = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        if user is None:
            raise serializers.ValidationError('User not found or incorrect password.')
        return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')

class ScrapedDataSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = ScrapedDataJson
        fields = ['id','title','created_at','url','json_data','user','user_username']

    def get_user_username(self,obj):
        return obj.user.username

class DeleteDataSerializer(serializers.Serializer):
    id = serializers.IntegerField()

    def validate_id(self, value):
        try:
            ScrapedDataJson.objects.get(id=value)
        except ScrapedDataJson.DoesNotExist:
            raise serializers.ValidationError('Object with this ID does not exist.')
        return value