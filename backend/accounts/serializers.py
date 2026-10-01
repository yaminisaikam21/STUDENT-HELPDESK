from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = [
            'roll_number',
            'department',
            'hostel',
            'room_number',
            'phone',
            'guardian_name',
            'guardian_phone'
        ]


class UserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone',
            'student_profile',
            'is_active',
            'date_joined'
        ]
        read_only_fields = [
            'id',
            'role',
            'is_active',
            'date_joined'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    roll_number = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    department = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    hostel = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    room_number = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    guardian_name = serializers.CharField(
        required=True
    )

    guardian_phone = serializers.CharField(
        required=True
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'confirm_password',
            'first_name',
            'last_name',
            'phone',
            'roll_number',
            'department',
            'hostel',
            'room_number',
            'guardian_name',
            'guardian_phone'
        ]

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        roll_number = validated_data.pop(
            'roll_number',
            ''
        )

        department = validated_data.pop(
            'department',
            ''
        )

        hostel = validated_data.pop(
            'hostel',
            ''
        )

        room_number = validated_data.pop(
            'room_number',
            ''
        )

        guardian_name = validated_data.pop(
            'guardian_name'
        )

        guardian_phone = validated_data.pop(
            'guardian_phone'
        )

        # Public registration creates STUDENT accounts exclusively
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role='STUDENT'
        )

        StudentProfile.objects.create(
            user=user,
            roll_number=roll_number,
            department=department,
            hostel=hostel,
            room_number=room_number,
            phone=user.phone,
            guardian_name=guardian_name,
            guardian_phone=guardian_phone
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError(
                "Both username and password are required."
            )

        user = authenticate(
            username=username,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid credentials. Please verify username and password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is disabled."
            )

        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)

    new_password = serializers.CharField(
        required=True,
        min_length=6
    )


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    roll_number = serializers.CharField(
        required=False,
        allow_blank=True
    )

    department = serializers.CharField(
        required=False,
        allow_blank=True
    )

    hostel = serializers.CharField(
        required=False,
        allow_blank=True
    )

    room_number = serializers.CharField(
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User

        fields = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'roll_number',
            'department',
            'hostel',
            'room_number'
        ]

    def update(self, instance, validated_data):
        profile_fields = [
            'roll_number',
            'department',
            'hostel',
            'room_number'
        ]

        profile_data = {
            field: validated_data.pop(field)
            for field in profile_fields
            if field in validated_data
        }

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if instance.role == 'STUDENT':
            profile, _ = StudentProfile.objects.get_or_create(
                user=instance
            )

            for attr, value in profile_data.items():
                setattr(profile, attr, value)

            if 'phone' in validated_data:
                profile.phone = validated_data['phone']

            profile.save()

        return instance


class WardenCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
            'confirm_password',
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            password=validated_data['password'],
            role='WARDEN'
        )

        return user
    


class AdminStudentCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=6
    )

    roll_number = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    department = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    hostel = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    room_number = serializers.CharField(
        required=False,
        allow_blank=True,
        default=''
    )

    guardian_name = serializers.CharField(
        required=True
    )

    guardian_phone = serializers.CharField(
        required=True
    )

    class Meta:
        model = User

        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
            'confirm_password',
            'roll_number',
            'department',
            'hostel',
            'room_number',
            'guardian_name',
            'guardian_phone',
        ]

    def validate(self, data):

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        return data

    def create(self, validated_data):

        validated_data.pop('confirm_password')

        roll_number = validated_data.pop(
            'roll_number',
            ''
        )

        department = validated_data.pop(
            'department',
            ''
        )

        hostel = validated_data.pop(
            'hostel',
            ''
        )

        room_number = validated_data.pop(
            'room_number',
            ''
        )

        guardian_name = validated_data.pop(
            'guardian_name'
        )

        guardian_phone = validated_data.pop(
            'guardian_phone'
        )

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            password=validated_data['password'],
            role='STUDENT'
        )

        StudentProfile.objects.create(
            user=user,
            roll_number=roll_number,
            department=department,
            hostel=hostel,
            room_number=room_number,
            phone=user.phone,
            guardian_name=guardian_name,
            guardian_phone=guardian_phone
        )

        return user