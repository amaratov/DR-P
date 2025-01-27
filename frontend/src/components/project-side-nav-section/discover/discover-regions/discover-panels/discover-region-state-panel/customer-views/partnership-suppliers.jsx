import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { DiscoverRegionCard, DiscoverCustomerViewLabel, DiscoverRegionHeadText, DiscoverCustomerViewHeaderText, DiscoverCustomerIcon } from './styled';
import { getSelectedDetailsFromProject } from '../../../../../../../features/selectors/ui';
import { DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS } from '../../../../../../../utils/constants/constants';
import { isEmpty } from '../../../../../../../utils/utils';

function CustomerViewPartnershipSuppliers({ icons, isFuture, named, projectNotes, region }) {
  const partnerType = named.split('_')[1] || '';

  const headerText = DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS[partnerType.toUpperCase()];

  const projectDetails = useSelector(getSelectedDetailsFromProject);

  // The icons added for partners use the 'partnersuppliers' type and have to be gathered per note
  const partnerTypeIcons = useMemo(() => {
    const iconIds = (projectDetails || []).reduce((acc, detail) => {
      if (
        detail.type === 'partnersuppliers' &&
        detail.isFuture === isFuture &&
        detail.region === region &&
        detail?.extras?.partnerType === partnerType &&
        !isEmpty(detail?.extras?.iconId)
      ) {
        acc.push(detail.extras.iconId);
      }
      return acc;
    }, []);

    return icons.filter(i => iconIds.includes(i.id));
  }, [icons, projectDetails]);

  return (
    <Box display="flex" flexDirection="column" flexGrow="1" gap="4px">
      <DiscoverRegionCard>
        <DiscoverCustomerViewHeaderText>{headerText}</DiscoverCustomerViewHeaderText>
        <Box display="flex" flexWrap="wrap" gap="4px" margin="12px 0">
          {partnerTypeIcons.map(icon => (
            <DiscoverCustomerIcon src={icon.storageLocation} alt={icon.iconName} />
          ))}
        </Box>
        <DiscoverCustomerViewLabel>
          <p>{partnerType === 'migration' ? 'Migration' : partnerType?.toUpperCase()} notes</p>
        </DiscoverCustomerViewLabel>
        <p>{projectNotes || '-'}</p>
      </DiscoverRegionCard>
    </Box>
  );
}

CustomerViewPartnershipSuppliers.prototype = {};

CustomerViewPartnershipSuppliers.defaultProps = {};

export default CustomerViewPartnershipSuppliers;
