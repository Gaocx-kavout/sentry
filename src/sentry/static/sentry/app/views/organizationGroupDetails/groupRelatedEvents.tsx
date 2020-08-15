import React from 'react';
import styled from '@emotion/styled';

import RelatedEvents from 'app/components/events/relatedEvents';
import EmptyState from 'app/components/events/relatedEvents/emptyState';
import {getCurrentLocation} from 'app/components/events/relatedEvents/utils';
import DiscoverButton from 'app/components/events/relatedEvents/discoverButton';
import space from 'app/styles/space';
import withOrganization from 'app/utils/withOrganization';
import {Organization, GlobalSelection} from 'app/types';
import withGlobalSelection from 'app/utils/withGlobalSelection';

type RelatedEventsProps = React.ComponentProps<typeof RelatedEvents>;
type Props = {
  organization: Organization;
  selection: GlobalSelection;
} & Omit<RelatedEventsProps, 'orgSlug'>;

const GroupRelatedEvents = ({
  eventView,
  organization,
  relatedEvents,
  selection,
}: Props) => {
  const orgSlug = organization.slug;
  const orgFeatures = new Set(organization.features);
  const currentLocation = getCurrentLocation();
  const period = selection.datetime.period;

  if (!relatedEvents.length) {
    return <EmptyState period={period} />;
  }

  return (
    <React.Fragment>
      <Action>
        <DiscoverButton
          orgSlug={orgSlug}
          orgFeatures={orgFeatures}
          currentLocation={currentLocation}
          eventView={eventView}
        />
      </Action>
      <RelatedEvents
        eventView={eventView}
        relatedEvents={relatedEvents}
        orgSlug={orgSlug}
        currentLocation={currentLocation}
        period={period}
      />
    </React.Fragment>
  );
};

export default withOrganization(withGlobalSelection(GroupRelatedEvents));

const Action = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${space(2)};
`;
