from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0021_competitive_dynamic_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="reportnote",
            name="author",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="confidence",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="date_generated",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="insights",
            field=models.JSONField(default=list, help_text="Key insights list"),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="key_metrics",
            field=models.JSONField(default=list, help_text="Key metrics for report cards"),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="next_steps",
            field=models.JSONField(default=list, help_text="Next steps list"),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="recommendations",
            field=models.JSONField(default=list, help_text="Strategic recommendations list"),
        ),
        migrations.AddField(
            model_name="reportnote",
            name="summary",
            field=models.TextField(blank=True),
        ),
    ]
