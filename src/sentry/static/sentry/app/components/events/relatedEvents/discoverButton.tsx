import React from 'react';

import {t} from 'app/locale';
import Button from 'app/components/button';
import {IconTelescope} from 'app/icons';
import EventView from 'app/utils/discover/eventView';
import {Organization} from 'app/types';

import {CURRENT_LOCATION} from './types';

type Props = {
  currentLocation: CURRENT_LOCATION;
  eventView: EventView;
  orgSlug: Organization['slug'];
  orgFeatures: Set<string>;
};

const DiscoverButton = ({currentLocation, eventView, orgFeatures, orgSlug}: Props) => {
  if (
    !orgFeatures.has('discover-basic') ||
    currentLocation === CURRENT_LOCATION.DISCOVER
  ) {
    return null;
  }

  const discoverURL = eventView.getResultsViewUrlTarget(orgSlug);

  return (
    <Button size="small" to={discoverURL} icon={<IconTelescope size="xs" />}>
      {t('Open in Discover')}
    </Button>
  );
};

export default DiscoverButton;
