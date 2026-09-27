from rest_framework import serializers
from .models import Developer, Project, Resource,DemoBooking,PerformanceReview,Job,JobApplication,Client,Customer,ProjectAsset,ProjectDeveloper,Documentation,SiteSettings,InterviewProcess,ProjectImage,Footer,NavbarLink,HeroSection,Contact,ContactMessage
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Max

class DeveloperSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    profile_image_file = serializers.ImageField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Developer
        fields = '__all__'
    
    def get_profile_image(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None
    
    def update(self, instance, validated_data):
        profile_image_file = validated_data.pop('profile_image_file', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Handle profile image file upload
        if profile_image_file:
            instance.profile_image = profile_image_file
        
        instance.save()
        return instance
    
    def create(self, validated_data):
        profile_image_file = validated_data.pop('profile_image_file', None)
        
        # Create instance with other fields
        instance = Developer.objects.create(**validated_data)
        
        # Handle profile image file upload
        if profile_image_file:
            instance.profile_image = profile_image_file
            instance.save()
        
        return instance

class ProjectAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAsset
        fields = "__all__"

class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'alt_text', 'is_featured', 'created_at', 'order']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ProjectDeveloperSerializer(serializers.ModelSerializer):

    developer_name = serializers.CharField(
        source="developer.name",
        read_only=True
    )

    developer_profile_image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectDeveloper
        fields = ["developer", "developer_name", "developer_profile_image", "role","member_type"]

    def get_developer_profile_image(self, obj):
        if obj.developer.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.developer.profile_image.url)
            return obj.developer.profile_image.url
        return None

import json

import json
from rest_framework import serializers
from .models import Project, ProjectAsset, ProjectDeveloper


class ProjectSerializer(serializers.ModelSerializer):

    assets = ProjectAssetSerializer(
        many=True,
        read_only=True
    )

    project_images = ProjectImageSerializer(
        many=True,
        read_only=True
    )

    project_developers = ProjectDeveloperSerializer(
        source="projectdeveloper_set",
        many=True,
        read_only=True   # 
    )

    project_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"

    def get_project_image(self, obj):
        # Try to get featured image from project_images first
        featured_image = obj.project_images.filter(is_featured=True).first()
        if featured_image and featured_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(featured_image.image.url)
            return featured_image.image.url
        
        # Fallback to first image in project_images
        first_image = obj.project_images.first()
        if first_image and first_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        
        # Fallback to legacy project_image field
        if obj.project_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.project_image.url)
            return obj.project_image.url
        return None

    def create(self, validated_data):

        request = self.context.get("request")

        # 1 Create Project
        project = Project.objects.create(**validated_data)

        # 2 Handle Assets
        files = request.FILES.getlist("assets")

        ProjectAsset.objects.bulk_create([
            ProjectAsset(
                project=project,
                asset_name=file.name,
                asset_type="IMAGE",
                file=file
            )
            for file in files
        ])

        # 3 Handle Project Images (new multiple image system)
        image_files = request.FILES.getlist("project_images")
        
        for i, image_file in enumerate(image_files):
            # First image is marked as featured if no other featured image exists
            is_featured = (i == 0 and not project.project_images.filter(is_featured=True).exists())
            
            ProjectImage.objects.create(
                project=project,
                image=image_file,
                alt_text=f"{project.title} - Image {i+1}",
                is_featured=is_featured,
                order=i
            )

        # 4 Handle Developers (Manual Parse)
        developers_data = request.data.getlist("project_developers")

        project_developer_objects = []

        for item in developers_data:
            parsed = json.loads(item)

            project_developer_objects.append(
                ProjectDeveloper(
                    project=project,
                    developer_id=parsed["developer"],  # use _id here
                    role=parsed["role"],
                    member_type=parsed["member_type"]
                )
            )

        ProjectDeveloper.objects.bulk_create(project_developer_objects)

        return project
    def update(self, instance, validated_data):

        request = self.context.get("request")

        # 1 Update normal fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # 2 ALWAYS process developers (even if empty)
        developers_data = request.data.getlist("project_developers")

        ProjectDeveloper.objects.filter(project=instance).delete()

        lead_count = 0
        new_objects = []

        for item in developers_data:
            parsed = json.loads(item)

            if parsed.get("member_type") == "LEAD":
                lead_count += 1

            new_objects.append(
                ProjectDeveloper(
                    project=instance,
                    developer_id=parsed["developer"],
                    role=parsed["role"],
                    member_type=parsed["member_type"]
                )
            )

        if lead_count > 1:
            raise serializers.ValidationError(
                "Only one Team Lead allowed per project."
            )

        ProjectDeveloper.objects.bulk_create(new_objects)
        

        # 3 Handle new images (multiple image system)
        image_files = request.FILES.getlist("project_images")
        
        # Get current max order for this project
        max_order = instance.project_images.aggregate(Max('order'))['order__max'] or 0
        
        for i, image_file in enumerate(image_files):
            # Mark as featured if it's the first image and no featured image exists
            is_featured = (max_order == 0 and i == 0 and not instance.project_images.filter(is_featured=True).exists())
            
            ProjectImage.objects.create(
                project=instance,
                image=image_file,
                alt_text=f"{instance.title} - Image {max_order + i + 1}",
                is_featured=is_featured,
                order=max_order + i
            )

        # 4 Handle legacy assets (backwards compatibility)
        files = request.FILES.getlist("assets")

        for file in files:
            ProjectAsset.objects.create(
                project=instance,
                asset_name=file.name,
                asset_type="IMAGE",
                file=file
            )

        return instance


class ResourceSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source="author.name")
    thumbnail = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        
        model = Resource
        fields = "__all__"
        read_only_fields = ("created_at",)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        
        # Handle thumbnail removal
        if request and request.method in ['PUT', 'PATCH']:
            # Check for any of the removal flags from frontend
            if ('clear_thumbnail' in request.POST or 
                'remove_thumbnail' in request.POST or
                request.POST.get('thumbnail') == ''):
                
                # Delete the old image file if it exists
                if instance.thumbnail:
                    instance.thumbnail.delete(save=False)
                
                # Set thumbnail to None
                instance.thumbnail = None
                instance.save()
                
                # Remove thumbnail from validated_data to prevent override
                validated_data.pop('thumbnail', None)
        
        # Handle regular thumbnail upload
        thumbnail = validated_data.pop('thumbnail', None)
        if thumbnail is not None:
            instance.thumbnail = thumbnail
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    def validate(self, attrs):
        category = attrs.get("category", getattr(self.instance, "category", None))
        tool_type = attrs.get("tool_type", getattr(self.instance, "tool_type", None))
        content = attrs.get("content", "")

        if category == "TOOL":
            # TOOL does NOT require content
            if not tool_type:
                raise serializers.ValidationError({
                    "tool_type": "tool_type is required when category is TOOL."
                })
        else:
            # NON-TOOL requires content
            if not content:
                raise serializers.ValidationError({
                    "content": "Content is required for blogs, guides and glossary."
                })

        return attrs


class DemoBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        fields = '__all__'
        extra_kwargs = {
            'name': {'required': False},
            'email': {'required': False},
            'phone': {'required': False},
            'preferred_date': {'required': False},
            'project_type': {'required': False},
        }
        
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"
    
class PerformanceReviewSerializer(serializers.ModelSerializer):

    project_title = serializers.CharField(
        source="project.title",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = PerformanceReview
        fields = [
            "id",
            "project",
            "project_title",
            "reviewer_name",
            "rating",
            "feedback",
            "review_period",
            "created_at",
        ]
        read_only_fields = ["created_at"]
        extra_kwargs = {
            'project': {'required': False, 'allow_null': True}
        }


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = "__all__"


class CustomerSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = Customer
        fields = ["id", "email", "name", "phone", "password", "avatar_url", "auth_provider", "google_id", "github_id"]
        extra_kwargs = {
            "password": {"write_only": True, "required": False, "allow_null": True}
        }

    def validate_email(self, value):
        if Customer.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate_password(self, value):
        if value and len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        return value

    def create(self, validated_data):
        password = validated_data.get("password")
        if password:
            validated_data["password"] = make_password(password)
        return super().create(validated_data)


class CustomerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            customer = Customer.objects.get(email=data["email"])
        except Customer.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        # Check if customer uses social auth (no password)
        if not customer.password:
            raise serializers.ValidationError("This account uses social authentication. Please sign in with Google or GitHub.")

        if not check_password(data["password"], customer.password):
            raise serializers.ValidationError("Invalid credentials")

        data["customer"] = customer
        return data


class DocumentationSerializer(serializers.ModelSerializer):

    project_name = serializers.CharField(
        source="project.title",
        read_only=True
    )

    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    class Meta:
        model = Documentation
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_by",
            "created_by_username",
            "project_name",
        ]
class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"

class InterviewProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewProcess
        fields = "__all__"


class JobSerializer(serializers.ModelSerializer):
    is_expired = serializers.SerializerMethodField()
    interview_rounds = InterviewProcessSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Job
        fields = "__all__"

    def get_is_expired(self, obj):
        return obj.is_expired()


class FooterSerializer(serializers.ModelSerializer):
    """Serializer for Footer model"""
    
    class Meta:
        model = Footer
        fields = '__all__'
        
    def validate_social_links(self, value):
        """Validate that social_links is a proper JSON object"""
        if isinstance(value, str):
            try:
                import json
                return json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError("social_links must be valid JSON")
        return value


class NavbarLinkSerializer(serializers.ModelSerializer):
    """Serializer for NavbarLink model"""
    
    class Meta:
        model = NavbarLink
        fields = '__all__'


class HeroSectionSerializer(serializers.ModelSerializer):
    """Serializer for HeroSection model"""
    
    class Meta:
        model = HeroSection
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact model"""
    
    class Meta:
        model = Contact
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for ContactMessage model"""
    
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_read', 'is_archived', 'ip_address', 'user_agent']