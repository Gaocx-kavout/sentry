from __future__ import absolute_import

import six
from django.db import models
from django.utils import timezone

from sentry.db.models import Model
from django.utils.functional import cached_property

from sentry_relay import PublicKey


class Relay(Model):
    __core__ = True

    relay_id = models.CharField(max_length=64, unique=True)
    public_key = models.CharField(max_length=200)
    first_seen = models.DateTimeField(default=timezone.now)
    last_seen = models.DateTimeField(default=timezone.now)
    is_internal = models.BooleanField(default=False)

    class Meta:
        app_label = "sentry"
        db_table = "sentry_relay"

    @cached_property
    def public_key_object(self):
        return PublicKey.parse(self.public_key)

    def has_org_access(self, org):
        # Internal relays always have access
        if self.is_internal:
            return True

        trusted_relays = org.get_option("sentry:trusted-relays", [])
        key = six.text_type(self.public_key_object)

        for relay_info in trusted_relays:
            if relay_info is not None and relay_info.get(u"public_key") == key:
                return True

        return False

    @staticmethod
    def for_keys(keys):
        """
        Returns all the relays that are configured with one of the specified keys
        """
        return Relay.objects.filter(public_key__in=keys)
