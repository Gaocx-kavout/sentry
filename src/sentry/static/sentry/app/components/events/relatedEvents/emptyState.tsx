import React from 'react';

import {tct, t} from 'app/locale';
import EmptyStateWarning from 'app/components/emptyStateWarning';
import {Panel} from 'app/components/panels';
import {DEFAULT_RELATIVE_PERIODS} from 'app/constants';
import {GlobalSelection} from 'app/types';

type Props = {
  period: GlobalSelection['datetime']['period'];
  message?: string;
};

const EmptyState = ({period, message}: Props) => {
  const selectedTimePeriod = period && DEFAULT_RELATIVE_PERIODS[period];

  const displayedPeriod = selectedTimePeriod
    ? selectedTimePeriod.toLowerCase()
    : t('given timeframe');

  return (
    <Panel>
      <EmptyStateWarning small>
        {message ??
          tct('No related events have been found for the [timePeriod].', {
            timePeriod: displayedPeriod,
          })}
      </EmptyStateWarning>
    </Panel>
  );
};

export default EmptyState;
