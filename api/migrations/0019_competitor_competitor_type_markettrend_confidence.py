from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_marketdemandforecast_marketstrategyrecommendation'),
    ]

    operations = [
        migrations.AddField(
            model_name='competitor',
            name='competitor_type',
            field=models.CharField(
                choices=[
                    ('direct', 'Direct'),
                    ('indirect', 'Indirect'),
                    ('substitute', 'Substitute'),
                ],
                default='direct',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='markettrend',
            name='confidence',
            field=models.IntegerField(default=80, help_text='Confidence percentage'),
        ),
    ]
