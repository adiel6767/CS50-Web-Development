# Generated by Django 4.1.1 on 2023-03-10 16:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0002_auction_listing_categorie_watchlist_listingcreator_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='auction_listing',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='won_auctions', to=settings.AUTH_USER_MODEL),
        ),
    ]
