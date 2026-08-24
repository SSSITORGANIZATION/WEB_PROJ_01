#!/usr/bin/env python
import os
import django
from django.conf import settings
from core_api.models import Project, ProjectAsset

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devhub_backend.settings')
django.setup()

def assign_project_images():
    """Assign project images from existing assets"""
    
    print("🔍 Looking for projects without images...")
    
    # Get projects without images
    projects_without_images = Project.objects.filter(project_image__isnull=True) | Project.objects.filter(project_image='')
    
    print(f"Found {projects_without_images.count()} projects without images")
    
    for project in projects_without_images:
        print(f"\n📁 Processing project: {project.title} (ID: {project.id})")
        
        # Get the first image asset for this project
        first_image_asset = project.assets.filter(asset_type='IMAGE').first()
        
        if first_image_asset:
            print(f"✅ Found image asset: {first_image_asset.asset_name}")
            
            # Copy the file from project_assets to project_image field
            if first_image_asset.file:
                project.project_image = first_image_asset.file
                project.save()
                print(f"🎉 Assigned image to project: {project.title}")
                print(f"   Image URL: {project.project_image.url if project.project_image else 'None'}")
            else:
                print(f"❌ Asset has no file: {first_image_asset.asset_name}")
        else:
            print(f"⚠️  No image assets found for project: {project.title}")
    
    print("\n🎯 Process completed!")
    
    # Show final status
    projects_with_images = Project.objects.exclude(project_image__isnull=True).exclude(project_image='')
    print(f"📊 Total projects with images: {projects_with_images.count()}")

if __name__ == "__main__":
    assign_project_images()
