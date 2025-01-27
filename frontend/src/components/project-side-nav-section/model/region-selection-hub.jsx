import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@mui/material';
import { RegionHubContainer, RegionSelectContainer, RegionSelectMenuItemContainer } from './region-selection-hub-styled';
import { REGION_SELECTION_HUB } from '../../../utils/constants/constants';

function RegionSelectionHub({ setRegion }) {
  //func
  const regionChange = useCallback(
    value => {
      setRegion(value?.target?.value);
    },
    [setRegion]
  );

  return (
    <RegionHubContainer>
      <RegionSelectContainer id="test" defaultValue={REGION_SELECTION_HUB.ALL_REGIONS} onChange={value => regionChange(value)}>
        <RegionSelectMenuItemContainer value={REGION_SELECTION_HUB.ALL_REGIONS}>{REGION_SELECTION_HUB.ALL_REGIONS}</RegionSelectMenuItemContainer>
        <RegionSelectMenuItemContainer value={REGION_SELECTION_HUB.NORTH_AMERICA}>{REGION_SELECTION_HUB.NORTH_AMERICA}</RegionSelectMenuItemContainer>
        <RegionSelectMenuItemContainer value={REGION_SELECTION_HUB.EUROPE}>{REGION_SELECTION_HUB.EUROPE}</RegionSelectMenuItemContainer>
        <RegionSelectMenuItemContainer value={REGION_SELECTION_HUB.CHINA}>{REGION_SELECTION_HUB.CHINA}</RegionSelectMenuItemContainer>
      </RegionSelectContainer>
    </RegionHubContainer>
  );
}

RegionSelectionHub.propTypes = {
  setRegion: PropTypes.func.isRequired,
};

export default RegionSelectionHub;
