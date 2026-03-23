from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0027_pricesetting_dynamic_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="BudgetValidationSummary",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("accuracy_score", models.FloatField(default=0)),
                ("avg_variance", models.FloatField(default=0)),
                ("validated_forecasts", models.IntegerField(default=0)),
                ("budget_alignment", models.FloatField(default=0)),
                ("generated_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["-generated_at", "-id"],
            },
        ),
        migrations.CreateModel(
            name="ForecastValidationRecord",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("period", models.CharField(max_length=50)),
                (
                    "validation_status",
                    models.CharField(
                        choices=[
                            ("accurate", "Accurate"),
                            ("acceptable", "Acceptable"),
                            ("concerning", "Concerning"),
                            ("pending", "Pending"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("forecasted_revenue", models.FloatField(default=0)),
                ("actual_revenue", models.FloatField(blank=True, null=True)),
                ("revenue_variance", models.FloatField(default=0)),
                ("forecasted_net_income", models.FloatField(default=0)),
                ("actual_net_income", models.FloatField(blank=True, null=True)),
                ("accuracy_score", models.FloatField(default=0)),
                ("sort_order", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["sort_order", "period", "id"],
            },
        ),
        migrations.CreateModel(
            name="BudgetAlignmentMetric",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150)),
                ("score", models.FloatField(default=0)),
                ("sort_order", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["sort_order", "name", "id"],
            },
        ),
        migrations.CreateModel(
            name="ForecastImprovementArea",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("summary", models.CharField(max_length=300)),
                (
                    "icon",
                    models.CharField(
                        choices=[
                            ("trending-up", "Trending Up"),
                            ("alert-circle", "Alert Circle"),
                            ("calendar", "Calendar"),
                        ],
                        default="trending-up",
                        max_length=30,
                    ),
                ),
                (
                    "theme",
                    models.CharField(
                        choices=[("green", "Green"), ("yellow", "Yellow"), ("blue", "Blue")],
                        default="blue",
                        max_length=20,
                    ),
                ),
                (
                    "sections",
                    models.JSONField(
                        default=list,
                        help_text="List of narrative sections with heading/body/bullets.",
                    ),
                ),
                ("recommended_action", models.TextField()),
                ("sort_order", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
    ]
