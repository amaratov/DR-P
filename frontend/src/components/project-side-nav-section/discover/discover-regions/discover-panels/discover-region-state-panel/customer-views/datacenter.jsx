import React from 'react';
import { Box } from '@mui/material';
import { DiscoverRegionHeadText, DiscoverCustomerViewLabel, DiscoverRegionCard } from './styled';
import { singularOrPlural } from '../../../../../../../utils/utils';
import isMissingOrDifferent from './is-missing-or-different';

function powerUnit(amount) {
  return amount >= 1000 ? '>1mW' : `${amount}kW`;
}

function CustomerViewDatacenter({ address, differences, extras, hasPair, isFuture, named, region }) {
  const { cabinets, cage, city, country, hosting, powerMax, powerMin, stateProvince } = extras || {
    cabinets: 0,
    cage: 0,
    city: null,
    country: null,
    hosting: null,
    powerMax: 0,
    powerMin: 0,
    stateProvince: null,
  };

  const addressDiff = isMissingOrDifferent(address, differences?.address, isFuture, hasPair);
  const powerMinDiff = isMissingOrDifferent(powerUnit(powerMin), differences?.extras?.cabinets, isFuture, hasPair);
  const powerMaxDiff = isMissingOrDifferent(powerUnit(powerMax), differences?.extras?.cabinets, isFuture, hasPair);
  const cabinetsDiff = isMissingOrDifferent(singularOrPlural(Number(cabinets), 'Cabinet'), differences?.extras?.cabinets, isFuture, hasPair);
  const cagesDiff = isMissingOrDifferent(singularOrPlural(Number(cage), 'Cage'), differences?.extras?.cabinets, isFuture, hasPair);
  const hostingDiff = isMissingOrDifferent(hosting, differences?.extras?.cabinets, isFuture, hasPair);

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" gap="4px">
      <DiscoverRegionHeadText>{named || region}</DiscoverRegionHeadText>
      <DiscoverRegionCard>
        {(country || stateProvince || city) && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>Country, state, city</p>
            </DiscoverCustomerViewLabel>
            <p>
              {country}, {stateProvince}, {city}
            </p>
          </div>
        )}
        {address && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>Data center address</p>
            </DiscoverCustomerViewLabel>
            <p>{addressDiff}</p>
          </div>
        )}
        <div>
          <DiscoverCustomerViewLabel>
            <p>Preferences</p>
          </DiscoverCustomerViewLabel>
          <p>
            {powerMinDiff} ~ {powerMaxDiff}, {cabinetsDiff}, {cagesDiff}, {hostingDiff}
          </p>
        </div>
      </DiscoverRegionCard>
    </Box>
  );
}

CustomerViewDatacenter.prototype = {};

CustomerViewDatacenter.defaultProps = {};

export default CustomerViewDatacenter;
