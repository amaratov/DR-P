import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box } from '@mui/material';
import {
  DiscoverCustomerViewLabel,
  DiscoverRegionCard,
  DiscoverCustomerViewImg,
  DiscoverCustomerViewChange,
  InlineItemAndValue,
  DiscoverCustomerViewHeaderText,
  DiscoverCustomerIcon,
} from './styled';
import isMissingOrDifferent from './is-missing-or-different';
import { hasFutureChanged, joinJSXWithReduce, reduceDependency } from './dependency-helpers';
import { getSelectedDetailsFromProject } from '../../../../../../../features/selectors/ui';

function CustomerViewApplications({ differences, extras, hasPair, icons, isFuture, named }) {
  const { latencyTolerance, clouds, dataCenters } = extras || { latencyTolerance: null, clouds: [], dataCenters: [] };

  const projectDetails = useSelector(getSelectedDetailsFromProject);

  const latencyDiff = isMissingOrDifferent(latencyTolerance, differences?.extras?.latencyTolerance, isFuture, hasPair);

  const datacenterNames = (dataCenters || [])
    .reduce(reduceDependency('datacenters', hasPair, isFuture, differences, projectDetails), [])
    .reduce(joinJSXWithReduce, []);

  const cloudNames = (clouds || [])
    .map(c => {
      const hasChanged = hasFutureChanged(c, 'clouds', hasPair, isFuture, differences);
      return hasChanged ? <DiscoverCustomerViewChange>{c}</DiscoverCustomerViewChange> : c;
    })
    .reduce(joinJSXWithReduce, []);

  const appIcon = useMemo(() => {
    return icons.find(({ iconName }) => iconName === named);
  }, [icons]);

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" gap="4px">
      <DiscoverRegionCard>
        <Box display="grid" gridTemplateColumns="32px auto" gap={1}>
          <Box item display="flex" gridColumn="span 1" justifyContent="center">
            {appIcon ? <DiscoverCustomerIcon src={appIcon?.storageLocation} alt="logo" /> : <QuestionMarkIcon width="32px" />}
          </Box>
          <Box item alignSelf="center">
            <DiscoverCustomerViewHeaderText>{named}</DiscoverCustomerViewHeaderText>
          </Box>
          <Box item />
          <Box item gridColumnStart="2">
            <DiscoverCustomerViewLabel>
              <p>Application requirements</p>
            </DiscoverCustomerViewLabel>
            <InlineItemAndValue>Latency: {latencyDiff}</InlineItemAndValue>
            <InlineItemAndValue>Datacenter Requirements: {datacenterNames}</InlineItemAndValue>
            <InlineItemAndValue>Cloud Requirements: {cloudNames}</InlineItemAndValue>
          </Box>
        </Box>
      </DiscoverRegionCard>
    </Box>
  );
}

CustomerViewApplications.prototype = {};

CustomerViewApplications.defaultProps = {};

export default CustomerViewApplications;
