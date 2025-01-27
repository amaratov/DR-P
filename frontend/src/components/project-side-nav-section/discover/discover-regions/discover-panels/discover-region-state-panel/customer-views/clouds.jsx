import React from 'react';
import { Box } from '@mui/material';
import { DiscoverRegionHeadText, DiscoverCustomerViewLabel, DiscoverRegionCard } from './styled';

function CustomerViewClouds({ cloud, extras }) {
  const { cloudProviderName, cloudRegionAndOnrampNotes, computeUseCase, generalNotes, networkUseCase, storageUseCase } = extras || {
    cloudProviderName: null,
    cloudRegionAndOnrampNotes: null,
    computeUseCase: null,
    generalNotes: null,
    networkUseCase: null,
    storageUseCase: null,
  };
  return (
    <Box display="grid" flexGrow="1" rowGap="4px">
      <DiscoverRegionHeadText>
        <p style={{ margin: 0 }}>{cloudProviderName}</p>
      </DiscoverRegionHeadText>
      <DiscoverRegionCard>
        {cloudRegionAndOnrampNotes && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>Cloud region & onramp notes</p>
            </DiscoverCustomerViewLabel>
            <p>{cloudRegionAndOnrampNotes}</p>
          </div>
        )}
        {generalNotes && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>General Notes</p>
            </DiscoverCustomerViewLabel>
            <p>{generalNotes}</p>
          </div>
        )}
        {computeUseCase && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>Computer Notes</p>
            </DiscoverCustomerViewLabel>
            <p>{computeUseCase}</p>
          </div>
        )}
        {networkUseCase && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>Network Notes</p>
            </DiscoverCustomerViewLabel>
            <p>{networkUseCase}</p>
          </div>
        )}
        {storageUseCase && (
          <div>
            <DiscoverCustomerViewLabel>
              <p>Storage Notes</p>
            </DiscoverCustomerViewLabel>
            <p>{storageUseCase}</p>
          </div>
        )}
      </DiscoverRegionCard>
    </Box>
  );
}

CustomerViewClouds.prototype = {};

CustomerViewClouds.defaultProps = {};

export default CustomerViewClouds;
