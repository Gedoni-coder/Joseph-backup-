from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='BusinessMetric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(choices=[('Financial', 'Financial'), ('Customer', 'Customer'), ('Sales & Marketing', 'Sales & Marketing'), ('Operational', 'Operational'), ('HR & Employee', 'HR & Employee'), ('Project & Product', 'Project & Product'), ('Innovation & Growth', 'Innovation & Growth'), ('Digital & IT', 'Digital & IT')], max_length=50)),
                ('metric', models.CharField(max_length=100)),
                ('current', models.CharField(max_length=50)),
                ('target', models.CharField(max_length=50)),
                ('last_month', models.CharField(blank=True, max_length=50)),
                ('trend', models.CharField(blank=True, max_length=20)),
                ('change', models.CharField(max_length=50)),
                ('status', models.CharField(choices=[('good', 'Good'), ('fair', 'Fair'), ('excellent', 'Excellent')], max_length=20)),
            ],
            options={
                'ordering': ['category', 'metric'],
            },
        ),
    ]
