from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0020_market_analysis_dynamic_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="competitor",
            name="employees",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="competitor",
            name="founded",
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="competitor",
            name="funding_stage",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="competitor",
            name="headquarters",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="competitor",
            name="key_products",
            field=models.JSONField(default=list, help_text="Key products"),
        ),
        migrations.AddField(
            model_name="competitor",
            name="last_funding",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="competitor",
            name="revenue",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="competitor",
            name="target_markets",
            field=models.JSONField(default=list, help_text="Target markets"),
        ),
        migrations.AddField(
            model_name="competitiveadvantage",
            name="competitor_response",
            field=models.JSONField(default=list, help_text="Potential competitor responses"),
        ),
        migrations.AddField(
            model_name="competitiveadvantage",
            name="strategic_importance",
            field=models.CharField(blank=True, choices=[("critical", "Critical"), ("important", "Important"), ("moderate", "Moderate")], max_length=20),
        ),
        migrations.AddField(
            model_name="competitiveadvantage",
            name="time_to_replicate",
            field=models.IntegerField(blank=True, help_text="Months to replicate", null=True),
        ),
        migrations.AddField(
            model_name="marketposition",
            name="movement",
            field=models.CharField(blank=True, choices=[("rising", "Rising"), ("stable", "Stable"), ("declining", "Declining")], max_length=30),
        ),
        migrations.AddField(
            model_name="marketposition",
            name="price_score",
            field=models.IntegerField(blank=True, help_text="Price score 1-10", null=True),
        ),
        migrations.AddField(
            model_name="marketposition",
            name="quadrant",
            field=models.CharField(blank=True, choices=[("leader", "Leader"), ("challenger", "Challenger"), ("niche", "Niche"), ("follower", "Follower")], max_length=30),
        ),
        migrations.AddField(
            model_name="marketposition",
            name="value_score",
            field=models.IntegerField(blank=True, help_text="Value score 1-10", null=True),
        ),
        migrations.AddField(
            model_name="marketstrategyrecommendation",
            name="expected_impact",
            field=models.CharField(blank=True, choices=[("high", "High"), ("medium", "Medium"), ("low", "Low")], max_length=20),
        ),
        migrations.AddField(
            model_name="marketstrategyrecommendation",
            name="implementation_complexity",
            field=models.CharField(blank=True, choices=[("high", "High"), ("medium", "Medium"), ("low", "Low")], max_length=20),
        ),
        migrations.AddField(
            model_name="marketstrategyrecommendation",
            name="risks",
            field=models.JSONField(default=list, help_text="Key implementation risks"),
        ),
        migrations.AddField(
            model_name="marketstrategyrecommendation",
            name="timeframe",
            field=models.CharField(blank=True, choices=[("immediate", "Immediate"), ("short-term", "Short Term"), ("long-term", "Long Term")], max_length=30),
        ),
        migrations.AddField(
            model_name="productcomparison",
            name="strengths",
            field=models.JSONField(default=list, help_text="Competitor strengths"),
        ),
        migrations.AddField(
            model_name="productcomparison",
            name="weaknesses",
            field=models.JSONField(default=list, help_text="Competitor weaknesses"),
        ),
    ]
