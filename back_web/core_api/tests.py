import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Job


class JobApplicationAPITests(TestCase):
	def setUp(self):
		self.media_directory = tempfile.TemporaryDirectory()
		self.media_settings = override_settings(MEDIA_ROOT=self.media_directory.name)
		self.media_settings.enable()
		self.client = APIClient()
		self.job = Job.objects.create(
			title="Frontend Developer",
			description="Build product interfaces.",
			experience_required="2 years",
			skills_required="React",
			location="Remote",
		)

	def tearDown(self):
		self.media_settings.disable()
		self.media_directory.cleanup()

	def test_multipart_application_is_saved_and_listed(self):
		response = self.client.post(
			"/job-applications/",
			{
				"job": self.job.id,
				"first_name": "Ada",
				"last_name": "Lovelace",
				"position": "Frontend Developer",
				"education": "Computer Science",
				"skill_set": "React, Python",
				"certification": "",
				"email": "ada@example.com",
				"contact": "+1234567890",
				"linkedin_id": "https://linkedin.com/in/ada",
				"experience": "2 years",
				"cover_letter": "I enjoy building useful products.",
				"resume": SimpleUploadedFile(
					"resume.pdf", b"%PDF-1.4 test", content_type="application/pdf"
				),
			},
			format="multipart",
		)

		self.assertEqual(response.status_code, 201, response.data)
		self.assertEqual(response.data["cover_letter"], "I enjoy building useful products.")
		self.assertTrue(response.data["resume"].endswith("resume.pdf"))

		list_response = self.client.get("/job-applications/")
		self.assertEqual(list_response.status_code, 200)
		self.assertEqual(list_response.data[0]["first_name"], "Ada")
		self.assertEqual(list_response.data[0]["last_name"], "Lovelace")
