# Generated by Django 5.1.2 on 2024-10-20 19:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guest',
            name='preferences',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.preferences'),
        ),
    ]
