# Generated by Django 4.1.1 on 2023-04-27 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_remove_post_likes_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='post',
            name='content',
            field=models.CharField(blank=True, default='', max_length=250),
        ),
        migrations.DeleteModel(
            name='Like',
        ),
    ]
