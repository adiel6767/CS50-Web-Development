# Generated by Django 4.1.1 on 2023-05-15 12:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0015_remove_post_like_by_follower'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='follower',
            unique_together=set(),
        ),
    ]
