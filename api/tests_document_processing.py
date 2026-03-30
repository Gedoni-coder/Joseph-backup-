import os
from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import Document, DocumentProcessingEvent, Insight
from agent.tools.documents import process_text_document


class DocumentProcessingToolTests(APITestCase):
    def test_process_text_document_prefers_semantic_document_type(self):
        result = process_text_document(
            (
                "Invoice Number: INV-1001\n"
                "Date: March 30, 2026\n"
                "Total Amount Due: $4,250.00\n"
                "Remit To: Acme Supply LLC\n"
            ),
            filename="invoice.txt",
            enrich_with_llm=False,
            skip_scan=True,
        )

        self.assertTrue(result.success)
        self.assertEqual(result.structured_output["document"]["document_type"], "invoice")
        self.assertEqual(result.structured_output["document"]["category"], "financial")
        self.assertIn("USD 4,250.00", result.structured_output["document"]["summary"])
        self.assertNotIn("USD 2,026", result.structured_output["document"]["summary"])

    def test_process_text_document_skips_llm_without_key(self):
        with patch.dict(os.environ, {"GROQ_API_KEY": ""}, clear=False):
            result = process_text_document(
                "Quarterly meeting notes with action items and next steps.",
                filename="meeting-notes.txt",
                enrich_with_llm=True,
                skip_scan=True,
            )

        self.assertTrue(result.success)
        self.assertIsNotNone(result.llm_enrichment)
        self.assertTrue(result.llm_enrichment["skipped"])
        self.assertEqual(result.llm_enrichment["provider"], "groq")


class DocumentProcessingApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="docuser", password="pass1234")
        self.client.force_authenticate(self.user)

    def test_upload_runs_pipeline_and_creates_insights(self):
        upload = SimpleUploadedFile(
            "invoice.txt",
            (
                b"Invoice Number: INV-2002\n"
                b"Date: 03/25/2026\n"
                b"Total Amount Due: $1,250.00\n"
                b"Vendor: Northwind Industrial\n"
                b"Buyer: Joseph AI Pilot\n"
            ),
            content_type="text/plain",
        )

        response = self.client.post(
            "/api/business/documents/",
            {
                "title": "Pilot Invoice",
                "file": upload,
                "metadata": '{"category":"General","tags":["txt","uploaded"]}',
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        document = Document.objects.get(title="Pilot Invoice")
        insight = Insight.objects.get(document=document)
        events = DocumentProcessingEvent.objects.filter(document=document)

        self.assertEqual(document.get_status(), "Processed")
        self.assertEqual(document.metadata.get("document_type"), "invoice")
        self.assertEqual(document.metadata.get("category"), "General")
        self.assertIn("processed", document.metadata.get("tags", []))
        self.assertTrue(insight.summary)
        self.assertGreaterEqual(events.count(), 5)
