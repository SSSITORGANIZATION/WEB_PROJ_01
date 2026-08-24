from django.core.management.base import BaseCommand
from core_api.models import Project, ProjectAsset

class Command(BaseCommand):
    help = 'Assign project images from existing assets'

    def handle(self, *args, **options):
        self.stdout.write("🔍 Looking for projects without images...")
        
        # Get projects without images
        projects_without_images = Project.objects.filter(project_image__isnull=True) | Project.objects.filter(project_image='')
        
        self.stdout.write(f"Found {projects_without_images.count()} projects without images")
        
        for project in projects_without_images:
            self.stdout.write(f"\n📁 Processing project: {project.title} (ID: {project.id})")
            
            # Get the first image asset for this project
            first_image_asset = project.assets.filter(asset_type='IMAGE').first()
            
            if first_image_asset:
                self.stdout.write(f"✅ Found image asset: {first_image_asset.asset_name}")
                
                # Copy the file from project_assets to project_image field
                if first_image_asset.file:
                    project.project_image = first_image_asset.file
                    project.save()
                    self.stdout.write(self.style.SUCCESS(f"🎉 Assigned image to project: {project.title}"))
                    self.stdout.write(f"   Image URL: {project.project_image.url if project.project_image else 'None'}")
                else:
                    self.stdout.write(self.style.ERROR(f"❌ Asset has no file: {first_image_asset.asset_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️  No image assets found for project: {project.title}"))
        
        self.stdout.write("\n🎯 Process completed!")
        
        # Show final status
        projects_with_images = Project.objects.exclude(project_image__isnull=True).exclude(project_image='')
        self.stdout.write(f"📊 Total projects with images: {projects_with_images.count()}")
