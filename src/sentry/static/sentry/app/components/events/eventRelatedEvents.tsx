import React from 'react';
import {Location} from 'history';
import uniqBy from 'lodash/uniqBy';

import {t} from 'app/locale';
import {Organization, GlobalSelection, Event} from 'app/types';
import EventView from 'app/utils/discover/eventView';
import DiscoverQuery from 'app/utils/discover/discoverQuery';
import withGlobalSelection from 'app/utils/withGlobalSelection';
import LoadingIndicator from 'app/components/loadingIndicator';
import EventDataSection from 'app/components/events/eventDataSection';

import RelatedEvents from './relatedEvents';
import EmptyState from './relatedEvents/emptyState';
import {getCurrentLocation} from './relatedEvents/utils';
import DiscoverButton from './relatedEvents/discoverButton';

type Props = {
  location: Location;
  event: Event;
  organization: Organization;
  selection: GlobalSelection;
};

type State = {
  isLoading: boolean;
  orgFeatures: Set<string>;
  orgSlug: string;
  period: GlobalSelection['datetime']['period'];
  eventView?: EventView;
};

class EventRelatedEvents extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    orgFeatures: new Set(this.props.organization.slug),
    orgSlug: this.props.organization.slug,
    period: this.props.selection.datetime.period,
  };

  componentDidMount() {
    this.getEventView();
  }

  getEventView() {
    const {event, organization} = this.props;

    // traceId should always be defined, expect if the customers are using old SDK's, or SDKs on native where there isn't any tracing support
    const traceId = event.contexts?.trace?.trace_id;

    if (!traceId) {
      this.setState({isLoading: false});
      return;
    }

    const {period} = this.state;
    const orgFeatures = new Set(organization.features);

    const eventFromSavedQuery = EventView.fromSavedQuery({
      id: undefined,
      name: `Events with Trace ID ${traceId}`,
      fields: [
        'title',
        'event.type',
        'project',
        'project.id',
        'trace.span',
        'timestamp',
        'lastSeen',
        'issue',
      ],
      orderby: '-timestamp',
      query: `trace:${traceId}`,
      projects: orgFeatures.has('global-views') ? [-1] : [Number(event.projectID)],
      version: 2,
      range: period ?? '24h',
    });

    this.setState({eventView: eventFromSavedQuery, isLoading: false});
  }

  renderEmptyState(period: GlobalSelection['datetime']['period'], message?: string) {
    return <EmptyState period={period} message={message} />;
  }

  render() {
    const {location, event} = this.props;
    const {isLoading, eventView, orgSlug, orgFeatures, period} = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!eventView) {
      return this.renderEmptyState(period);
    }

    const currentLocation = getCurrentLocation();

    return (
      <EventDataSection
        type="related-events"
        title={t('Related Events')}
        actions={
          <DiscoverButton
            currentLocation={currentLocation}
            eventView={eventView}
            orgSlug={orgSlug}
            orgFeatures={orgFeatures}
          />
        }
      >
        <DiscoverQuery location={location} eventView={eventView} orgSlug={orgSlug}>
          {discoverData => {
            if (discoverData.isLoading) {
              return <LoadingIndicator />;
            }

            if (!discoverData.tableData?.data) {
              return this.renderEmptyState(
                period,
                t(
                  "Sorry, but it seems that you don't have access to the discover endpoints"
                )
              );
            }

            const relatedEvents = uniqBy(discoverData.tableData?.data, 'id').filter(
              evt => evt.id !== event?.id
            );

            if (!relatedEvents.length) {
              return this.renderEmptyState(period);
            }

            return (
              <RelatedEvents
                relatedEvents={relatedEvents}
                eventView={eventView}
                currentLocation={currentLocation}
                orgSlug={orgSlug}
                period={period}
              />
            );
          }}
        </DiscoverQuery>
      </EventDataSection>
    );
  }
}

export default withGlobalSelection(EventRelatedEvents);
