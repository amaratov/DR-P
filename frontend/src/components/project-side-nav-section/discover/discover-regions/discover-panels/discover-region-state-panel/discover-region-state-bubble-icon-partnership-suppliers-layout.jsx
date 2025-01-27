import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  DiscoverRegionStateBubbleContainer,
  DiscoverRegionStateBubbleContainerIcon,
  DiscoverRegionStateBubbleContainerImage,
  DiscoverRegionStateBubblePartnershipAndSuppliersListSection,
  DiscoverRegionStateBubblePartnershipAndSuppliersIconRow,
  DiscoverRegionStateBubblePartnershipAndSuppliersIconList,
  DiscoverRegionStateBubblePartnershipAndSuppliersSectionTitle,
} from '../../discover-region-section-styled';
import { BUTTON_ICON, BUTTON_STYLE, DISCOVER_REGION_FIELDS, EDIT_MODE } from '../../../../../../utils/constants/constants';
import MoreMenuButton from '../../../../../more-menu-button/more-menu-button';
import DiscoverRegionStateBubbleIconAdd from './discover-region-state-bubble-icon-add';
import {
  ArtifactLibraryIcon,
  ArtifactLibraryIconContainer,
} from '../../../../../my-accout/admin-panel/artifact-library/artifact-library-icons/artifact-library-icon-styled';
import { getNotesNamed } from '../../../../../../utils/utils';
import DiscoverRegionNotes from './discover-region-notes';
import CustomButton from '../../../../../form-elements/custom-button';

function DiscoverRegionStateBubbleIconPartnershipSuppliersLayout({ title, fieldName, activeIcons, stateValues, handleTabSelect, handleDirectRemove }) {
  const availableValues = useMemo(() => {
    return stateValues?.filter(
      sv => sv?.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS && sv?.extras?.partnerType === fieldName
    );
  }, [stateValues, fieldName]);

  return (
    <DiscoverRegionStateBubblePartnershipAndSuppliersListSection>
      <DiscoverRegionStateBubblePartnershipAndSuppliersIconRow>
        <DiscoverRegionStateBubblePartnershipAndSuppliersSectionTitle>{title}</DiscoverRegionStateBubblePartnershipAndSuppliersSectionTitle>
        <DiscoverRegionStateBubblePartnershipAndSuppliersIconList>
          {availableValues?.map(value => {
            const workingIcon = activeIcons?.find(v => v?.id === value?.extras?.iconId || v?.iconName === value?.named);
            const previewUrl = workingIcon?.storageLocation || '';
            const iconName = workingIcon?.iconName || value?.named;
            return (
              <DiscoverRegionStateBubbleContainer onClick={() => handleTabSelect(fieldName)} onKeyDown={() => handleTabSelect(fieldName)}>
                <DiscoverRegionStateBubbleContainerIcon>
                  <DiscoverRegionStateBubbleContainerImage>
                    <ArtifactLibraryIconContainer>
                      <ArtifactLibraryIcon imgUrl={previewUrl}>{previewUrl ? '' : <QuestionMarkIcon />}</ArtifactLibraryIcon>
                    </ArtifactLibraryIconContainer>
                  </DiscoverRegionStateBubbleContainerImage>
                  <div style={{ position: 'absolute', justifySelf: 'right' }}>
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.DISCOVER_REGION_REMOVE_STYLE}
                      icon={BUTTON_ICON.CANCEL}
                      bgColor="var(--color-homeworld)"
                      useColor="var(--color-la-luna)"
                      borderRadius="20px"
                      type="button"
                      customMinWidth="25px"
                      customMinHeight="25px"
                      customMarginLeft="-20px"
                      onClickFunc={() => handleDirectRemove(value)}
                    />
                  </div>
                </DiscoverRegionStateBubbleContainerIcon>
                <div>{iconName}</div>
              </DiscoverRegionStateBubbleContainer>
            );
          })}
          <DiscoverRegionStateBubbleIconAdd activeTab={String(fieldName).toUpperCase()} />
        </DiscoverRegionStateBubblePartnershipAndSuppliersIconList>
      </DiscoverRegionStateBubblePartnershipAndSuppliersIconRow>
      <DiscoverRegionNotes fieldId={getNotesNamed(fieldName)} />
    </DiscoverRegionStateBubblePartnershipAndSuppliersListSection>
  );
}

DiscoverRegionStateBubbleIconPartnershipSuppliersLayout.prototype = {
  title: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  activeIcons: PropTypes.shape([]),
  stateValues: PropTypes.shape([]),
  handleTabSelect: PropTypes.func,
  handleDirectRemove: PropTypes.func,
};

DiscoverRegionStateBubbleIconPartnershipSuppliersLayout.defaultProps = {
  activeIcons: [],
  stateValues: [],
  handleTabSelect: () => {},
  handleDirectRemove: () => {},
};

export default DiscoverRegionStateBubbleIconPartnershipSuppliersLayout;
