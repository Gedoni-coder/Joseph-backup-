from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0019_competitor_competitor_type_markettrend_confidence"),
    ]

    operations = [
        migrations.AddField(
            model_name="industryinsight",
            name="action_items",
            field=models.JSONField(default=list, help_text="Recommended action items"),
        ),
        migrations.AddField(
            model_name="industryinsight",
            name="probability",
            field=models.IntegerField(blank=True, help_text="Probability percentage", null=True),
        ),
        migrations.AddField(
            model_name="industryinsight",
            name="timeframe",
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name="marketdemandforecast",
            name="current_demand",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="marketdemandforecast",
            name="key_factors",
            field=models.JSONField(default=list, help_text="Key demand factors"),
        ),
        migrations.AddField(
            model_name="marketdemandforecast",
            name="scenarios",
            field=models.JSONField(default=list, help_text="Demand scenarios"),
        ),
        migrations.AddField(
            model_name="markettrend",
            name="direction",
            field=models.CharField(
                choices=[("positive", "Positive"), ("negative", "Negative"), ("neutral", "Neutral")],
                default="positive",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="markettrend",
            name="sources",
            field=models.JSONField(default=list, help_text="Reference sources"),
        ),
        migrations.AddField(
            model_name="markettrend",
            name="timeframe",
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
