from rest_framework import serializers
from .models import Outpass


class OutpassSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_roll = serializers.SerializerMethodField()
    student_hostel = serializers.SerializerMethodField()
    student_room = serializers.SerializerMethodField()
    student_phone = serializers.SerializerMethodField()
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = Outpass
        fields = [
            'id', 'student', 'student_name', 'student_roll', 'student_hostel',
            'student_room', 'student_phone', 'destination', 'reason', 'from_date',
            'to_date', 'parent_name', 'parent_contact', 'emergency_contact',
            'notes', 'status', 'verification_status', 'verification_notes',
            'reviewed_by', 'reviewer_name', 'reviewer_remarks', 'created_at', 'updated_at'
        ]

        read_only_fields = [
            'id',
            'student',
            'status',
            'verification_status',
            'verification_notes',
            'reviewed_by',
            'reviewer_remarks',
            'created_at',
            'updated_at'
        ]

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.username

    def get_student_roll(self, obj):
        if hasattr(obj.student, 'student_profile'):
            return obj.student.student_profile.roll_number
        return ""

    def get_student_hostel(self, obj):
        if hasattr(obj.student, 'student_profile'):
            return obj.student.student_profile.hostel
        return ""

    def get_student_room(self, obj):
        if hasattr(obj.student, 'student_profile'):
            return obj.student.student_profile.room_number
        return ""

    def get_student_phone(self, obj):
        return obj.student.phone

    def get_reviewer_name(self, obj):
        if obj.reviewed_by:
            return obj.reviewed_by.get_full_name() or obj.reviewed_by.username
        return ""


class OutpassCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outpass
        fields = [
            'destination',
            'reason',
            'from_date',
            'to_date',
            'parent_name',
            'parent_contact',
            'emergency_contact',
            'notes'
        ]

        extra_kwargs = {
            'parent_name': {
                'required': False,
                'allow_blank': True
            },
            'parent_contact': {
                'required': False,
                'allow_blank': True
            }
        }

    def validate(self, data):
        if data.get('from_date') and data.get('to_date'):
            if data['from_date'] >= data['to_date']:
                raise serializers.ValidationError({
                    "to_date": "Return date must be after departure date."
                })

        request = self.context.get('request')
        user = request.user if request else None

        if not user or not user.is_authenticated:
            raise serializers.ValidationError({
                "detail": "Authentication is required."
            })

        try:
            profile = user.student_profile
        except Exception:
            raise serializers.ValidationError({
                "parent_contact": "Student profile was not found."
            })

        guardian_phone = profile.guardian_phone.strip()

        if not guardian_phone:
            raise serializers.ValidationError({
                "parent_contact": (
                    "No registered guardian phone number was found. "
                    "Please contact the administrator."
                )
            })

        # Always use the registered guardian details
        data['parent_contact'] = guardian_phone

        if profile.guardian_name:
            data['parent_name'] = profile.guardian_name

        return data


class OutpassVerifyParentSerializer(serializers.Serializer):
    verification_status = serializers.ChoiceField(
        choices=['Verified', 'Failed']
    )

    verification_notes = serializers.CharField(
        required=False,
        allow_blank=True
    )


class OutpassReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=['Approved', 'Rejected']
    )

    reviewer_remarks = serializers.CharField(
        required=False,
        allow_blank=True
    )