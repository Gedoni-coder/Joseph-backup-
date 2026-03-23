from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_documentprocessingevent'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='extracted_text',
            field=models.TextField(blank=True),
        ),
        migrations.CreateModel(
            name='Insight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.TextField()),
                ('key_points', models.JSONField(default=list)),
                ('keywords', models.JSONField(default=list)),
                ('entities', models.JSONField(default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('document', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='insight', to='api.document')),
            ],
            options={
                'ordering': ['-updated_at', '-id'],
            },
        ),
    ]
