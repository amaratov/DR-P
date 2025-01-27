import React from 'react';
import { Box } from '@mui/material';
import { DiscoverCustomerViewLabel, DiscoverRegionCard } from './styled';
import { REGIONS_INNER_TABS } from '../../../../../../../utils/constants/constants';
import isMissingOrDifferent from './is-missing-or-different';

const initExtras = {
  relNotes: null,
};

function CustomerViewCompliance({ differences, extras, named, stateInfo, isFuture }) {
  const { relNotes } = extras || { ...initExtras };

  const checkStateInfo = isFuture ? REGIONS_INNER_TABS.FUTURE_STATE : REGIONS_INNER_TABS.CURRENT_STATE;

  const iconTextDiff = isMissingOrDifferent(named, differences?.stateInfo || checkStateInfo);
  const relNotesDiff = isMissingOrDifferent(relNotes, differences?.relNotes, stateInfo || checkStateInfo);

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" gap="4px">
      <DiscoverRegionCard>
        <div>
          <DiscoverCustomerViewLabel>
            <p>Relevant Notes</p>
          </DiscoverCustomerViewLabel>
          <p>{relNotesDiff}</p>
        </div>
      </DiscoverRegionCard>
      <DiscoverRegionCard>
        <div>
          <p>{iconTextDiff}</p>
        </div>
      </DiscoverRegionCard>
    </Box>
  );
}

CustomerViewCompliance.prototype = {};

CustomerViewCompliance.defaultProps = {};

export default CustomerViewCompliance;
