from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_competitor_current_price_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pricesetting',
            name='algorithm',
            field=models.CharField(
                choices=[
                    ('ai-driven', 'AI Driven'),
                    ('demand-based', 'Demand Based'),
                    ('competitor-based', 'Competitor Based'),
                    ('rule-based', 'Rule Based'),
                ],
                default='rule-based',
                max_length=30,
            ),
        ),
        migrations.AddField(
            model_name='pricesetting',
            name='factors',
            field=models.JSONField(default=list, help_text='Dynamic pricing factors for this product'),
        ),
        migrations.AddField(
            model_name='pricesetting',
            name='history',
            field=models.JSONField(default=list, help_text='Price change history log'),
        ),
        migrations.AddField(
            model_name='pricesetting',
            name='next_update',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
