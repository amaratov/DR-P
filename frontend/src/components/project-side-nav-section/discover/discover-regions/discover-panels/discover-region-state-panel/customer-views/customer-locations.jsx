import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { DiscoverRegionHeadText, DiscoverRegionCard, DiscoverCustomerViewLabel, InlineItemAndValue, DiscoverCustomerViewChange } from './styled';
import { singularOrPlural } from '../../../../../../../utils/utils';
import isMissingOrDifferent from './is-missing-or-different';
import { hasFutureChanged, joinJSXWithReduce, reduceDependency } from './dependency-helpers';
import { getSelectedDetailsFromProject } from '../../../../../../../features/selectors/ui';

function CustomerViewCustomerLocations({ address, differences, extras, hasPair, isFuture }) {
  const { applications, city, clouds, country, datacenters, numberOfLocations, officeName, stateProvince, totalUsers } = extras || {
    applications: [],
    city: null,
    clouds: [],
    country: null,
    datacenters: [],
    numberOfLocations: null,
    officeName: null,
    stateProvince: null,
    totalUsers: null,
  };

  const projectDetails = useSelector(getSelectedDetailsFromProject);

  const applicationNames = (applications || [])
    .reduce(reduceDependency('applications', hasPair, isFuture, differences, projectDetails), [])
    .reduce(joinJSXWithReduce, []);

  const datacenterNames = (datacenters || [])
    .reduce(reduceDependency('datacenters', hasPair, isFuture, differences, projectDetails), [])
    .reduce(joinJSXWithReduce, []);

  const cloudNames = (clouds || [])
    .map(c => {
      const hasChanged = hasFutureChanged(c, 'clouds', hasPair, isFuture, differences);
      return hasChanged ? <DiscoverCustomerViewChange>{c}</DiscoverCustomerViewChange> : c;
    })
    .reduce(joinJSXWithReduce, []);

  const addressDiff = isMissingOrDifferent(address, differences?.address, isFuture, hasPair);
  const countryDiff = isMissingOrDifferent(country, differences?.extras?.country, isFuture, hasPair);
  const cityDiff = isMissingOrDifferent(city, differences?.extras?.city, isFuture, hasPair);
  const locationsDiff = isMissingOrDifferent(
    singularOrPlural(Number(numberOfLocations), 'Location'),
    differences?.extras?.numberOfLocations,
    isFuture,
    hasPair
  );
  const stateProvinceDiff = isMissingOrDifferent(stateProvince, differences?.extras?.stateProvince, isFuture, hasPair);
  const usersDiff = isMissingOrDifferent(singularOrPlural(Number(totalUsers), 'User'), differences?.extras?.totalUsers, isFuture, hasPair);

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" gap="4px">
      <DiscoverRegionHeadText>
        {officeName} • {locationsDiff} • {usersDiff}
      </DiscoverRegionHeadText>
      <DiscoverRegionCard>
        <DiscoverCustomerViewLabel>Country, state, city</DiscoverCustomerViewLabel>
        <div>
          <p>
            {countryDiff}, {stateProvinceDiff}, {cityDiff}
          </p>
        </div>
        <DiscoverCustomerViewLabel>
          <p>Data center address</p>
        </DiscoverCustomerViewLabel>
        <div>{addressDiff}&nbsp;</div>
        <div>
          <DiscoverCustomerViewLabel>
            <p>Location requirements</p>
          </DiscoverCustomerViewLabel>
          <InlineItemAndValue>Application Requirements: {applicationNames}</InlineItemAndValue>
          <InlineItemAndValue>Datacenter Requirements: {datacenterNames}</InlineItemAndValue>
          <InlineItemAndValue>Cloud Requirements: {cloudNames}</InlineItemAndValue>
        </div>
      </DiscoverRegionCard>
    </Box>
  );
}

CustomerViewCustomerLocations.prototype = {};

CustomerViewCustomerLocations.defaultProps = {};

export default CustomerViewCustomerLocations;
