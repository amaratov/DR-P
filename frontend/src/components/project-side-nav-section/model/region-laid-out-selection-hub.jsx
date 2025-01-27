import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { RegionLaidOutHubContainer, RegionValueContainer } from './region-selection-hub-styled';
import { REGION_SELECTION_HUB } from '../../../utils/constants/constants';

function RegionLaidOutSelectionHub({ setRegion }) {
  //state
  const [updateRegion, setUpdateRegion] = useState(REGION_SELECTION_HUB.ALL_REGIONS);

  //func
  const regionChange = useCallback(
    value => {
      setRegion(value);
    },
    [setRegion]
  );

  return (
    <RegionLaidOutHubContainer>
      <RegionValueContainer
        type="button"
        onClick={() => {
          setRegion(REGION_SELECTION_HUB.CHINA);
          setUpdateRegion(REGION_SELECTION_HUB.CHINA);
        }}
        style={{
          backgroundColor: updateRegion === REGION_SELECTION_HUB.CHINA ? '#ffffffcc' : 'var(--color-la-luna)',
          color: updateRegion === REGION_SELECTION_HUB.CHINA ? '#000000' : '#3e53c1',
        }}>
        {REGION_SELECTION_HUB.CHINA}
      </RegionValueContainer>
      <RegionValueContainer
        type="button"
        onClick={() => {
          setRegion(REGION_SELECTION_HUB.EUROPE);
          setUpdateRegion(REGION_SELECTION_HUB.EUROPE);
        }}
        style={{
          backgroundColor: updateRegion === REGION_SELECTION_HUB.EUROPE ? '#ffffffcc' : 'var(--color-la-luna)',
          color: updateRegion === REGION_SELECTION_HUB.EUROPE ? '#000000' : '#3e53c1',
        }}>
        {REGION_SELECTION_HUB.EUROPE}
      </RegionValueContainer>
      <RegionValueContainer
        type="button"
        onClick={() => {
          setRegion(REGION_SELECTION_HUB.NORTH_AMERICA);
          setUpdateRegion(REGION_SELECTION_HUB.NORTH_AMERICA);
        }}
        style={{
          backgroundColor: updateRegion === REGION_SELECTION_HUB.NORTH_AMERICA ? '#ffffffcc' : 'var(--color-la-luna)',
          color: updateRegion === REGION_SELECTION_HUB.NORTH_AMERICA ? '#000000' : '#3e53c1',
        }}>
        {REGION_SELECTION_HUB.NORTH_AMERICA}
      </RegionValueContainer>
      <RegionValueContainer
        type="button"
        onClick={() => {
          setRegion(REGION_SELECTION_HUB.ALL_REGIONS);
          setUpdateRegion(REGION_SELECTION_HUB.ALL_REGIONS);
        }}
        style={{
          backgroundColor: updateRegion === REGION_SELECTION_HUB.ALL_REGIONS ? '#ffffffcc' : 'var(--color-la-luna)',
          color: updateRegion === REGION_SELECTION_HUB.ALL_REGIONS ? '#000000' : '#3e53c1',
        }}>
        {REGION_SELECTION_HUB.ALL_REGIONS}
      </RegionValueContainer>
    </RegionLaidOutHubContainer>
  );
}

RegionLaidOutSelectionHub.propTypes = {
  setRegion: PropTypes.func.isRequired,
};

export default RegionLaidOutSelectionHub;
