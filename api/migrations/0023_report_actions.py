from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0022_report_note_dynamic_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="ReportActionPlan",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("report_title", models.CharField(blank=True, max_length=300)),
                ("title", models.CharField(max_length=300)),
                ("description", models.TextField()),
                ("priority", models.CharField(choices=[("low", "Low"), ("medium", "Medium"), ("high", "High"), ("critical", "Critical")], default="medium", max_length=20)),
                ("owner", models.CharField(blank=True, max_length=200)),
                ("timeline", models.CharField(choices=[("immediate", "Immediate (0-1 week)"), ("short-term", "Short-term (1-3 months)"), ("medium-term", "Medium-term (3-6 months)"), ("long-term", "Long-term (6+ months)")], default="short-term", max_length=20)),
                ("target_date", models.DateField()),
                ("budget", models.CharField(blank=True, max_length=120)),
                ("resources", models.TextField(blank=True)),
                ("success_metrics", models.TextField(blank=True)),
                ("risks", models.TextField(blank=True)),
                ("mitigation", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("report_note", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="action_plans", to="api.reportnote")),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="ReportEngagementEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action_type", models.CharField(choices=[("generated_pdf", "Generated PDF"), ("exported_csv", "Exported CSV"), ("shared", "Shared")], max_length=30)),
                ("channel", models.CharField(blank=True, max_length=50)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("report_note", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="engagement_events", to="api.reportnote")),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
